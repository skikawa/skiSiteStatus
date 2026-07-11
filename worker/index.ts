import { handleGetMonitors, type ApiConfig } from "../src/api/getMonitors";

interface Env {
  API_URL?: string;
  API_KEY?: string;
  COUNT_DAYS?: string;
  SHOW_LINKS?: string;
  ASSETS?: { fetch: (request: Request) => Promise<Response> };
}

function getEnvValue(env: Env, key: keyof Env): string {
  const value = (env as Record<string, unknown>)[key];
  return typeof value === "string" ? value : "";
}

export default {
  async fetch(request: Request, env: Env, _ctx: { waitUntil: (p: Promise<any>) => void }): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/getMonitors" && request.method === "POST") {
      const config: ApiConfig = {
        apiUrl: getEnvValue(env, "API_URL"),
        apiKey: getEnvValue(env, "API_KEY"),
        countDays: parseInt(getEnvValue(env, "COUNT_DAYS") || "60", 10),
        showLinks: getEnvValue(env, "SHOW_LINKS") !== "false",
      };
      return handleGetMonitors(request, config);
    }

    // Serve static assets
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    // Fallback 404 if ASSETS is not available
    return new Response("Not Found", { status: 404 });
  },
};