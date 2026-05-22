import { parseFeed, type ParsedArticle } from "./parser";
import { FEED_SOURCES, type FeedSource } from "./sources";
import { calculateReadingTime } from "../utils/reading-time";

export interface FetchedArticle extends ParsedArticle {
  feedUrl: string;
  feedTitle: string;
  category: string;
  wordCount: number;
  readingTime: number;
}

export async function fetchAllFeeds(
  sources?: FeedSource[],
  concurrency = 5
): Promise<FetchedArticle[]> {
  const feeds = sources ?? FEED_SOURCES;
  const results: FetchedArticle[] = [];

  // Process in batches
  for (let i = 0; i < feeds.length; i += concurrency) {
    const batch = feeds.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map((source) => fetchSingleFeed(source))
    );

    for (const result of batchResults) {
      if (result.status === "fulfilled") {
        results.push(...result.value);
      }
    }
  }

  return results;
}

async function fetchSingleFeed(source: FeedSource): Promise<FetchedArticle[]> {
  const articles = await parseFeed(source.url);
  return articles
    .filter((a) => a.url && a.title)
    .map((a) => {
      const textContent = stripHtml(a.content ?? a.summary ?? "");
      return {
        ...a,
        feedUrl: source.url,
        feedTitle: source.title,
        category: source.category,
        wordCount: textContent.split(/\s+/).length,
        readingTime: calculateReadingTime(textContent),
      };
    });
}

export function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
