export interface InterestVector {
  topic: string;
  weight: number;
  lastInteracted: Date;
}

export function mergeInterests(
  existing: InterestVector[],
  topics: string[],
  delta: number
): InterestVector[] {
  const map = new Map<string, InterestVector>();
  for (const iv of existing) map.set(iv.topic, iv);

  for (const topic of topics) {
    const existing = map.get(topic);
    if (existing) {
      existing.weight = Math.min(1, existing.weight + delta);
      existing.lastInteracted = new Date();
    } else {
      map.set(topic, { topic, weight: delta, lastInteracted: new Date() });
    }
  }

  return Array.from(map.values());
}

export function decayInterests(
  interests: InterestVector[],
  daysSinceUpdate: number
): InterestVector[] {
  const decay = Math.pow(0.95, daysSinceUpdate);
  return interests
    .map((iv) => ({ ...iv, weight: iv.weight * decay }))
    .filter((iv) => iv.weight > 0.01);
}

export function getTopInterests(
  interests: InterestVector[],
  limit = 10
): string[] {
  return [...interests]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit)
    .map((iv) => iv.topic);
}
