const CLICKBAIT_PATTERNS = [
  /\b(you won't believe|shocking|mind.blowing|what happens next)\b/i,
  /\b(will blow your mind|change your life|the truth about)\b/i,
  /[A-Z\s]{10,}/,
  /!{2,}/,
  /\?{2,}/,
];

const TRUSTED_SOURCES = [
  "arxiv.org", "github.com", "paulgraham.com", "nature.com",
  "science.org", "ieee.org", "acm.org", "wikipedia.org",
  "reuters.com", "bloomberg.com", "ft.com", "economist.com",
];

export function computeQualityScore(
  title: string,
  wordCount: number,
  sourceUrl: string,
  summary?: string | null
): number {
  let score = 75;

  // Word count
  if (wordCount >= 800 && wordCount <= 3000) score += 15;
  else if (wordCount < 300) score -= 30;
  else if (wordCount < 500) score -= 10;

  // Trusted sources
  if (TRUSTED_SOURCES.some((s) => sourceUrl?.includes(s))) score += 15;

  // Anti-clickbait
  for (const pattern of CLICKBAIT_PATTERNS) {
    if (pattern.test(title)) score -= 15;
  }

  // Summary presence
  if (summary && summary.length > 50) score += 5;
  if (summary && summary.length < 20) score -= 5;

  return Math.max(0, Math.min(100, score));
}

export function getAntiClickbaitMultiplier(title: string): number {
  let penalty = 0;
  const upperRatio = title.replace(/[^A-Z]/g, "").length / Math.max(title.length, 1);
  if (upperRatio > 0.5) penalty += 0.3;
  if (/!{2,}/.test(title)) penalty += 0.2;
  if (/\?{2,}/.test(title)) penalty += 0.1;
  for (const pattern of CLICKBAIT_PATTERNS) {
    if (pattern.test(title)) penalty += 0.2;
  }
  return Math.max(0.3, 1 - penalty);
}
