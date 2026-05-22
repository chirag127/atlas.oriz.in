interface TopicCount {
  topic: string;
  count24h: number;
  count7d: number;
}

const topicMemory = new Map<string, number[]>();

export function detectTrending(
  topics: string[],
  now = Date.now()
): string[] {
  const day = 24 * 60 * 60 * 1000;

  for (const topic of topics) {
    const timestamps = topicMemory.get(topic) ?? [];
    timestamps.push(now);
    topicMemory.set(
      topic,
      timestamps.filter((t) => now - t < 7 * day)
    );
  }

  const trending: string[] = [];
  for (const [topic, timestamps] of topicMemory) {
    const count24h = timestamps.filter((t) => now - t < day).length;
    const count7d = timestamps.length;
    const avgDaily = count7d / 7;
    const spikeRatio = avgDaily > 0 ? count24h / avgDaily : count24h;

    if (spikeRatio > 2.0 && count24h >= 3) {
      trending.push(topic);
    }
  }

  return trending;
}

export function getTrendingBoost(topics: string[], trending: string[]): number {
  if (!trending.length || !topics.length) return 0;
  const matchCount = topics.filter((t) => trending.includes(t)).length;
  return Math.min(0.15, matchCount * 0.05);
}
