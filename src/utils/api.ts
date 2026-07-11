import type { MonitorsResult } from "@/types/main";

const API_BASE = "/api";

/**
 * Fetch site monitors data from backend API.
 */
export const getMonitors = async (): Promise<MonitorsResult> => {
  const response = await fetch(`${API_BASE}/getMonitors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const result: MonitorsResult = await response.json().catch(() => ({
    code: response.status,
    message: response.statusText || "Unknown error",
    source: "api",
    data: undefined,
  }));

  const errorMessage = result.message || `API error: ${response.status} ${response.statusText}`;
  const errorSource = result.source || "api";

  if (!response.ok || result.code !== 200) {
    throw new Error(`[${errorSource} ${result.code}] ${errorMessage}`);
  }

  return result;
};