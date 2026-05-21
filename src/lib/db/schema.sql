-- SQLite / D1 database schema for Atlas PWA

-- Users (synced with Firebase Auth UID)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,              -- Firebase UID
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  onboarded INTEGER DEFAULT 0
);

-- User preferences (JSON settings blob)
CREATE TABLE IF NOT EXISTS user_settings (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'dark',          -- dark/light/auto
  ai_provider TEXT DEFAULT 'auto',    -- auto/groq/gemini/cerebras etc
  feed_view TEXT DEFAULT 'card',      -- card/list/magazine
  locations TEXT DEFAULT '["India","Delhi","Ghaziabad","Bhubaneswar"]',
  interests TEXT DEFAULT '["AI","software-engineering","productivity","finance","privacy","android","startups","automation","cybersecurity","personal-growth","emerging-tech"]',
  notification_enabled INTEGER DEFAULT 0,
  reading_goal_minutes INTEGER DEFAULT 30,
  digest_time TEXT DEFAULT '08:00',   -- daily digest time
  offline_save_limit INTEGER DEFAULT 100,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Feed sources (user-customizable)
CREATE TABLE IF NOT EXISTS feeds (
  id TEXT PRIMARY KEY,                -- nanoid
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,  -- NULL = global/default feed
  url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  favicon_url TEXT,
  feed_type TEXT NOT NULL,            -- rss/reddit/hn/github/producthunt/youtube
  category TEXT,                      -- ai/tech/finance/security/productivity/etc
  is_active INTEGER DEFAULT 1,
  refresh_interval_min INTEGER DEFAULT 60,
  last_fetched_at TEXT,
  error_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, url)
);

-- Articles (fetched content)
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,                -- nanoid
  feed_id TEXT REFERENCES feeds(id) ON DELETE CASCADE,
  external_url TEXT NOT NULL,
  title TEXT NOT NULL,
  author TEXT,
  content_html TEXT,                  -- full content if available
  content_text TEXT,                  -- stripped text for AI
  summary TEXT,                       -- AI-generated summary
  tldr TEXT,                          -- AI-generated TL;DR (1-2 sentences)
  key_insights TEXT,                  -- JSON array of insights
  ai_tags TEXT,                       -- JSON array of AI-generated tags
  quality_score REAL DEFAULT 0,       -- 0-1 AI quality assessment
  clickbait_score REAL DEFAULT 0,     -- 0-1 clickbait probability
  reading_time_min INTEGER DEFAULT 1,
  word_count INTEGER DEFAULT 0,
  image_url TEXT,                     -- thumbnail/og:image
  published_at TEXT,
  fetched_at TEXT DEFAULT (datetime('now')),
  embedding_vector BLOB,              -- BGE-M3 embedding (server-side)
  duplicate_of TEXT,                  -- article_id if duplicate detected
  UNIQUE(feed_id, external_url)
);

-- User-article interactions (cloud-synced)
CREATE TABLE IF NOT EXISTS user_articles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  article_id TEXT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  is_read INTEGER DEFAULT 0,
  is_bookmarked INTEGER DEFAULT 0,
  is_liked INTEGER DEFAULT 0,        -- 1=liked, 0=neutral
  is_disliked INTEGER DEFAULT 0,     -- 1=disliked, 0=neutral
  is_saved_offline INTEGER DEFAULT 0,
  reading_progress REAL DEFAULT 0,   -- 0.0 to 1.0
  time_spent_sec INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  first_opened_at TEXT,
  last_opened_at TEXT,
  bookmarked_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, article_id)
);

-- Notes (markdown, Obsidian-compatible)
CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled',
  content_md TEXT DEFAULT '',
  parent_id TEXT REFERENCES notes(id) ON DELETE SET NULL,  -- for nested notes
  article_id TEXT REFERENCES articles(id) ON DELETE SET NULL, -- linked article
  is_pinned INTEGER DEFAULT 0,
  word_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Text highlights on articles
CREATE TABLE IF NOT EXISTS highlights (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  article_id TEXT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  highlighted_text TEXT NOT NULL,
  note TEXT,                           -- annotation
  color TEXT DEFAULT '#FFD700',
  start_offset INTEGER,
  end_offset INTEGER,
  element_selector TEXT,               -- CSS selector for re-highlighting
  created_at TEXT DEFAULT (datetime('now'))
);

-- Collections (folders for organizing)
CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '📁',
  is_smart INTEGER DEFAULT 0,         -- smart folder (auto-filter)
  smart_filter TEXT,                   -- JSON filter rules for smart folders
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS collection_items (
  collection_id TEXT REFERENCES collections(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL,             -- article/note
  item_id TEXT NOT NULL,
  added_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (collection_id, item_type, item_id)
);

-- Tags (user-created + AI-generated)
CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,   -- NULL = global AI tag
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  usage_count INTEGER DEFAULT 0,
  UNIQUE(user_id, name)
);

CREATE TABLE IF NOT EXISTS item_tags (
  tag_id TEXT REFERENCES tags(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL,             -- article/note
  item_id TEXT NOT NULL,
  PRIMARY KEY (tag_id, item_type, item_id)
);

-- Search history (for recommendation engine)
CREATE TABLE IF NOT EXISTS search_history (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  results_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Spaced repetition cards
CREATE TABLE IF NOT EXISTS srs_cards (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL,             -- article/highlight/note
  item_id TEXT NOT NULL,
  front_text TEXT NOT NULL,            -- question or highlight
  back_text TEXT,                      -- answer or context
  -- FSRS fields
  stability REAL DEFAULT 0,
  difficulty REAL DEFAULT 0,
  elapsed_days INTEGER DEFAULT 0,
  scheduled_days INTEGER DEFAULT 0,
  reps INTEGER DEFAULT 0,
  lapses INTEGER DEFAULT 0,
  state INTEGER DEFAULT 0,            -- 0=new, 1=learning, 2=review, 3=relearning
  due_at TEXT,
  last_review_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Keyword alerts
CREATE TABLE IF NOT EXISTS keyword_alerts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  match_count INTEGER DEFAULT 0,
  last_matched_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- User activity log (for recommendation engine)
CREATE TABLE IF NOT EXISTS activity_log (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,               -- open/read/bookmark/like/dislike/search/share/note/highlight
  item_type TEXT,                     -- article/note/feed/collection
  item_id TEXT,
  metadata TEXT,                      -- JSON extra data
  created_at TEXT DEFAULT (datetime('now'))
);

-- Gamification
CREATE TABLE IF NOT EXISTS user_stats (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  streak_freezes INTEGER DEFAULT 3,
  total_articles_read INTEGER DEFAULT 0,
  total_time_spent_min INTEGER DEFAULT 0,
  total_notes_created INTEGER DEFAULT 0,
  total_highlights INTEGER DEFAULT 0,
  curiosity_score REAL DEFAULT 0,     -- diversity of topics read
  learning_score REAL DEFAULT 0,      -- depth of engagement
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  last_active_date TEXT,
  weekly_digest_data TEXT,            -- JSON: last week's recap
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_articles_feed ON articles(feed_id);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_quality ON articles(quality_score DESC);
CREATE INDEX IF NOT EXISTS idx_user_articles_user ON user_articles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_articles_bookmarked ON user_articles(user_id, is_bookmarked) WHERE is_bookmarked = 1;
CREATE INDEX IF NOT EXISTS idx_user_articles_read ON user_articles(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notes_user ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_highlights_user_article ON highlights(user_id, article_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_srs_cards_due ON srs_cards(user_id, due_at);
CREATE INDEX IF NOT EXISTS idx_keyword_alerts_user ON keyword_alerts(user_id, is_active);
