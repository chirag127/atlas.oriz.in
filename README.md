# Atlas (KnowledgeOS)

> **Domain**: `atlas.oriz.in` | **Repository**: `chirag127/atlas.oriz.in`

Atlas (formerly KnowledgeOS) is a mobile-first, offline-ready Progressive Web App (PWA) designed for high-signal technical, financial, productivity, and emerging tech knowledge curation. 

Built using **Svelte 5 (Runes)** and **SvelteKit**, styled with **Tailwind CSS v4** using custom Brutalist dark OLED aesthetics, and managed using **PNPM**. It integrates a client-side **Bring-Your-Own-Key (BYOK)** Completions Router supporting **13 distinct free/trial AI providers** alongside browser-local/remote vector embeddings.

---

## 🚀 Quick Start

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v20+) and [PNPM](https://pnpm.io/) (v10+) installed.

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/chirag127/atlas.oriz.in.git
cd atlas.oriz.in
pnpm install
```

### 3. Environment Setup
Copy `.env.example` to `.env` and configure your Firebase Web Client keys:
```bash
cp .env.example .env
```

### 4. Database Setup
Atlas uses Cloudflare D1 for server-side persistence and Dexie.js for client-side IndexedDB.
Run local D1 migrations:
```bash
pnpm exec wrangler d1 migrations apply DB --local
```

### 5. Running Locally
Start the Vite development server:
```bash
pnpm run dev
```
Open `http://localhost:5173` on your desktop or mobile browser.

---

## 🛠️ Tech Stack

- **Framework**: SvelteKit & Svelte 5 (utilizing reactive Runes: `$state`, `$derived`, `$effect`)
- **Styling**: Tailwind CSS v4 + custom Brutalist design system optimized for mobile OLED screens
- **Package Manager**: PNPM
- **Client DB**: Dexie.js (IndexedDB wrapper) with offline transaction queueing
- **Server DB**: Cloudflare D1 (SQLite database)
- **Deployment & Hosting**: Cloudflare Pages (Serverless Functions adapter)
- **Authentication**: Firebase Authentication (Email/Password & Google Login)
- **Rich Text Editor**: `@milkdown/crepe` WYSIWYG editor
- **Spaced Repetition**: `ts-fsrs` (Free Spaced Repetition Scheduler algorithm)

---

## 🧠 AI Bring-Your-Own-Key (BYOK) Providers

Atlas shifts all AI inference costs to the user. All keys are encrypted/stored strictly in browser LocalStorage. 

The Completions Router and Embeddings module support:

1. **Puter.js**: Browser-direct popup authentication (No key needed). Uses the biggest free model ending in `:free`.
2. **OpenRouter**: Free models routing via `openrouter/free`.
3. **Google AI Studio**: Free rate-limited Gemini 1.5/2.0 Flash models.
4. **NVIDIA NIM**: 1000 free trial credits for rotating model catalogs.
5. **Mistral AI Platform**: Free developer tier.
6. **Mistral Codestral**: Dedicated free developer keys for coding models.
7. **HuggingFace Inference**: Free serverless inference API tokens.
8. **Vercel AI Gateway**: Cache & observe routes wrapper.
9. **OpenCode Zen**: Free token-based coding assistant models.
10. **Cerebras**: Ultra-fast Llama 3.1 inference.
11. **Groq**: Free rate-limited developer sandbox models.
12. **Cohere**: Free trial developer keys (Command models).
13. **Cloudflare Workers AI**: Free daily Workers AI token allowances.

---

## 🔄 Bidirectional Sync & Offline-First

1. **Offline Queue**: Edits (notes, collections, reviews, cards) are written locally to IndexedDB immediately.
2. **Synchronization**: When internet connection is active, a bidirectional reconciliation endpoint (`/api/sync`) pushes local actions and pulls cloud updates using Last-Write-Wins (LWW) resolution.
3. **Service Workers**: Aggregated blogs, notes, and reviews are cached locally for full offline reading support.

---

## 📈 Verification & CI/CD

All code validations run via GitHub Actions.
- **Type Check**: `pnpm run check` (Runs `svelte-check` compiler diagnostics)
- **Lint Check**: `pnpm run lint`
- **Build Output**: `pnpm run build`

The repository workflow (`.github/workflows/deploy.yml`) is configured with `continue-on-error: true` for all validation steps so that check outcomes are fully visible to developers.

---

## 🛡️ License

Open source and free for personal optimization.
