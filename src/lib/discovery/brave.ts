import type { WebSearchResult } from "./web-search";

export async function searchBrave(
  query: string,
  apiKey: string
): Promise<WebSearchResult[]> {
  const res = await fetch(
    `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`,
    { headers: { "Accept": "application/json", "X-Subscription-Token": apiKey } }
  );

  if (!res.ok) return [];
  const data = await res.json();
  return (data.web?.results ?? []).map(
    (r: { title: string; url: string; description: string }) => ({
      title: r.title,
      url: r.url,
      snippet: r.description,
      source: "brave",
    })
  );
}
