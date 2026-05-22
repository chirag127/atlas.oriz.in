import Parser from "rss-parser";

export interface ParsedArticle {
  title: string;
  url: string;
  author?: string;
  content?: string;
  summary?: string;
  imageUrl?: string;
  publishedAt?: Date;
  tags?: string[];
}

const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent": "Atlas/1.0 (+https://atlas.oriz.in)",
  },
});

export async function parseFeed(feedUrl: string): Promise<ParsedArticle[]> {
  try {
    const feed = await parser.parseURL(feedUrl);
    return (feed.items ?? []).map((item) => ({
      title: item.title ?? "Untitled",
      url: item.link ?? item.guid ?? "",
      author: item.creator ?? item.author ?? undefined,
      content: item["content:encoded"] ?? item.content ?? undefined,
      summary: item.contentSnippet ?? item.summary ?? undefined,
      imageUrl: extractImage(item),
      publishedAt: item.pubDate ? new Date(item.pubDate) : undefined,
      tags: item.categories?.map(String) ?? [],
    }));
  } catch (e) {
    console.error(`[Feed] Failed to parse ${feedUrl}:`, e);
    return [];
  }
}

function extractImage(item: Record<string, unknown>): string | undefined {
  // Check media:content
  const media = item["media:content"] as { $?: { url?: string } } | undefined;
  if (media?.$?.url) return media.$.url;

  // Check enclosure
  const enclosure = item.enclosure as { url?: string; type?: string } | undefined;
  if (enclosure?.url && enclosure.type?.startsWith("image")) return enclosure.url;

  // Extract from content
  const content = (item["content:encoded"] ?? item.content ?? "") as string;
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
  if (imgMatch) return imgMatch[1];

  return undefined;
}
