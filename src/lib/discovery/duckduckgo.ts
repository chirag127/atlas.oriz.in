export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

export async function searchDuckDuckGo(
  query: string,
  maxResults = 10
): Promise<SearchResult[]> {
  try {
    // Use DuckDuckGo HTML search (no API key needed)
    const encoded = encodeURIComponent(query);
    const res = await fetch(
      `https://html.duckduckgo.com/html/?q=${encoded}`,
      {
        headers: {
          "User-Agent": "Atlas/1.0 (+https://atlas.oriz.in)",
        },
      }
    );

    if (!res.ok) return [];
    const html = await res.text();
    return parseSearchResults(html, maxResults);
  } catch (e) {
    console.error("[Discovery] DuckDuckGo search failed:", e);
    return [];
  }
}

function parseSearchResults(html: string, max: number): SearchResult[] {
  const results: SearchResult[] = [];

  // Extract result blocks
  const resultRegex = /<a[^>]+class="result__a"[^>]+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = resultRegex.exec(html)) !== null && results.length < max) {
    const url = decodeURIComponent(match[1]?.replace(/.*uddg=/, "").replace(/&.*/, "") ?? "");
    const title = stripTags(match[2] ?? "").trim();
    const snippet = stripTags(match[3] ?? "").trim();

    if (url && title && !url.includes("duckduckgo.com")) {
      results.push({
        title,
        url,
        snippet,
        source: "duckduckgo",
      });
    }
  }

  return results;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;/g, "'");
}

export function generateDiscoveryQueries(interests: string[]): string[] {
  const month = new Date().toISOString().slice(0, 7);
  return interests.flatMap((interest) => [
    `${interest} ${month}`,
    `best ${interest} tools this week`,
    `${interest} breakthrough research`,
    `${interest} open source project`,
  ]);
}
