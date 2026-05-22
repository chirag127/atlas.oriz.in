import { exportArticleToMarkdown, exportNoteToMarkdown } from "./markdown";

interface ExportData {
  articles: Array<{
    title: string;
    url: string;
    author?: string;
    publishedAt?: string;
    summary?: string;
    content?: string;
    tags?: string[];
  }>;
  notes: Array<{
    title: string;
    content: string;
    createdAt: string;
  }>;
}

export function exportToObsidianVault(data: ExportData): Map<string, string> {
  const files = new Map<string, string>();

  // Articles
  for (const article of data.articles) {
    const filename = `articles/${sanitizeFilename(article.title)}.md`;
    files.set(filename, exportArticleToMarkdown(article));
  }

  // Notes
  for (const note of data.notes) {
    const filename = `notes/${sanitizeFilename(note.title)}.md`;
    files.set(filename, exportNoteToMarkdown(note));
  }

  // Index
  const index = [
    "# Atlas Export",
    "",
    `Exported: ${new Date().toISOString()}`,
    "",
    `## Articles (${data.articles.length})`,
    ...data.articles.map((a) => `- [[${sanitizeFilename(a.title)}]]`),
    "",
    `## Notes (${data.notes.length})`,
    ...data.notes.map((n) => `- [[${sanitizeFilename(n.title)}]]`),
  ].join("\n");

  files.set("index.md", index);

  return files;
}

function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
}
