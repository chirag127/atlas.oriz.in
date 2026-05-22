# ATLAS — Complete Implementation Prompt
## Project: atlas.oriz.in | Personal Knowledge Aggregation OS
### For: AI Coding Agents (Claude Antigravity, Cursor, etc.)

---

> **MANDATORY AGENT INSTRUCTION**: Before making ANY architectural decision, technology choice, hosting choice, database choice, or library choice — **search the web** for the current best option. Search the web for free tiers, search the web for rate limits, search the web for compatibility, search the web for latest versions, search the web for community recommendations. Do NOT rely on training data for anything version-specific. Search the web at least once per major decision. This instruction applies to every section below.

---

## 0. PROJECT IDENTITY

| Field | Value |
|---|---|
| **Name** | Atlas |
| **Tagline** | Your personal intelligence feed — everything the web knows, ranked for you |
| **Domain** | atlas.oriz.in |
| **GitHub Repo** | chirag127/atlas.oriz.in |
| **License** | MIT |
| **Primary User** | Solo developer (Chirag) — but architected for multi-user from day one |
| **Cost Target** | $0/month — free tiers only, forever |
| **Package Manager** | pnpm (always, never npm or yarn) |
| **Node Version** | 22+ (search the web to confirm latest LTS) |

---

## 1. CORE PHILOSOPHY

Atlas is a **Google Discover replacement for power users** — a mobile-first PWA that aggregates every corner of the web (RSS, Reddit, Hacker News, GitHub, YouTube, Product Hunt, newsletters, podcasts, AI news, finance, cybersecurity, Android, startups, automation, privacy, personal growth, emerging tech) and surfaces the most relevant content using a recommendation engine that learns from every interaction.

**Not logged in?** Show a beautiful, fully-functional general feed — no login wall. The feed improves dramatically after login.

**Logged in?** Full personalization: per-user recommendation engine, bookmarks, notes, highlights, collections, spaced repetition, knowledge graph, gamification, AI features, all synced to the cloud across every device.

**Design aesthetic: "Dark Observatory"** — editorial-grade, bold serif typography, deep indigo-black backgrounds, emerald + amber accents. NOT purple gradients. NOT Inter font. NOT generic AI slop. Think: the reading interface of a brilliant researcher who customized their entire environment. Distinctive, memorable, unforgettable.

---

## 2. MANDATORY SEARCH INSTRUCTIONS FOR AGENT

The agent MUST search the web for the following before writing a single line of code:

1. Search the web: current free tier limits of Vercel Hobby vs Cloudflare Workers vs Netlify vs Render vs Railway vs Fly.io
2. Search the web: `@opennextjs/cloudflare` current status and Next.js 15 compatibility
3. Search the web: Supabase free tier limits 2026 (storage, auth MAU, inactivity pause policy)
4. Search the web: Neon free tier vs Supabase free tier 2026 comparison
5. Search the web: Turso free tier limits 2026
6. Search the web: pnpm 11 Node.js requirements
7. Search the web: TailwindCSS v4 CSS-first config syntax
8. Search the web: Drizzle ORM vs Prisma vs Kysely 2026 community preference
9. Search the web: Serwist `@serwist/next` App Router compatibility
10. Search the web: Puter.js latest SDK usage, model list API
11. Search the web: all OpenRouter `:free` models (filter `max_price=0` at openrouter.ai/models)
12. Search the web: Google Gemini free tier RPD limits 2026
13. Search the web: Groq free tier RPM and TPM limits 2026
14. Search the web: Cerebras free tier token limits 2026
15. Search the web: DuckDuckGo search API free usage (for web discovery)
16. Search the web: Serper free tier 2026
17. Search the web: Tavily free tier 2026
18. Search the web: Brave Search API free tier 2026
19. Search the web: Resend free email tier 2026
20. Search the web: VAPID web push implementation Next.js 2026

---

## 3. TECH STACK

> Agent: search the web to verify all versions before installing. Use the latest stable version of everything.

```
Framework:       Next.js 15+ (App Router, TypeScript strict)
Styling:         TailwindCSS v4 (CSS-first, @import "tailwindcss")
Package Mgr:     pnpm 11.x (MANDATORY — never npm)
Runtime:         Node.js 22+
Database:        Supabase (Postgres + pgvector + Auth + Storage + Realtime)
Edge Cache:      Turso (libSQL/SQLite, optional for offline-first)
ORM:             Drizzle ORM
Auth:            Supabase Auth (Google OAuth + Email/Password + identity linking)
AI Primary:      Puter.js (client-side, user-pays, zero-config, 400+ models)
AI Fallbacks:    [ALL providers below — ALL mandatory, ALL configurable]
State:           Zustand + TanStack Query v5
Search:          Orama (client-side FTS) + Postgres tsvector (server)
Vectors:         Transformers.js (local embeddings) + Supabase pgvector
PWA:             Serwist (@serwist/next) — search web for latest version
Email:           Resend (3,000/month free)
Push:            Web Push API + VAPID (self-managed, zero cost)
Graph Viz:       react-force-graph (Canvas/WebGL, 2D+3D)
RSS Parsing:     rss-parser + fast-xml-parser (fallback)
Spaced Rep:      ts-fsrs (FSRS algorithm)
TTS:             Web Speech API (browser-native, free)
Hosting:         Cloudflare Workers via @opennextjs/cloudflare (primary)
                 Vercel (secondary/preview — search web for Hobby limits)
                 Netlify / Railway / Render (tertiary options in settings)
CI/CD:           GitHub Actions
```

**PLATFORM INDEPENDENCE RULE**: The codebase must NEVER be tightly coupled to any single hosting platform. All environment-specific config must be in env vars. Deployment adapters for Cloudflare Workers, Vercel, Netlify, and Node.js standalone must all be maintained. Users can switch hosting in settings/config without code changes.

---

## 4. ALL MANDATORY FREE AI PROVIDERS

Every single provider below is MANDATORY. All must be configurable in the Settings → AI Providers panel. Users enter their own API keys (encrypted with AES-256-GCM before storage). This transfers cost to users, giving unlimited personal usage at $0 to the developer.

### 4.1 Puter.js (PRIMARY — Zero Config, Client-Side)

- **No API key required** — works via user's Puter account
- Access 400+ models including all major providers
- Client-side only (use for interactive features: summarize, chat, ELI5)
- Search the web for latest Puter.js SDK usage and model list API
- Model auto-selection: pick the largest/most capable free model available

### 4.2 OpenRouter (ALL :free models — COMPLETE LIST)

Search the web at `https://openrouter.ai/models?max_price=0` for the live list. As of research date (2026-05-22), the confirmed `:free` model IDs are:

```
deepseek/deepseek-v4-flash:free          (1M ctx, tools, quality#1)
minimax/minimax-m2.5:free                (205K ctx, tools)
google/gemma-4-31b-it:free               (262K ctx, vision+tools)
nvidia/nemotron-3-super-120b-a12b:free   (1M ctx, tools)
openai/gpt-oss-120b:free                 (131K ctx, tools)
arcee-ai/trinity-large-thinking:free     (262K ctx, tools+reasoning)
google/gemma-4-26b-a4b-it:free           (262K ctx, vision+tools)
qwen/qwen3-coder:free                    (1M ctx, tools — best coding)
openai/gpt-oss-20b:free                  (131K ctx, tools)
nvidia/nemotron-3-nano-30b-a3b:free      (256K ctx, tools)
z-ai/glm-4.5-air:free                    (131K ctx, tools)
nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free (256K ctx, vision+tools)
qwen/qwen3-next-80b-a3b-instruct:free    (262K ctx, tools)
nvidia/nemotron-nano-12b-v2-vl:free      (128K ctx, vision+tools)
meta-llama/llama-3.3-70b-instruct:free   (131K ctx, tools)
nvidia/nemotron-nano-9b-v2:free          (128K ctx, tools)
meta-llama/llama-3.2-3b-instruct:free    (131K ctx)
liquid/lfm-2.5-1.2b-thinking:free        (33K ctx, reasoning)
liquid/lfm-2.5-1.2b-instruct:free        (33K ctx)
openrouter/owl-alpha                     (1M ctx, tools — OpenRouter native)
openrouter/free                          (200K ctx, auto-router)
baidu/cobuddy:free                       (131K ctx, tools)
poolside/laguna-xs.2:free                (131K ctx, tools)
poolside/laguna-m.1:free                 (131K ctx, tools)
nousresearch/hermes-3-llama-3.1-405b:free (131K ctx)
cognitivecomputations/dolphin-mistral-24b-venice-edition:free (33K ctx)
```

**Agent instruction**: Also fetch `https://openrouter.ai/api/v1/models` at runtime to discover any new `:free` models dynamically. The settings panel should show live model discovery with a "Refresh models" button.

Rate limits: 20 req/min, 200 req/day per model. Rotate across models automatically to maximize throughput.

### 4.3 Google AI Studio (Gemini)

- Search the web: get API key at https://aistudio.google.com/apikey
- Search the web: current free tier (as of last research: 1,500 RPD Flash, 50 RPD Pro, 1M TPM)
- Models: `gemini-2.5-flash-lite` (best free), `gemini-2.0-flash`, `gemini-2.5-pro`
- Use for: server-side cron tasks (digest, auto-tag) where Puter.js is unavailable

### 4.4 Groq

- Search the web: get API key at https://console.groq.com/keys
- Search the web: current free tier RPM and TPM limits
- Models: Llama 4 Scout, Llama 3.3 70B, Qwen3 32B (search web for current list)
- Fastest inference of any free provider (~300 tokens/sec)

### 4.5 Cerebras

- Search the web: get API key at https://cloud.cerebras.ai
- Search the web: current free tier (1M tokens/day, 30 RPM as of last research)
- Models: Llama 4 Scout, Qwen3 32B (search web for current list)

### 4.6 NVIDIA NIM

- Search the web: get API key at https://build.nvidia.com
- Models: Nemotron 3 Super 120B (also available free on OpenRouter)
- OpenAI-compatible API

### 4.7 Mistral La Plateforme

- Search the web: get API key at https://console.mistral.ai/api-keys
- Free tier models: search the web for current availability
- Also: Codestral for code tasks (https://codestral.mistral.ai)

### 4.8 HuggingFace Inference Providers

- Search the web: get token at https://huggingface.co/settings/tokens
- Access thousands of open-source models
- Use Inference API (serverless) for embedding generation

### 4.9 Vercel AI Gateway

- Search the web: current features and free tier with Vercel account
- Provides unified API across providers

### 4.10 OpenCode Zen

- Search the web: current status, models, and API format

### 4.11 Cohere

- Search the web: get API key at https://dashboard.cohere.com/api-keys
- Models: Command R, Command R+ (search web for free tier limits)

### 4.12 GitHub Models

- Search the web: get token at https://github.com/settings/tokens
- Access various models via GitHub's AI gateway

### 4.13 Cloudflare Workers AI

- Search the web: get via Cloudflare dashboard
- Models: Llama 3.3, Qwen, etc. — search web for current list
- Free tier via Workers (100K requests/day)

### 4.14 AI Provider Fallback Chain

```
Client-side tasks:  Puter.js → OpenRouter (rotate :free models) → Gemini Flash
Server-side tasks:  Gemini Flash → Groq → Cerebras → OpenRouter → NVIDIA NIM
Embedding tasks:    Transformers.js (local, always free) → HuggingFace
Code tasks:         qwen/qwen3-coder:free → Codestral → GitHub Models
```

### 4.15 Per-Task Model Selection in Settings

The settings panel must allow users to select which provider + specific model to use for each AI task:
- Summarization model
- Chat model
- Tagging model
- Digest generation model
- Embedding model
- ELI5 model
- Quality scoring model

Each task shows a dropdown with all configured providers and their available models. Models fetched live from each provider's API. Free models tagged with 🆓 badge.

---

## 5. WEB DISCOVERY ENGINE (Google Discover Alternative)

Atlas must discover articles from anywhere on the open web, not just RSS feeds. This is the core differentiator. Like Google Discover on Android's Chrome new tab page — surface anything from the entire web.

### 5.1 Free Discovery APIs

Agent must search the web for current free tiers of all these before using:

```
DuckDuckGo Instant Answers API  — free, no key required
                                  https://api.duckduckgo.com/?q=QUERY&format=json
Serper                          — 2,500 free searches/month
                                  https://serper.dev
Tavily                          — 1,000 credits/month free
                                  https://tavily.com
Brave Search API                — ~1,000 queries/month ($5 credit free)
                                  https://brave.com/search/api
Exa (Metaphor)                  — 1,000 credits/month free
                                  https://exa.ai
SearXNG (self-hosted)           — unlimited, run own instance
Common Crawl                    — free, search petabytes of web data
Bing News Search                — 1,000 free calls/month
Google Custom Search            — 100 free queries/day
```

### 5.2 Discovery Algorithm

Every hour (configurable), the discovery engine:
1. Generates search queries from user's interest profile
2. Queries DuckDuckGo (free, no key) + configured paid APIs
3. Fetches articles from discovered URLs
4. Scores them with the recommendation engine
5. Deduplicates against already-seen content
6. Surfaces top articles in the feed

Discovery settings (all configurable):
- `duckduckgoEnabled`: boolean (default true, no key needed)
- `serperApiKey`: string (encrypted)
- `tavilyApiKey`: string (encrypted)
- `braveSearchApiKey`: string (encrypted)
- `exaApiKey`: string (encrypted)
- `discoveryFrequency`: 'hourly' | 'daily' | 'manual'
- `searchQueryTemplates`: customizable per-interest templates

### 5.3 Query Generation

```typescript
// Auto-generate diverse queries from user interests
function generateDiscoveryQueries(interests: string[]): string[] {
  const currentMonth = new Date().toISOString().slice(0, 7);
  return interests.flatMap(interest => [
    `${interest} ${currentMonth}`,
    `best ${interest} tools this week`,
    `${interest} tutorial guide`,
    `${interest} breakthrough research`,
    `${interest} open source project`,
  ]);
}
```

---

## 6. CONTENT SOURCES (120+ RSS + APIs)

### 6.1 RSS Feed Catalog

All feeds pre-seeded in the database. Users can add more. OPML import/export supported.

**Productivity / Life Optimization**
```
https://lifehacker.com/rss
https://www.lifehack.org/feed
https://zenhabits.net/feed
https://scotthyoung.com/blog/feed
https://calnewport.com/blog/feed
https://jamesclear.com/feed
https://aliabdaal.com/feed
https://dariusforoux.com/feed
https://fs.blog/feed
https://www.lesswrong.com/feed.xml
https://nesslabs.com/feed
```

**Hacker News / Elite Tech**
```
https://news.ycombinator.com/rss
https://hnrss.org/best
https://lobste.rs/rss
https://dev.to/feed
https://stackoverflow.blog/feed
https://feeds.arstechnica.com/arstechnica/index
https://www.theverge.com/rss/index.xml
https://techcrunch.com/feed
https://simonwillison.net/atom/everything/
http://www.aaronsw.com/2002/feeds/pgessays.rss
```

**How-To / Tutorials**
```
https://www.wikihow.com/feed.rss
https://www.howtogeek.com/feed/
https://www.makeuseof.com/feed/
https://www.instructables.com/feed/channel
https://gadgethacks.com/rss.xml
https://tag.wonderhowto.com/rss.xml
```

**AI / Automation / Future Tech**
```
https://openai.com/news/rss.xml
https://www.anthropic.com/news/rss.xml
https://huggingface.co/blog/feed.xml
https://blog.langchain.dev/rss/
https://towardsdatascience.com/feed
https://sebastianraschka.com/rss.xml
https://www.bensbites.com/feed
https://blog.google/technology/ai/rss/
https://lilianweng.github.io/index.xml
https://www.deeplearning.ai/blog/feed/
https://newsletter.theaiedge.io/feed
```

**Software Engineering**
```
https://martinfowler.com/feed.atom
https://blog.pragmaticengineer.com/rss/
https://www.joelonsoftware.com/feed/
https://blog.cloudflare.com/rss/
https://netflixtechblog.com/feed
https://engineering.fb.com/feed/
https://github.blog/feed/
https://vercel.com/blog/rss.xml
https://supabase.com/blog/rss.xml
```

**Finance (India-Focused + Global)**
```
https://finshots.in/archive/feed.xml
https://stableinvestor.com/feed
https://zerodha.com/varsity/feed/
https://www.morningbrew.com/feed.xml
https://awealthofcommonsense.com/feed/
https://collabfund.com/blog/feed/
https://economictimes.indiatimes.com/rssfeedstopstories.cms
```

**India Tech & Startups**
```
https://yourstory.com/feed
https://inc42.com/feed/
```

**Cybersecurity**
```
https://krebsonsecurity.com/feed/
https://www.schneier.com/feed/atom/
https://www.troyhunt.com/rss/
https://thehackernews.com/feeds/posts/default
https://www.bleepingcomputer.com/feed/
```

**Long-form / Essays**
```
https://waitbutwhy.com/feed
https://nautil.us/feed/
https://aeon.co/feed.rss
https://longform.org/feed
https://stratechery.com/feed/
https://www.ribbonfarm.com/feed/
```

**Android & Mobile**
```
https://www.androidauthority.com/feed/
https://www.xda-developers.com/feed/
```

**Privacy & Digital Rights**
```
https://www.privacyguides.org/en/feed_rss_created.xml
https://www.eff.org/rss/updates.xml
```

**Reddit RSS Feeds**
```
https://www.reddit.com/r/productivity/.rss
https://www.reddit.com/r/selfhosted/.rss
https://www.reddit.com/r/privacy/.rss
https://www.reddit.com/r/android/.rss
https://www.reddit.com/r/foss/.rss
https://www.reddit.com/r/opensource/.rss
https://www.reddit.com/r/singularity/.rss
https://www.reddit.com/r/MachineLearning/.rss
https://www.reddit.com/r/programming/.rss
https://www.reddit.com/r/webdev/.rss
https://www.reddit.com/r/startups/.rss
https://www.reddit.com/r/netsec/.rss
https://www.reddit.com/r/finance/.rss
https://www.reddit.com/r/financialindependence/.rss
https://www.reddit.com/r/IndiaInvestments/.rss
```

**YouTube RSS** (format: `https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID`)
```
UCsBjURrPoezykLs9EqgamOA  — Fireship
UCbRP3c757lWg9M-U7TyEkXA  — Theo (t3.gg)
UCoOae5nYA7VqaXzerajD0lg  — Ali Abdaal
UC4QZ_LsYcvcq7qOsOhpAI4A  — ColdFusion
UC9-y-6csu5WGm29I7JiwpnA  — Computerphile
UCVls1GmFKf6WlTraIb_IaJg  — NetworkChuck
```

### 6.2 Special APIs (Beyond RSS)

```typescript
// Hacker News (Algolia API — free, no key)
https://hn.algolia.com/api/v1/search?tags=front_page

// GitHub Trending (GitHub Search API — no key for basic)
https://api.github.com/search/repositories?q=created:>DATE+stars:>50&sort=stars

// Product Hunt (RSS)
https://www.producthunt.com/feed

// DEV.to (API, no key needed for public)
https://dev.to/api/articles?top=7
```

---

## 7. RECOMMENDATION ENGINE

### 7.1 Scoring Formula

```
FinalScore = (
  0.35 × RelevanceScore   (user interest alignment)
  0.25 × RecencyScore     (exponential decay, 48hr half-life)
  0.20 × QualityScore     (source rep + content quality)
  0.10 × DiversityScore   (topic breadth encourager)
  0.05 × TrendingBoost    (spike detection)
  0.05 × IndiaBoost       (India-relevant content)
) × AntiClickbaitMultiplier (0.3–1.0)
```

### 7.2 Interest Learning

Every user action updates their interest vector:
- view: +0.1, read: +0.3, save: +0.5, highlight: +0.7, note: +0.8, share: +1.0, dismiss: -0.2
- Interest weights decay by 0.95× per day of inactivity
- Cold start: use onboarding topic selections

### 7.3 Anti-Clickbait Scoring

Penalize: excessive caps ratio, multiple !/? marks, "You won't believe", "shocking", "mind-blowing", vague superlatives. Score: 0.3 (heavy penalty) to 1.0 (no penalty).

### 7.4 Quality Scoring

Reward: word count 800–3,000, trusted sources (arxiv.org, github.com, paulgraham.com, etc.), low link density. Penalize: link density >0.3 (listicle), word count <300.

### 7.5 Trending Detection

Compare topic frequency in last 24h vs 7-day rolling baseline. Spike ratio >2.0 with count ≥3 = trending. Surface in Explore tab.

---

## 8. DATABASE SCHEMA (22 Tables)

> Agent: search the web for Drizzle ORM latest syntax before writing schema. Use Supabase Postgres as primary. Enable RLS on all user-scoped tables.

Tables: `users`, `sessions`, `feeds`, `user_feeds`, `articles`, `user_article_interactions`, `bookmarks`, `highlights`, `notes`, `collections`, `collection_articles`, `tags`, `article_tags`, `user_interests`, `recommendation_scores`, `keyword_alerts`, `gamification_stats`, `api_keys`, `user_settings`, `knowledge_graph_nodes`, `knowledge_graph_edges`, `push_subscriptions`

Key schema notes:
- `articles.embedding_vec vector(384)` — pgvector for semantic search (all-MiniLM-L6-v2 via Transformers.js)
- `articles.search_tsv tsvector GENERATED ALWAYS` — automatic FTS
- `bookmarks` includes full FSRS fields (stability, difficulty, elapsed_days, etc.)
- `api_keys.encrypted_key` — AES-256-GCM encrypted before storage
- `user_settings.ai_provider_priority jsonb` — ordered list of provider preferences
- `user_settings.push_subscription jsonb` — Web Push subscription object

RLS policy template (apply to all user-scoped tables):
```sql
CREATE POLICY "user_owns_data" ON table_name
  FOR ALL USING (
    user_id = (SELECT id FROM users WHERE supabase_id = auth.uid()::text)
  );
```

Supabase keep-alive: cron job every 6 hours to prevent 7-day inactivity pause.

---

## 9. API STRUCTURE (40+ Routes)

All routes are Next.js App Router Route Handlers. Auth enforced via middleware. Cron routes protected by `CRON_SECRET` header.

```
/api/feeds          GET, POST
/api/feeds/[id]     GET, PUT, DELETE
/api/feeds/discover GET (suggested feeds by category)
/api/feeds/import   POST (OPML)
/api/articles       GET (paginated, filter by feed/status/date)
/api/articles/[id]  GET, PATCH (read status, interactions)
/api/ai/summarize   POST
/api/ai/chat        POST (streaming)
/api/ai/tags        POST
/api/ai/digest      POST
/api/ai/explain     POST (ELI5)
/api/ai/insights    POST (key insight extraction)
/api/recommendations GET
/api/bookmarks      GET, POST, DELETE
/api/bookmarks/[id]/review POST (FSRS)
/api/highlights     GET, POST
/api/highlights/[id] PUT, DELETE
/api/notes          GET, POST
/api/notes/[id]     GET, PUT, DELETE
/api/collections    GET, POST
/api/collections/[id] GET, PUT, DELETE
/api/collections/[id]/articles GET, POST, DELETE
/api/search         GET (FTS)
/api/search/semantic POST (pgvector)
/api/settings       GET, PUT
/api/gamification   GET
/api/export         GET (JSON zip)
/api/export/markdown GET
/api/export/obsidian GET
/api/import         POST
/api/alerts         GET, POST
/api/alerts/[id]    PUT, DELETE
/api/knowledge-graph GET
/api/discovery      GET (web search results)
/api/push/subscribe POST
/api/push/unsubscribe POST
/api/cron/refresh-feeds   GET (every 30 min)
/api/cron/daily-digest    GET (01:30 UTC = 07:00 IST)
/api/cron/weekly-recap    GET (13:00 UTC Sunday = 18:30 IST)
/api/cron/cleanup         GET (03:00 UTC daily)
/api/cron/keep-alive      GET (every 6 hours)
/api/cron/discovery       GET (hourly web discovery)
```

---

## 10. SETTINGS PANEL (EXHAUSTIVE)

The settings system must be comprehensive. Every value configurable by the user. Persisted to `user_settings` table in DB. Synced across all devices on login.

### AI Providers
- Primary AI provider selector
- Provider priority drag-and-drop ordering
- Per-provider API key input (AES-256-GCM encrypted before DB storage)
- Per-provider model selector (fetched live from each provider's API)
- Per-task model assignment (summarize, chat, tags, digest, embed)
- Auto-summarize toggle
- Test connection button per provider
- Usage stats (requests today, tokens today)
- Live model discovery ("Refresh models" button)

### Discovery / Web Search
- DuckDuckGo enable/disable (no key, always free)
- Serper API key + enable/disable
- Tavily API key + enable/disable
- Brave Search API key + enable/disable
- Exa API key + enable/disable
- Discovery frequency (hourly/daily/manual)
- Custom search query templates per interest

### Feed Management
- Feed CRUD (add, edit, pause, delete)
- Per-feed notification toggle
- Fetch interval per feed (15min/30min/1hr/6hr/24hr)
- Import OPML, Export OPML
- Feed health dashboard (errors, last fetch, retry count)

### Reading Preferences
- Theme (dark/light/system)
- Font size (12–24px slider)
- Font family (4 curated options — NOT Inter/Roboto/Arial)
- Line height (1.4–2.0 slider)
- Max content width (600–900px slider)
- Reader mode default toggle
- Code block theme

### Notifications
- Push notifications enable/disable
- Email notifications enable/disable
- Daily digest enable/disable + time (IST timezone)
- Weekly recap enable/disable
- Keyword alerts CRUD

### Content Preferences
- India content boost enable/disable
- Language preference
- Anti-clickbait filter strength (off/light/heavy)
- Hide paywalled content toggle
- Minimum quality score threshold

### TTS
- Voice selector (populated from browser's SpeechSynthesis)
- Speed (0.5–2.0× slider)
- Auto-play on article open

### Offline & Storage
- Offline article count (10–200 slider)
- Auto-save top articles for offline toggle
- Clear offline cache button
- Storage usage display

### Gamification
- Enable/disable gamification
- Show streak reminder notification
- Weekly recap email

### Data & Export
- Export all data (JSON)
- Export notes + highlights (Markdown)
- Export Obsidian-compatible vault
- Import from JSON backup
- Reset recommendation engine
- Delete all data

### Hosting / Platform
- Active hosting platform display
- Database connection string (advanced)
- API base URL override (for self-hosting)

### Account
- Display name
- Email (read-only if Google auth)
- Change password
- Linked Google account
- Logout all devices
- Delete account

### About
- App version
- GitHub link
- Privacy policy, Terms, Cookie policy, Disclaimer
- Install PWA button

---

## 11. UI/UX DESIGN SYSTEM

### Design Direction: "Dark Observatory"

Aesthetic: Editorial research dashboard. Bold serif display type. Deep space backgrounds. Precision grid. The reading environment of someone who treats information seriously.

**Typography** (must use these — no Inter, no Roboto, no Arial):
- Display/Headlines: Playfair Display, 700/900 weight
- Body text: Newsreader, 400/600 weight (designed for long-form reading)
- UI labels: DM Mono or JetBrains Mono, 400 weight
- Code blocks: JetBrains Mono

**Color System (CSS Variables)**:
```css
/* Dark Mode (default) */
--atlas-bg-primary:    hsl(220, 22%, 4%);   /* Deep indigo-black */
--atlas-bg-secondary:  hsl(220, 20%, 8%);   /* Card surfaces */
--atlas-bg-tertiary:   hsl(220, 18%, 12%);  /* Elevated elements */
--atlas-border:        hsl(220, 16%, 18%);  /* Subtle borders */
--atlas-text-primary:  hsl(210, 20%, 92%);  /* Primary text */
--atlas-text-secondary:hsl(210, 14%, 62%);  /* Secondary text */
--atlas-text-muted:    hsl(210, 10%, 42%);  /* Muted/disabled */
--atlas-accent-emerald:hsl(165, 80%, 45%);  /* Primary CTA */
--atlas-accent-amber:  hsl(35, 95%, 55%);   /* Saves/highlights */
--atlas-accent-sky:    hsl(200, 80%, 55%);  /* Links/info */

/* Light Mode */
--atlas-bg-primary:    hsl(40, 20%, 97%);   /* Warm off-white */
--atlas-bg-secondary:  hsl(40, 15%, 94%);
--atlas-text-primary:  hsl(220, 25%, 10%);
```

**Layout**:
- 4px base grid
- Border radius: 8px cards, 12px modals, 20px pills
- Mobile bottom nav: 64px height
- Desktop sidebar: 280px → 64px collapsed
- Max article width: 680px
- Mobile breakpoints: sm:640, md:768, lg:1024, xl:1280

**Motion**:
- Micro-interactions: 150ms ease-out
- Navigation: 250ms ease-in-out
- Modals: 400ms spring
- Page transitions: fade + slide 200ms
- Skeleton shimmer: 1.5s cycle
- Swipe gestures: 300ms with velocity momentum

### Mobile Bottom Navigation
```
🏠 Feed | 🔍 Explore | 📚 Library | ⚙️ Settings
```

### Article Card (Mobile)
- Thumbnail 80×80px left-aligned
- Source name • reading time
- Title (2-line clamp, Playfair Display)
- 1-line AI summary
- Tag pills (3 max shown)
- Engagement stats (points, comments, time)
- Swipe right → Save, Swipe left → Dismiss
- Long press → quick actions

### Reader View
- Full-width header: title, source, author, date, reading time
- Collapsible AI panel: TL;DR, Full Summary, Key Insights, ELI5, Chat
- Text selection → highlight toolbar (4 colors + Add Note)
- Collapsible notes sidebar
- TTS controls (play/pause/speed)
- Progress indicator
- Related articles at bottom
- Share, bookmark, collection-add in header

---

## 12. AUTHENTICATION

Supabase Auth:
- Email + password signup/login
- Google OAuth
- **Identity linking**: if Google email matches existing email account → auto-link (Supabase handles this natively)
- JWT stored in HTTP-only cookies via `@supabase/ssr`
- Middleware protects all `/(main)` routes
- Public feed accessible without login

```typescript
// src/middleware.ts — protect all routes except public ones
const PUBLIC_ROUTES = ["/", "/login", "/signup", "/callback", "/api/cron", "/api/webhooks"];
```

---

## 13. OFFLINE & PWA

### PWA Manifest
- Display: standalone
- Background: hsl(220, 22%, 4%) (matches dark bg)
- Icons: 192, 384, 512, maskable variants
- Shortcuts: Feed, Explore, Saved

### Service Worker (Serwist)
Cache strategies:
- `article-cache`: StaleWhileRevalidate, 100 entries, 7 days
- `feed-cache`: NetworkFirst, 30 min TTL
- `image-cache`: CacheFirst, 200 entries, 30 days
- `font-cache`: CacheFirst, 1 year
- Offline fallback page at `/offline`

### IndexedDB
Tables: `offlineArticles`, `pendingSync`, `searchIndex`
- Offline articles: saved for offline reading
- Pending sync: queue of bookmarks/notes/highlights created offline, synced on reconnect
- All cloud data synced — no local-only state except offline queue

### Cloud Sync Guarantee
Everything must sync to the cloud. If user installs Atlas on a new phone, they get exactly the same experience: same feed, same bookmarks, same notes, same settings. Offline reading works for pre-downloaded articles only. The recommendation engine, notes, highlights, collections — all cloud-persisted.

### iOS PWA Notes
Document these limitations in settings/about:
- Push notifications require "Add to Home Screen" via Safari
- Storage quota ~50MB
- No background sync when app is closed
- EU DMA compliance may affect standalone mode

---

## 14. KNOWLEDGE MANAGEMENT

### Features
- **Bookmarks**: one-tap save, swipe-to-save gesture
- **Highlights**: text selection → color picker (yellow/green/blue/pink) → save with optional note
- **Notes**: standalone markdown notes or attached to articles
- **Collections**: manual folders + smart folders (AI-powered query-based)
- **Tags**: user-defined + AI-generated (differentiated in UI)
- **Spaced Repetition**: FSRS algorithm via `ts-fsrs` — resurface saved articles at optimal review intervals
- **Knowledge Graph**: force-directed graph (react-force-graph) showing topic/article/tag relationships
- **Export**: Markdown zip, Obsidian vault format (compatible with Obsidian links and frontmatter), full JSON backup

---

## 15. AI FEATURES

All features must work client-side via Puter.js when available, fallback to server-side providers:

| Feature | Prompt Style | Output |
|---|---|---|
| TL;DR | Single sentence, ≤30 words | Shown in card |
| Full Summary | 3–5 bullet points, key insights | Expanded panel |
| Key Insights | 3–5 actionable numbered points | Expandable |
| ELI5 | Explain to curious 12-year-old, ≤200 words | Toggle mode |
| Auto-Tags | JSON array of 3–7 specific lowercase tags | Stored in DB |
| Quality Score | 0–100, based on title/source/word-count | Internal scoring |
| Article Chat | Contextual Q&A with streaming | Chat panel |
| Daily Digest | AI-written morning briefing from top articles | Email + in-app |
| Weekly Recap | AI summary of week's reading + stats | Email + in-app |
| Smart Folders | AI query to find articles matching a concept | Collection feature |

---

## 16. GAMIFICATION

| Feature | Description |
|---|---|
| Reading Streak | Consecutive days with at least 1 article read |
| Curiosity Score | Logarithmic breadth-of-topics metric (0–100) |
| Learning Score | Weighted: articles read, notes, highlights, saves, reading time |
| Knowledge Graph | Visual representation of topic connections |
| Weekly Recap | Email every Sunday 18:30 IST with AI-generated insights |
| Longest Streak | All-time record tracked |
| Topics Explored | Count of distinct topics interacted with |

All gamification features optional (can be disabled in settings).

---

## 17. FILE STRUCTURE & MODULARITY RULES

**CRITICAL**: Every file must be ≤200 lines. No exceptions. When a file exceeds 180 lines, extract into sub-files. The repository will have hundreds of files — this is intentional and desirable. Balanced modularity = small, focused, testable units.

```
atlas.oriz.in/
├── .github/workflows/
│   ├── ci.yml
│   └── deploy.yml
├── public/
│   ├── icons/                    # PWA icons
│   ├── fonts/                    # Self-hosted woff2 (Playfair Display, Newsreader, JetBrains Mono)
│   └── sw.ts                     # Serwist entry
├── src/
│   ├── app/
│   │   ├── (auth)/               # login, signup, callback
│   │   ├── (main)/               # authenticated layout group
│   │   │   ├── layout.tsx        # App shell + bottom nav
│   │   │   ├── feed/page.tsx
│   │   │   ├── explore/page.tsx
│   │   │   ├── library/page.tsx
│   │   │   ├── search/page.tsx
│   │   │   ├── article/[id]/page.tsx
│   │   │   ├── collections/
│   │   │   ├── knowledge-graph/page.tsx
│   │   │   ├── settings/         # All settings subpages
│   │   │   └── onboarding/       # 4-step onboarding
│   │   ├── api/                  # All route handlers
│   │   ├── manifest.ts           # Dynamic PWA manifest
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Landing/redirect
│   │   └── globals.css           # TailwindCSS v4 + tokens
│   ├── components/
│   │   ├── ui/                   # Primitives (button, card, modal, etc.)
│   │   ├── layout/               # Shell, nav, header, sidebar
│   │   ├── feed/                 # Article cards, list, filters
│   │   ├── reader/               # Reader view, highlights, notes, TTS, AI
│   │   ├── ai/                   # Summary cards, chat, tags
│   │   ├── discovery/            # Trending, HN, GitHub, hidden gems
│   │   ├── knowledge/            # Collections, tags, graph
│   │   ├── gamification/         # Streaks, scores, recap
│   │   ├── onboarding/           # Interest selector, source picker
│   │   └── settings/             # All settings UI components
│   ├── lib/
│   │   ├── db/                   # schema.ts, client.ts, migrations/, seed.ts
│   │   ├── ai/                   # provider-registry.ts, puter.ts, gemini.ts,
│   │   │                         # groq.ts, cerebras.ts, openrouter.ts, nvidia.ts,
│   │   │                         # mistral.ts, huggingface.ts, cohere.ts,
│   │   │                         # github-models.ts, cloudflare-ai.ts,
│   │   │                         # vercel-gateway.ts, model-discovery.ts,
│   │   │                         # prompts.ts, types.ts
│   │   ├── feeds/                # parser.ts, fetcher.ts, deduplicator.ts,
│   │   │                         # sources.ts, health-monitor.ts,
│   │   │                         # github-trending.ts, hacker-news.ts,
│   │   │                         # product-hunt.ts
│   │   ├── discovery/            # web-search.ts, duckduckgo.ts, serper.ts,
│   │   │                         # tavily.ts, brave.ts, exa.ts, query-generator.ts
│   │   ├── recommendation/       # engine.ts, interest-vectors.ts, scoring.ts,
│   │   │                         # quality.ts, trending.ts, spaced-repetition.ts
│   │   ├── search/               # orama-index.ts, postgres-fts.ts, semantic.ts
│   │   ├── auth/                 # client.ts, server.ts, middleware.ts, utils.ts
│   │   ├── push/                 # vapid.ts, subscribe.ts, send.ts
│   │   ├── export/               # markdown.ts, obsidian.ts, json.ts
│   │   ├── gamification/         # streaks.ts, scores.ts, graph.ts
│   │   ├── email/                # resend.ts, templates/ (digest, recap, alert)
│   │   └── utils/                # crypto.ts, reading-time.ts, date.ts, constants.ts
│   ├── hooks/                    # use-article.ts, use-feed.ts, use-ai.ts,
│   │                             # use-offline.ts, use-swipe.ts, use-search.ts,
│   │                             # use-push.ts, use-theme.ts
│   ├── stores/                   # feed-store.ts, reader-store.ts, search-store.ts,
│   │                             # settings-store.ts, ui-store.ts
│   └── middleware.ts             # Next.js auth guard
├── tests/unit/
├── tests/integration/
├── tests/e2e/
├── open-next.config.ts           # Cloudflare Workers adapter
├── wrangler.toml                 # Cloudflare Workers config
├── drizzle.config.ts
├── next.config.ts
├── tsconfig.json
├── .env.example                  # Complete — all vars documented
├── .env.local                    # Never committed
├── vercel.json                   # Cron + Vercel config
├── package.json
├── pnpm-lock.yaml
├── LICENSE
└── README.md
```

---

## 18. ENVIRONMENT VARIABLES (Complete .env.example)

```env
# ═══════════════════════════════════════════════
# Atlas — .env.example
# Copy to .env.local and fill in all values
# Search the web for how to obtain each key
# ═══════════════════════════════════════════════

# ── App
NEXT_PUBLIC_APP_URL=https://atlas.oriz.in
NEXT_PUBLIC_APP_NAME=Atlas
NODE_ENV=production

# ── Supabase (Required)
# Get from: https://supabase.com/dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...

# ── Database (Drizzle ORM — Supabase Postgres pooler)
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# ── Turso (Optional edge cache)
# Get from: https://turso.tech/app
# TURSO_DATABASE_URL=libsql://your-db.turso.io
# TURSO_AUTH_TOKEN=eyJ...

# ── Puter.js (No key needed — client-side user-pays)
# No configuration required

# ── OpenRouter (Free :free models — 200 req/day)
# Get from: https://openrouter.ai/keys (no credit card needed)
OPENROUTER_API_KEY=sk-or-v1-...

# ── Google Gemini (Free: 1500 RPD Flash)
# Get from: https://aistudio.google.com/apikey
GEMINI_API_KEY=AI...

# ── Groq (Free: ~14K RPD)
# Get from: https://console.groq.com/keys
GROQ_API_KEY=gsk_...

# ── Cerebras (Free: 1M tokens/day)
# Get from: https://cloud.cerebras.ai
CEREBRAS_API_KEY=csk-...

# ── NVIDIA NIM (Free tier)
# Get from: https://build.nvidia.com
NVIDIA_API_KEY=nvapi-...

# ── Mistral (Free tier)
# Get from: https://console.mistral.ai/api-keys
MISTRAL_API_KEY=...

# ── Codestral / Mistral (Code tasks)
# Get from: https://codestral.mistral.ai
CODESTRAL_API_KEY=...

# ── HuggingFace (Free inference)
# Get from: https://huggingface.co/settings/tokens
HUGGINGFACE_TOKEN=hf_...

# ── Cohere (Free tier)
# Get from: https://dashboard.cohere.com/api-keys
COHERE_API_KEY=...

# ── GitHub Models (Free tier)
# Get from: https://github.com/settings/tokens
GITHUB_TOKEN=ghp_...

# ── Cloudflare Workers AI (Free with Workers)
# Get from: https://dash.cloudflare.com → Workers AI
CLOUDFLARE_AI_GATEWAY_URL=...
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_API_TOKEN=...

# ── Vercel AI Gateway (Optional)
# Get from: Vercel dashboard
# VERCEL_AI_GATEWAY_URL=...

# ── OpenCode Zen (Search web for current API format)
# OPENCODE_ZEN_API_KEY=...

# ── Discovery / Web Search
# DuckDuckGo — no key needed (https://api.duckduckgo.com)

# Serper (2,500 free searches/month)
# Get from: https://serper.dev
SERPER_API_KEY=...

# Tavily (1,000 free credits/month)
# Get from: https://tavily.com
TAVILY_API_KEY=...

# Brave Search (~1,000 free/month)
# Get from: https://brave.com/search/api
BRAVE_SEARCH_API_KEY=...

# Exa (1,000 free credits/month)
# Get from: https://exa.ai
EXA_API_KEY=...

# ── Email (Resend — 3,000 emails/month free)
# Get from: https://resend.com/api-keys
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=atlas@oriz.in

# ── Push Notifications (VAPID — generate with: npx web-push generate-vapid-keys)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=B...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:hi@oriz.in

# ── Encryption (API key storage — generate with: openssl rand -hex 32)
ENCRYPTION_KEY=...

# ── Cron security (generate with: openssl rand -hex 16)
CRON_SECRET=...

# ── Feature flags
NEXT_PUBLIC_ENABLE_GAMIFICATION=true
NEXT_PUBLIC_ENABLE_PUSH=true
NEXT_PUBLIC_ENABLE_TTS=true
NEXT_PUBLIC_ENABLE_DISCOVERY=true
NEXT_PUBLIC_ENABLE_KNOWLEDGE_GRAPH=true
```

---

## 19. VERCEL CRON (vercel.json)

```json
{
  "crons": [
    { "path": "/api/cron/refresh-feeds", "schedule": "*/30 * * * *" },
    { "path": "/api/cron/discovery", "schedule": "0 * * * *" },
    { "path": "/api/cron/daily-digest", "schedule": "30 1 * * *" },
    { "path": "/api/cron/weekly-recap", "schedule": "0 13 * * 0" },
    { "path": "/api/cron/cleanup", "schedule": "0 3 * * *" },
    { "path": "/api/cron/keep-alive", "schedule": "0 */6 * * *" }
  ]
}
```

All times UTC. Daily digest = 01:30 UTC = 07:00 IST. Weekly recap = 13:00 UTC Sunday = 18:30 IST.

---

## 20. CLOUDFLARE DEPLOYMENT

```typescript
// open-next.config.ts
import type { OpenNextConfig } from "@opennextjs/cloudflare";
const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
    },
  },
};
export default config;
```

Search the web for the latest `@opennextjs/cloudflare` setup instructions — they change with versions.

---

## 21. ONBOARDING FLOW

1. **Sign Up** — email/password or Google OAuth
2. **Select Interests** — 24 topic cards (AI, Engineering, Finance, Security, etc.) — pick 5+
3. **Choose Sources** — curated feed suggestions per selected interest
4. **AI Setup** — choose primary AI provider, optionally enter API keys
5. **Discovery Setup** — optionally add DuckDuckGo (enabled by default), Serper, etc.
6. **Notifications** — push + email preferences, digest time
7. **Theme** — dark/light + font preference
8. **Tutorial** — 4-step interactive overlay (gestures, AI features, search, nav)

---

## 22. IMPLEMENTATION ROADMAP

| Phase | Days | Milestone |
|---|---|---|
| 0: Setup | 1–2 | Next.js 15 + pnpm + Supabase + Drizzle + auth skeleton |
| 1: Core Feed | 3–4 | RSS parsing, 120+ feeds, article cards, reader view, PWA |
| 2: AI Integration | 3–4 | All 13+ providers, summarize, tags, ELI5, streaming chat |
| 3: Recommendation | 2–3 | Interest vectors, scoring, personalized feed, tracking |
| 4: Knowledge Mgmt | 3–4 | Bookmarks, highlights, notes, collections, FSRS, export |
| 5: Discovery | 2–3 | DuckDuckGo + paid APIs, trending, HN, GitHub, hidden gems |
| 6: Gamification | 2–3 | Streaks, scores, knowledge graph viz, digest emails |
| 7: Offline + PWA | 2 | IndexedDB, service worker, background sync, push notifs |
| 8: Settings | 2–3 | All settings panels, multi-provider AI config, onboarding |
| 9: Polish | 2–3 | Search, semantic search, Lighthouse ≥90, a11y, tests |
| **Total** | **22–31 days** | Production-ready at atlas.oriz.in |

---

## 23. QUALITY STANDARDS

- **Lighthouse**: Performance ≥90, Accessibility ≥95, Best Practices ≥95, PWA ✅
- **LCP**: <2.0s, **CLS**: <0.1, **FID**: <100ms
- **TypeScript**: strict mode, no `any`
- **Testing**: Vitest unit tests for all lib/ functions, integration tests for all API routes
- **Accessibility**: WCAG 2.1 AA, keyboard navigable, screen reader compatible
- **Error handling**: Every API route wrapped in try/catch with consistent error envelope
- **File size limit**: 200 lines maximum per file — STRICTLY ENFORCED

---

## 24. LEGAL PAGES

Render in `/settings/about` or dedicated routes:
- Privacy Policy (data stored in Supabase, AI processing via user's own API keys)
- Terms of Service (content from third-party feeds, AI summaries may be inaccurate)
- Cookie Policy (Supabase session cookies only, no tracking)
- Disclaimer (AI summaries not guaranteed accurate, content belongs to original authors)

---

## 25. README.md STRUCTURE

(Generate at the END of implementation, not at the start)

Include:
- Hero with badges (Next.js, TypeScript, TailwindCSS v4, Supabase, pnpm, MIT license, CI status)
- What is Atlas + key highlights
- Feature list (expandable sections)
- Setup (prerequisites, installation steps, pnpm commands)
- Environment variables guide (link to .env.example)
- How to get each API key (direct links)
- Deploy to Cloudflare Workers instructions
- Deploy to Vercel instructions
- How to add custom RSS feeds
- How to configure AI providers
- Architecture overview diagram
- Contributing guide
- License

---

## 26. FINAL AGENT CHECKLIST

Before submitting any work, the agent must verify:

- [ ] Every file is ≤200 lines
- [ ] pnpm used everywhere (no npm/yarn)
- [ ] All 13+ AI providers have implementation files
- [ ] All OpenRouter `:free` model IDs included (do NOT strip `:free` suffix)
- [ ] DuckDuckGo discovery works without any API key
- [ ] Feed accessible without login (general feed for logged-out users)
- [ ] Full cloud sync verified — all user data persisted
- [ ] Offline reading works for pre-downloaded articles
- [ ] FSRS spaced repetition integrated for bookmarks
- [ ] Knowledge graph renders with react-force-graph
- [ ] All settings persist across sessions and devices
- [ ] Supabase keep-alive cron configured
- [ ] AES-256-GCM encryption on all stored API keys
- [ ] RLS enabled on all user-scoped Postgres tables
- [ ] PWA manifest correct (icons, shortcuts, display: standalone)
- [ ] README.md generated last (not first)
- [ ] .env.example complete with zero placeholders left blank
- [ ] Design follows "Dark Observatory" aesthetic — Playfair Display, Newsreader, dark indigo bg
- [ ] No Inter, Roboto, Arial, or purple gradient anywhere in the codebase
- [ ] Searched the web before every major architectural decision

---

*Atlas — Know everything. Remember what matters.*