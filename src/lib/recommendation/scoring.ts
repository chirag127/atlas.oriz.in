export interface ScoringFactors {
  relevanceScore: number;
  recencyScore: number;
  qualityScore: number;
  diversityScore: number;
  trendingScore: number;
  indiaBoost: number;
}

export function computeFinalScore(factors: ScoringFactors): number {
  return (
    0.35 * factors.relevanceScore +
    0.25 * factors.recencyScore +
    0.20 * factors.qualityScore +
    0.10 * factors.diversityScore +
    0.05 * factors.trendingScore +
    0.05 * factors.indiaBoost
  );
}

export function calculateRecencyScore(
  publishedAt: Date,
  halfLifeHours = 48
): number {
  const ageHours =
    (Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60);
  return Math.pow(0.5, ageHours / halfLifeHours);
}

export function calculateDiversityScore(
  articleTags: string[],
  recentTags: string[]
): number {
  if (!articleTags.length) return 0.5;
  const overlap = articleTags.filter((t) => recentTags.includes(t));
  return 1 - overlap.length / Math.max(articleTags.length, 1);
}
