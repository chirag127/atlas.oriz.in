export const APP_NAME = "Atlas";
export const APP_TAGLINE = "Your personal intelligence feed";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const FEED_FETCH_INTERVAL = 30 * 60 * 1000; // 30 min
export const DISCOVERY_INTERVAL = 60 * 60 * 1000; // 1 hour
export const RECOMMENDATION_HALF_LIFE = 48; // hours

export const ARTICLE_WEIGHTS = {
  relevance: 0.35,
  recency: 0.25,
  quality: 0.20,
  diversity: 0.10,
  trending: 0.05,
  indiaBoost: 0.05,
} as const;

export const INTEREST_ACTIONS = {
  view: 0.1,
  read: 0.3,
  save: 0.5,
  highlight: 0.7,
  note: 0.8,
  share: 1.0,
  dismiss: -0.2,
} as const;

export const HIGHLIGHT_COLORS = ["yellow", "green", "blue", "pink"] as const;

export const DEFAULT_FEED_CATEGORIES = [
  "Productivity",
  "AI & Automation",
  "Software Engineering",
  "Finance",
  "Cybersecurity",
  "Long-form Essays",
  "Android & Mobile",
  "Privacy",
  "India Tech",
  "How-To",
] as const;

export const READING_SPEED_WPM = 238;

export const MAX_FILE_LINES = 200;

export const FEATURE_FLAGS = {
  gamification: process.env.NEXT_PUBLIC_ENABLE_GAMIFICATION === "true",
  push: process.env.NEXT_PUBLIC_ENABLE_PUSH === "true",
  tts: process.env.NEXT_PUBLIC_ENABLE_TTS === "true",
  discovery: process.env.NEXT_PUBLIC_ENABLE_DISCOVERY === "true",
  knowledgeGraph: process.env.NEXT_PUBLIC_ENABLE_KNOWLEDGE_GRAPH === "true",
} as const;
