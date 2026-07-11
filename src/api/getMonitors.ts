/**
 * Shared API handler — zero platform dependencies.
 * Used by both Vercel (api/) and Cloudflare Workers (worker/) adapters.
 *
 * All types and logic are self-contained; only standard Web APIs are used
 * (Request, Response, fetch, Map, Date, JSON).
 */

// --- Types ---

export interface ApiConfig {
  apiUrl: string;
  apiKey: string;
  countDays: number;
  showLinks: boolean;
}

interface SiteDaysStatus {
  date?: number;
  percent: number;
  down: { times: number; duration: number };
}

interface SiteStatusType extends SiteDaysStatus {
  id: number;
  name: string;
  status: 0 | 1 | 2 | 8 | 9;
  type: 1 | 2 | 3 | 4 | 5;
  interval: number;
  days: SiteDaysStatus[];
  url?: string;
}

interface MonitorsDataResult {
  status: { count: number; ok: number; error: number; unknown: number };
  data: SiteStatusType[];
  timestamp: number;
}

// --- Cache (memory, per-isolate / warm instance) ---

const CACHE_TTL_MS = 60 * 1000;
const cache = new Map<string, { data: MonitorsDataResult; expiry: number }>();

function getCache(): MonitorsDataResult | undefined {
  const entry = cache.get("site-data");
  if (entry && Date.now() < entry.expiry) return entry.data;
  return undefined;
}

function setCache(data: MonitorsDataResult): void {
  cache.set("site-data", { data, expiry: Date.now() + CACHE_TTL_MS });
}

// --- Helpers ---

const formatNumber = (num: number): number => Math.floor(num * 100) / 100;
const API_TIMEOUT_MS = 15_000;

function normalizeApiUrl(apiUrl: string): string {
  const trimmed = apiUrl.trim();
  if (!trimmed) return "";
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}

function isV3ApiUrl(apiUrl: string): boolean {
  return normalizeApiUrl(apiUrl).includes("/v3/");
}

function buildUpstreamUrl(apiUrl: string): string {
  const normalized = normalizeApiUrl(apiUrl);
  if (!normalized) return "";
  return isV3ApiUrl(normalized) ? `${normalized}monitors` : `${normalized}getMonitors`;
}

function mapV3MonitorStatus(status: string | undefined): 0 | 1 | 2 | 8 | 9 {
  switch (status?.toUpperCase()) {
    case "UP":
      return 2;
    case "DOWN":
      return 8;
    case "PAUSED":
    case "MUTED":
      return 0;
    default:
      return 1;
  }
}

function mapV3MonitorType(type: string | undefined): 1 | 2 | 3 | 4 | 5 {
  switch (type?.toUpperCase()) {
    case "HTTP":
    case "HTTPS":
      return 1;
    case "KEYWORD":
      return 2;
    case "PING":
      return 3;
    case "PORT":
      return 4;
    case "HEARTBEAT":
      return 5;
    default:
      return 1;
  }
}

function formatV3SiteData(
  data: any,
  dates: Date[],
  showLink: boolean,
): MonitorsDataResult | undefined {
  if (!data?.data) return undefined;
  const sites: any[] = data.data;

  const formatData = sites.map((site: any): SiteStatusType => {
    const uptimePercent = typeof site.all_time_uptime_ratio === "number"
      ? site.all_time_uptime_ratio
      : site?.lastDayUptimes?.histogram?.length
        ? formatNumber(site.lastDayUptimes.histogram.reduce((sum: number, value: number) => sum + value, 0) / site.lastDayUptimes.histogram.length)
        : 100;

    const percent = formatNumber(uptimePercent);
    const dailyData: SiteDaysStatus[] = dates.map((date) => ({
      date: Math.floor(date.getTime() / 1000),
      percent,
      down: { times: 0, duration: 0 },
    }));

    return {
      id: site.id,
      name: site?.friendly_name || site?.friendlyName || site?.url || "未命名站点",
      url: showLink ? site?.url : undefined,
      status: mapV3MonitorStatus(site?.status),
      type: mapV3MonitorType(site?.type),
      interval: site?.interval ?? 0,
      percent,
      days: dailyData.reverse(),
      down: { times: 0, duration: 0 },
    };
  });

  return {
    status: formatData.reduce(
      (acc, site) => {
        if (site.status === 2) acc.ok++;
        else if (site.status === 8 || site.status === 9) acc.error++;
        else if (site.status === 0 || site.status === 1) acc.unknown++;
        return acc;
      },
      { count: formatData.length, ok: 0, error: 0, unknown: 0 },
    ),
    data: formatData,
    timestamp: Date.now(),
  };
}

function getDateRanges(countDays: number) {
  const dates: Date[] = [];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  for (let d = 0; d < countDays; d++) {
    const date = new Date(today);
    date.setDate(date.getDate() - d);
    dates.push(date);
  }

  const ranges = dates.map((date) => {
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    return `${Math.floor(date.getTime() / 1000)}_${Math.floor(next.getTime() / 1000)}`;
  });

  const last = dates[dates.length - 1];
  const start = last ? Math.floor(last.getTime() / 1000) : Math.floor(today.getTime() / 1000);
  const end = Math.floor(new Date(today.getTime() + 86400000).getTime() / 1000);
  ranges.push(`${start}_${end}`);

  return { dates, ranges: ranges.join("-"), start, end };
}

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function formatSiteData(
  data: any,
  dates: Date[],
  showLink: boolean,
): MonitorsDataResult | undefined {
  if (!data?.monitors) return undefined;
  const sites: any[] = data.monitors;

  const formatData = sites.map((site: any): SiteStatusType => {
    const ranges = site.custom_uptime_ranges.split("-");
    const percent = formatNumber(ranges.pop() || 0);
    const dailyData: SiteDaysStatus[] = [];
    const timeMap = new Map<string, number>();

    dates.forEach((date, index) => {
      timeMap.set(formatDateKey(date), index);
      dailyData[index] = {
        date: Math.floor(date.getTime() / 1000),
        percent: formatNumber(ranges[index] || 0),
        down: { times: 0, duration: 0 },
      };
    });

    const total = { times: 0, duration: 0 };
    site?.logs?.forEach((log: any) => {
      if (log?.type === 1 || log?.type === 99) {
        const logDate = new Date(log?.datetime * 1000);
        const dateKey = formatDateKey(logDate);
        const dateIndex = timeMap.get(dateKey);
        if (dateIndex !== undefined && dailyData[dateIndex]) {
          dailyData[dateIndex].down.times += 1;
          dailyData[dateIndex].down.duration += log.duration;
        }
        total.times += 1;
        total.duration += log.duration;
      }
    });

    return {
      id: site.id,
      name: site?.friendly_name || "未命名站点",
      url: showLink ? site?.url : undefined,
      status: site?.status ?? 8,
      type: site?.type ?? 1,
      interval: site?.interval ?? 0,
      percent,
      days: dailyData.reverse(),
      down: total,
    };
  });

  return {
    status: formatData.reduce(
      (acc, site) => {
        if (site.status === 2) acc.ok++;
        else if (site.status === 8 || site.status === 9) acc.error++;
        else if (site.status === 0 || site.status === 1) acc.unknown++;
        return acc;
      },
      { count: formatData.length, ok: 0, error: 0, unknown: 0 },
    ),
    data: formatData,
    timestamp: Date.now(),
  };
}

function jsonResponse(data: object, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

// --- Shared Handler ---

export async function handleGetMonitors(
  request: Request,
  config: ApiConfig,
): Promise<Response> {
  // Referer check
  const referer = request.headers.get("referer");
  if (!referer) {
    return jsonResponse({ code: 403, message: "Access Denied", source: "api", data: null }, 403);
  }

  // Validate config
  if (!config.apiUrl || !config.apiKey) {
    return jsonResponse({
      code: 500,
      message: "Missing API_URL or API_KEY. Please set them in Cloudflare Worker Settings > Variables/Secrets.",
      source: "api",
      data: null,
    }, 500);
  }

  try {
    // Check cache
    const cachedData = getCache();
    if (cachedData) {
      return jsonResponse({ code: 200, message: "success", source: "cache", data: cachedData });
    }

    // Generate date ranges
    const { dates, ranges, start, end } = getDateRanges(config.countDays);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    try {
      const url = buildUpstreamUrl(config.apiUrl);
      const headers: Record<string, string> = {
        Accept: "application/json",
      };

      let fetchOptions: RequestInit;
      if (isV3ApiUrl(config.apiUrl)) {
        headers.Authorization = `Bearer ${config.apiKey}`;
        fetchOptions = {
          method: "GET",
          headers,
          signal: controller.signal,
        };
      } else {
        headers["Content-Type"] = "application/json";
        fetchOptions = {
          method: "POST",
          headers,
          body: JSON.stringify({
            api_key: config.apiKey,
            format: "json",
            logs: 1,
            log_types: "1-2",
            logs_start_date: start,
            logs_end_date: end,
            custom_uptime_ranges: ranges,
          }),
          signal: controller.signal,
        };
      }

      const result = await fetch(url, fetchOptions);
      const responseText = await result.text();
      let data: any = null;
      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch {
        throw new Error(`Invalid JSON from upstream: ${responseText}`);
      }

      if (!result.ok) {
        throw new Error(`Upstream request failed: ${result.status} ${result.statusText}`);
      }

      const formattedData = isV3ApiUrl(config.apiUrl)
        ? formatV3SiteData(data, dates, config.showLinks)
        : formatSiteData(data, dates, config.showLinks);
      if (!formattedData) throw new Error("Failed to format site data");

      // Cache result
      setCache(formattedData);

      return jsonResponse({ code: 200, message: "success", source: "api", data: formattedData });
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return jsonResponse({ code: 504, message: "Upstream request timed out", source: "api", data: null }, 504);
    }
    console.error("[getMonitors]", error);
    return jsonResponse(
      { code: 500, message: error instanceof Error ? error.message : "Unknown error", source: "api", data: null },
      500,
    );
  }
}