import {
  pgTable, text, timestamp, integer, boolean, jsonb,
  real, uuid, index, uniqueIndex, pgPolicy,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ── Users
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  supabaseId: text("supabase_id").unique().notNull(),
  email: text("email").notNull(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── Sessions (Supabase manages, but we track extras)
export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  deviceInfo: jsonb("device_info"),
  lastActiveAt: timestamp("last_active_at", { withTimezone: true }).defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── Feeds (RSS sources)
export const feeds = pgTable("feeds", {
  id: uuid("id").defaultRandom().primaryKey(),
  url: text("url").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  siteUrl: text("site_url"),
  category: text("category").default("general"),
  iconUrl: text("icon_url"),
  isActive: boolean("is_active").default(true).notNull(),
  lastFetchedAt: timestamp("last_fetched_at", { withTimezone: true }),
  fetchError: text("fetch_error"),
  errorCount: integer("error_count").default(0),
  articleCount: integer("article_count").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("feeds_category_idx").on(table.category),
  index("feeds_active_idx").on(table.isActive),
]);

// ── User Feeds (subscriptions + per-feed settings)
export const userFeeds = pgTable("user_feeds", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  feedId: uuid("feed_id").references(() => feeds.id, { onDelete: "cascade" }).notNull(),
  isPaused: boolean("is_paused").default(false),
  notifyEnabled: boolean("notify_enabled").default(false),
  fetchInterval: integer("fetch_interval").default(30),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("user_feeds_user_feed_idx").on(table.userId, table.feedId),
]);

// ── Articles
export const articles = pgTable("articles", {
  id: uuid("id").defaultRandom().primaryKey(),
  feedId: uuid("feed_id").references(() => feeds.id, { onDelete: "cascade" }),
  url: text("url").notNull().unique(),
  title: text("title").notNull(),
  author: text("author"),
  content: text("content"),
  summary: text("summary"),
  imageUrl: text("image_url"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  wordCount: integer("word_count").default(0),
  readingTime: integer("reading_time").default(1),
  sourceQuality: real("source_quality").default(50),
  tags: jsonb("tags").default([]),
  aiSummary: text("ai_summary"),
  aiTags: jsonb("ai_tags").default([]),
  qualityScore: real("quality_score").default(50),
  antiClickbaitScore: real("anti_clickbait_score").default(1.0),
  embeddingVec: text("embedding_vec"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("articles_feed_idx").on(table.feedId),
  index("articles_published_idx").on(table.publishedAt),
  index("articles_quality_idx").on(table.qualityScore),
]);

// ── User Article Interactions
export const userArticleInteractions = pgTable("user_article_interactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  articleId: uuid("article_id").references(() => articles.id, { onDelete: "cascade" }).notNull(),
  viewed: boolean("viewed").default(false),
  read: boolean("read").default(false),
  readProgress: real("read_progress").default(0),
  dismissed: boolean("dismissed").default(false),
  shared: boolean("shared").default(false),
  timeSpent: integer("time_spent").default(0),
  viewedAt: timestamp("viewed_at", { withTimezone: true }),
  readAt: timestamp("read_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("interactions_user_article_idx").on(table.userId, table.articleId),
]);

// ── Bookmarks (with FSRS fields)
export const bookmarks = pgTable("bookmarks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  articleId: uuid("article_id").references(() => articles.id, { onDelete: "cascade" }).notNull(),
  note: text("note"),
  // FSRS fields
  stability: real("stability").default(0),
  difficulty: real("difficulty").default(0),
  elapsedDays: integer("elapsed_days").default(0),
  scheduledDays: integer("scheduled_days").default(0),
  reps: integer("reps").default(0),
  lapses: integer("lapses").default(0),
  state: integer("state").default(0),
  due: timestamp("due", { withTimezone: true }),
  lastReview: timestamp("last_review", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("bookmarks_user_article_idx").on(table.userId, table.articleId),
  index("bookmarks_due_idx").on(table.due),
]);

// ── Highlights
export const highlights = pgTable("highlights", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  articleId: uuid("article_id").references(() => articles.id, { onDelete: "cascade" }).notNull(),
  text: text("text").notNull(),
  color: text("color").default("yellow"),
  note: text("note"),
  startOffset: integer("start_offset"),
  endOffset: integer("end_offset"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("highlights_user_article_idx").on(table.userId, table.articleId),
]);

// ── Notes
export const notes = pgTable("notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  articleId: uuid("article_id").references(() => articles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").default(""),
  isPinned: boolean("is_pinned").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── Collections
export const collections = pgTable("collections", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").default("emerald"),
  icon: text("icon").default("folder"),
  isSmart: boolean("is_smart").default(false),
  smartQuery: text("smart_query"),
  articleCount: integer("article_count").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── Collection Articles
export const collectionArticles = pgTable("collection_articles", {
  id: uuid("id").defaultRandom().primaryKey(),
  collectionId: uuid("collection_id").references(() => collections.id, { onDelete: "cascade" }).notNull(),
  articleId: uuid("article_id").references(() => articles.id, { onDelete: "cascade" }).notNull(),
  addedAt: timestamp("added_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("collection_article_idx").on(table.collectionId, table.articleId),
]);

// ── Tags
export const tags = pgTable("tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  color: text("color").default("sky"),
  isAiGenerated: boolean("is_ai_generated").default(false),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("tags_user_name_idx").on(table.userId, table.name),
]);

// ── Article Tags
export const articleTags = pgTable("article_tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  articleId: uuid("article_id").references(() => articles.id, { onDelete: "cascade" }).notNull(),
  tagId: uuid("tag_id").references(() => tags.id, { onDelete: "cascade" }).notNull(),
}, (table) => [
  uniqueIndex("article_tag_idx").on(table.articleId, table.tagId),
]);

// ── User Interests
export const userInterests = pgTable("user_interests", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  topic: text("topic").notNull(),
  weight: real("weight").default(1.0),
  lastUpdated: timestamp("last_updated", { withTimezone: true }).defaultNow(),
}, (table) => [
  uniqueIndex("user_interest_topic_idx").on(table.userId, table.topic),
]);

// ── Recommendation Scores
export const recommendationScores = pgTable("recommendation_scores", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  articleId: uuid("article_id").references(() => articles.id, { onDelete: "cascade" }).notNull(),
  score: real("score").default(0),
  relevanceScore: real("relevance_score").default(0),
  recencyScore: real("recency_score").default(0),
  qualityScore: real("quality_score").default(0),
  diversityScore: real("diversity_score").default(0),
  trendingBoost: real("trending_boost").default(0),
  calculatedAt: timestamp("calculated_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  uniqueIndex("rec_user_article_idx").on(table.userId, table.articleId),
  index("rec_score_idx").on(table.score),
]);

// ── Keyword Alerts
export const keywordAlerts = pgTable("keyword_alerts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  keyword: text("keyword").notNull(),
  isActive: boolean("is_active").default(true),
  matchCount: integer("match_count").default(0),
  lastMatchedAt: timestamp("last_matched_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── Gamification Stats
export const gamificationStats = pgTable("gamification_stats", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  totalArticlesRead: integer("total_articles_read").default(0),
  totalNotesCreated: integer("total_notes_created").default(0),
  totalHighlights: integer("total_highlights").default(0),
  totalBookmarks: integer("total_bookmarks").default(0),
  curiosityScore: real("curiosity_score").default(0),
  learningScore: real("learning_score").default(0),
  topicsExplored: integer("topics_explored").default(0),
  totalReadingTime: integer("total_reading_time").default(0),
  lastActiveDate: timestamp("last_active_date", { withTimezone: true }),
  weeklyStats: jsonb("weekly_stats").default({}),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── API Keys (encrypted)
export const apiKeys = pgTable("api_keys", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  provider: text("provider").notNull(),
  encryptedKey: text("encrypted_key").notNull(),
  isActive: boolean("is_active").default(true),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("api_keys_user_provider_idx").on(table.userId, table.provider),
]);

// ── User Settings
export const userSettings = pgTable("user_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
  // AI
  primaryAiProvider: text("primary_ai_provider").default("puter"),
  aiProviderPriority: jsonb("ai_provider_priority").default(["puter", "gemini", "groq", "openrouter"]),
  summarizeModel: text("summarize_model"),
  chatModel: text("chat_model"),
  tagsModel: text("tags_model"),
  digestModel: text("digest_model"),
  autoSummarize: boolean("auto_summarize").default(true),
  // Discovery
  duckduckgoEnabled: boolean("duckduckgo_enabled").default(true),
  discoveryFrequency: text("discovery_frequency").default("hourly"),
  // Reading
  theme: text("theme").default("dark"),
  fontSize: integer("font_size").default(18),
  fontFamily: text("font_family").default("Newsreader"),
  lineHeight: real("line_height").default(1.7),
  maxContentWidth: integer("max_content_width").default(680),
  readerModeDefault: boolean("reader_mode_default").default(false),
  // Notifications
  pushEnabled: boolean("push_enabled").default(false),
  emailEnabled: boolean("email_enabled").default(false),
  dailyDigestEnabled: boolean("daily_digest_enabled").default(true),
  dailyDigestTime: text("daily_digest_time").default("07:00"),
  weeklyRecapEnabled: boolean("weekly_recap_enabled").default(true),
  // Content
  indiaBoostEnabled: boolean("india_boost_enabled").default(true),
  antiClickbaitStrength: text("anti_clickbait_strength").default("medium"),
  hidePaywalled: boolean("hide_paywalled").default(false),
  minQualityScore: integer("min_quality_score").default(20),
  // TTS
  ttsVoice: text("tts_voice"),
  ttsSpeed: real("tts_speed").default(1.0),
  // Offline
  offlineArticleCount: integer("offline_article_count").default(50),
  autoSaveTop: boolean("auto_save_top").default(true),
  // Gamification
  gamificationEnabled: boolean("gamification_enabled").default(true),
  // Push subscription
  pushSubscription: jsonb("push_subscription"),
  // Onboarding
  onboardingComplete: boolean("onboarding_complete").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── Knowledge Graph Nodes
export const knowledgeGraphNodes = pgTable("knowledge_graph_nodes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  label: text("label").notNull(),
  type: text("type").default("topic"),
  size: integer("size").default(1),
  color: text("color"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("kg_nodes_user_idx").on(table.userId),
]);

// ── Knowledge Graph Edges
export const knowledgeGraphEdges = pgTable("knowledge_graph_edges", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  sourceId: uuid("source_id").references(() => knowledgeGraphNodes.id, { onDelete: "cascade" }).notNull(),
  targetId: uuid("target_id").references(() => knowledgeGraphNodes.id, { onDelete: "cascade" }).notNull(),
  weight: real("weight").default(1),
  label: text("label"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("kg_edges_user_idx").on(table.userId),
]);

// ── Push Subscriptions
export const pushSubscriptions = pgTable("push_subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  endpoint: text("endpoint").notNull(),
  keys: jsonb("keys").notNull(),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("push_user_endpoint_idx").on(table.userId, table.endpoint),
]);

// ── Discovery Results (web search cache)
export const discoveryResults = pgTable("discovery_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  query: text("query").notNull(),
  source: text("source").notNull(),
  url: text("url").notNull(),
  title: text("title"),
  snippet: text("snippet"),
  score: real("score").default(0),
  processed: boolean("processed").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("discovery_user_idx").on(table.userId),
  index("discovery_processed_idx").on(table.processed),
]);
