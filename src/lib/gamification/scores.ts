export function calculateCuriosityScore(topics: string[]): number {
  if (topics.length === 0) return 0;
  const uniqueTopics = new Set(topics.map((t) => t.toLowerCase()));
  return Math.min(100, Math.round(Math.log2(uniqueTopics.size + 1) * 20));
}

export function calculateLearningScore(stats: {
  articlesRead: number;
  notesCreated: number;
  highlights: number;
  bookmarks: number;
  readingTimeMinutes: number;
}): number {
  const score =
    stats.articlesRead * 2 +
    stats.notesCreated * 5 +
    stats.highlights * 3 +
    stats.bookmarks * 1 +
    Math.floor(stats.readingTimeMinutes / 10) * 2;
  return Math.min(100, Math.round(Math.log2(score + 1) * 10));
}
