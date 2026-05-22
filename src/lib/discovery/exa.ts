import type { WebSearchResult } from "./web-search";

export async function searchExa(
  query: string,
  apiKey: string
): Promise<WebSearchResult[]> {
  const res = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({ query, numResults: 10 }),
  });

  if (!res.ok) return [];
  const data = await res.json();
  return (data.results ?? []).map(
    (r: { title: string; url: string; snippet: string }) => ({
      title: r.title,
      url: r.url,
      snippet: r.snippet,
      source: "exa",
    })
  );
}
