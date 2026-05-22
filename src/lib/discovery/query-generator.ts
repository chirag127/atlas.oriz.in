export function generateDiscoveryQueries(interests: string[]): string[] {
  const now = new Date();
  const month = now.toISOString().slice(0, 7);
  const day = now.toISOString().slice(0, 10);

  return interests.flatMap((interest) => [
    `${interest} ${month}`,
    `latest ${interest} news ${day}`,
    `best ${interest} tools this week`,
    `${interest} tutorial guide`,
    `${interest} breakthrough research`,
    `${interest} open source project`,
    `trending ${interest} right now`,
    `${interest} best practices 2026`,
  ]);
}

export function generateTrendingQueries(): string[] {
  return [
    "trending in technology this week",
    "viral tech news today",
    "most discussed in programming",
    "trending AI news",
    "popular open source projects this month",
    "what developers are talking about",
  ];
}
