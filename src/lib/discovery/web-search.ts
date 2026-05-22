import { searchDuckDuckGo } from "./duckduckgo";

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

export interface WebSearchConfig {
  duckduckgoEnabled: boolean;
  serperApiKey?: string;
  tavilyApiKey?: string;
  braveSearchApiKey?: string;
  exaApiKey?: string;
}

export async function searchWeb(
  query: string,
  config?: Partial<WebSearchConfig>
): Promise<WebSearchResult[]> {
  const results: WebSearchResult[] = [];

  if (config?.duckduckgoEnabled ?? true) {
    try {
      const ddg = await searchDuckDuckGo(query);
      results.push(...ddg.map((r: WebSearchResult) => ({ ...r, source: "duckduckgo" })));
    } catch {
      // DuckDuckGo failed, try other providers
    }
  }

  if (config?.serperApiKey) {
    try {
      const serper = await searchSerper(query, config.serperApiKey);
      results.push(...serper);
    } catch {
      // Serper failed
    }
  }

  if (config?.tavilyApiKey) {
    try {
      const tavily = await searchTavily(query, config.tavilyApiKey);
      results.push(...tavily);
    } catch {
      // Tavily failed
    }
  }

  return results;
}

async function searchSerper(query: string, key: string): Promise<WebSearchResult[]> {
  const res = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: { "X-API-KEY": key, "Content-Type": "application/json" },
    body: JSON.stringify({ q: query }),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.organic ?? []).map((r: { title: string; link: string; snippet: string }) => ({
    title: r.title, url: r.link, snippet: r.snippet, source: "serper",
  }));
}

async function searchTavily(query: string, key: string): Promise<WebSearchResult[]> {
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: key, query, max_results: 10 }),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results ?? []).map((r: { title: string; url: string; content: string }) => ({
    title: r.title, url: r.url, snippet: r.content, source: "tavily",
  }));
}
