# Atlas

> Your personal intelligence feed — everything the web knows, ranked for you

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Free-3fcf8e)](https://supabase.com)
[![pnpm](https://img.shields.io/badge/pnpm-10-f9ad00)](https://pnpm.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

Atlas is a **Google Discover replacement for power users** — a mobile-first PWA that aggregates every corner of the web (RSS, Reddit, Hacker News, GitHub, YouTube, AI news, finance, cybersecurity, privacy) and surfaces the most relevant content using a recommendation engine that learns from every interaction.

## Key Highlights

- **Works without login** — full feed accessible as guest
- **13+ AI providers** — Puter.js (zero-config), Gemini, Groq, OpenRouter, Cerebras, NVIDIA, Mistral, Cohere, HuggingFace, GitHub Models, Cloudflare AI
- **45+ RSS feeds** pre-seeded across 10 categories
- **Web discovery** — DuckDuckGo search integration (no API key needed)
- **Dark Observatory** design — Playfair Display + Newsreader typography, deep indigo-black backgrounds
- **Offline-first PWA** — Serwist service worker, IndexedDB cache
- **Knowledge management** — bookmarks, highlights, notes, collections, spaced repetition (FSRS)
- **Gamification** — reading streaks, curiosity scores, knowledge graph visualization
- **Full cloud sync** — Supabase Postgres + pgvector for semantic search

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript strict) |
| Styling | TailwindCSS v4 (CSS-first `@theme` config) |
| Database | Supabase (Postgres + pgvector + Auth + Storage) |
| ORM | Drizzle ORM |
| AI Primary | Puter.js (client-side, zero-config, 400+ models) |
| AI Fallbacks | Gemini, Groq, Cerebras, OpenRouter, NVIDIA, Mistral, Cohere, HuggingFace, GitHub Models, Cloudflare AI |
| PWA | Serwist (`@serwist/next`) |
| State | Zustand + TanStack Query |
| Search | Postgres tsvector + Orama (client-side FTS) |
| Vectors | Transformers.js (local) + Supabase pgvector |
| Spaced Rep | ts-fsrs (FSRS algorithm) |
| Hosting | Vercel (primary) / Cloudflare Workers (backup) |
| Package Mgr | pnpm (mandatory) |

## Quick Start

### Prerequisites

- Node.js 22+
- pnpm 10+ (`npm install -g pnpm`)

### Installation

```bash
git clone https://github.com/chirag127/atlas.oriz.in.git
cd atlas.oriz.in
pnpm install
```

### Environment Variables

```bash
cp .env.example .env.local
```

**Atlas works with zero configuration.** The following features work without any API keys:

- Puter.js AI (client-side, uses user's Puter account)
- DuckDuckGo discovery (no key needed)
- Demo articles (when no database configured)

For full functionality, configure:

| Variable | Required | Get From |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | [supabase.com/dashboard](https://supabase.com/dashboard) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Optional | Supabase → Settings → API |
| `DATABASE_URL` | Optional | Supabase → Settings → Database |
| `GEMINI_API_KEY` | Optional | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| `GROQ_API_KEY` | Optional | [console.groq.com/keys](https://console.groq.com/keys) |
| `OPENROUTER_API_KEY` | Optional | [openrouter.ai/keys](https://openrouter.ai/keys) |
| `CEREBRAS_API_KEY` | Optional | [cloud.cerebras.ai](https://cloud.cerebras.ai) |
| `RESEND_API_KEY` | Optional | [resend.com/api-keys](https://resend.com/api-keys) |

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Database Setup (Optional)

```bash
# Push schema to Supabase
pnpm db:push

# Seed default feeds
pnpm db:seed

# Open Drizzle Studio
pnpm db:studio
```

## Features

### Feed & Discovery
- 45+ pre-seeded RSS feeds across 10 categories
- Web discovery via DuckDuckGo (free, no key)
- Optional paid discovery: Serper, Tavily, Brave Search, Exa
- Personalized recommendation engine with interest learning
- Anti-clickbait scoring
- India content boost

### AI Features
- **Puter.js** — zero-config, client-side, 400+ models
- **11 server-side providers** with automatic fallback chain
- Per-task model selection (summarize, chat, tags, digest, embed)
- TL;DR, full summary, key insights, ELI5, article chat
- Live model discovery with "Refresh models" button
- AES-256-GCM encryption for stored API keys

### Knowledge Management
- Bookmarks with FSRS spaced repetition
- Highlights with 4 color options
- Standalone and article-attached notes
- Collections (manual + AI-powered smart folders)
- Tags (user-defined + AI-generated)
- Knowledge graph visualization
- Export: Markdown, Obsidian vault, JSON backup

### PWA & Offline
- Serwist service worker
- Offline article reading
- Background sync for pending actions
- Push notifications (VAPID)
- Add to Home Screen support

### Gamification
- Reading streak tracking
- Curiosity score (topic breadth)
- Learning score (weighted activity)
- Knowledge graph connections
- Weekly recap email

## Deploy to Vercel

1. Push to GitHub
2. Import in [vercel.com](https://vercel.com)
3. Add environment variables
4. Deploy

Vercel auto-detects Next.js and deploys with zero config.

## Deploy to Cloudflare Workers

```bash
pnpm add -D @opennextjs/cloudflare
# Configure open-next.config.ts
pnpm build
npx wrangler deploy
```

## Architecture

```
atlas.oriz.in/
├── src/
│   ├── app/           # Next.js App Router pages + API routes
│   ├── components/    # React components (ui, feed, reader, ai, etc.)
│   ├── lib/           # Core libraries (db, ai, feeds, discovery, etc.)
│   ├── hooks/         # React hooks
│   ├── stores/        # Zustand stores
│   └── middleware.ts  # Auth guard
├── public/            # Static assets, fonts, service worker
└── tests/             # Unit, integration, e2e tests
```

## License

[MIT](LICENSE) — Chirag Singhal
