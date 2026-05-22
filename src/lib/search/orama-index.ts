interface IndexEntry {
  id: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
}

let db: IndexEntry[] = [];

export async function getIndex(): Promise<IndexEntry[]> {
  return db;
}

export async function indexArticle(article: {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  tags: string[];
}) {
  const existing = db.findIndex((e) => e.id === article.id);
  const entry: IndexEntry = {
    id: article.id,
    title: article.title.toLowerCase(),
    summary: (article.summary ?? "").toLowerCase(),
    content: (article.content ?? "").toLowerCase(),
    tags: article.tags.map((t) => t.toLowerCase()),
  };
  if (existing >= 0) {
    db[existing] = entry;
  } else {
    db.push(entry);
  }
}

export async function searchOrama(
  query: string,
  limit = 20
): Promise<string[]> {
  const q = query.toLowerCase();
  const terms = q.split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const scored = db
    .map((entry) => {
      let score = 0;
      for (const term of terms) {
        if (entry.title.includes(term)) score += 10;
        if (entry.summary.includes(term)) score += 5;
        if (entry.content.includes(term)) score += 2;
        if (entry.tags.some((t) => t.includes(term))) score += 8;
      }
      return { id: entry.id, score };
    })
    .filter((e) => e.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map((e) => e.id);
}

export function clearIndex() {
  db = [];
}
