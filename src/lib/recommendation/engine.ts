import { ARTICLE_WEIGHTS, RECOMMENDATION_HALF_LIFE } from "../utils/constants";

export interface ScoredArticle {
  id: string;
  title: string;
  tags: string[];
  qualityScore: number;
  publishedAt: string | null;
  sourceName: string;
  category: string;
  score: number;
  relevanceScore: number;
  recencyScore: number;
  qualityScoreNorm: number;
  diversityScore: number;
  trendingBoost: number;
}

export function scoreArticle(
  article: {
    id: string;
    title: string;
    tags: string[];
    qualityScore: number;
    publishedAt: string | null;
    sourceName: string;
    category: string;
  },
  userInterests: Map<string, number>,
  readCategories: Map<string, number>,
  trendingTopics: Map<string, number>,
  indiaBoostEnabled: boolean
): ScoredArticle {
  const relevance = calculateRelevance(article.tags, article.title, userInterests);
  const recency = calculateRecency(article.publishedAt);
  const quality = normalizeQuality(article.qualityScore);
  const diversity = calculateDiversity(article.category, readCategories);
  const trending = calculateTrending(article.tags, article.title, trendingTopics);
  const india = indiaBoostEnabled && isIndiaRelevant(article.tags, article.title) ? 1 : 0;

  const score =
    ARTICLE_WEIGHTS.relevance * relevance +
    ARTICLE_WEIGHTS.recency * recency +
    ARTICLE_WEIGHTS.quality * quality +
    ARTICLE_WEIGHTS.diversity * diversity +
    ARTICLE_WEIGHTS.trending * trending +
    ARTICLE_WEIGHTS.indiaBoost * india;

  return {
    ...article,
    score,
    relevanceScore: relevance,
    recencyScore: recency,
    qualityScoreNorm: quality,
    diversityScore: diversity,
    trendingBoost: trending,
  };
}

function calculateRelevance(
  tags: string[],
  title: string,
  interests: Map<string, number>
): number {
  if (interests.size === 0) return 0.5;

  let matchScore = 0;
  let matchCount = 0;
  const titleLower = title.toLowerCase();

  for (const [topic, weight] of interests) {
    const topicLower = topic.toLowerCase();
    if (tags.some((t) => t.toLowerCase().includes(topicLower))) {
      matchScore += weight;
      matchCount++;
    } else if (titleLower.includes(topicLower)) {
      matchScore += weight * 0.7;
      matchCount++;
    }
  }

  return matchCount > 0 ? Math.min(1, matchScore / matchCount) : 0.2;
}

function calculateRecency(publishedAt: string | null): number {
  if (!publishedAt) return 0.3;
  const ageHours =
    (Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60);
  return Math.exp(-ageHours / RECOMMENDATION_HALF_LIFE);
}

function normalizeQuality(qualityScore: number): number {
  return Math.max(0, Math.min(1, qualityScore / 100));
}

function calculateDiversity(
  category: string,
  readCategories: Map<string, number>
): number {
  const count = readCategories.get(category) ?? 0;
  return Math.max(0.2, 1 - count * 0.1);
}

function calculateTrending(
  tags: string[],
  title: string,
  trendingTopics: Map<string, number>
): number {
  let boost = 0;
  const text = `${title} ${tags.join(" ")}`.toLowerCase();
  for (const [topic, score] of trendingTopics) {
    if (text.includes(topic.toLowerCase())) {
      boost = Math.max(boost, score);
    }
  }
  return Math.min(1, boost);
}

function isIndiaRelevant(tags: string[], title: string): boolean {
  const indiaKeywords = [
    "india", "indian", "rupee", "upi", "aadhaar", "bse", "nse",
    "sebi", "rbi", "paytm", "jio", "bollywood", "modi",
  ];
  const text = `${title} ${tags.join(" ")}`.toLowerCase();
  return indiaKeywords.some((k) => text.includes(k));
}

export function updateInterestVector(
  current: Map<string, number>,
  tags: string[],
  action: "view" | "read" | "save" | "highlight" | "note" | "share" | "dismiss"
): Map<string, number> {
  const weights: Record<string, number> = {
    view: 0.1, read: 0.3, save: 0.5,
    highlight: 0.7, note: 0.8, share: 1.0, dismiss: -0.2,
  };
  const delta = weights[action] ?? 0;
  const updated = new Map(current);

  for (const tag of tags) {
    const currentWeight = updated.get(tag) ?? 0;
    updated.set(tag, Math.max(0, currentWeight + delta));
  }

  return updated;
}
