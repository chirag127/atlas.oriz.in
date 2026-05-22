import { fullDate } from "../utils/date";

interface ExportArticle {
  title: string;
  url: string;
  author?: string;
  publishedAt?: string;
  summary?: string;
  content?: string;
  tags?: string[];
}

interface ExportNote {
  title: string;
  content: string;
  createdAt: string;
}

export function exportArticleToMarkdown(article: ExportArticle): string {
  const frontmatter = [
    "---",
    `title: "${article.title.replace(/"/g, '\\"')}"`,
    `url: ${article.url}`,
    article.author ? `author: "${article.author}"` : null,
    article.publishedAt ? `date: ${fullDate(article.publishedAt)}` : null,
    article.tags?.length ? `tags: [${article.tags.map((t) => `"${t}"`).join(", ")}]` : null,
    "---",
  ]
    .filter(Boolean)
    .join("\n");

  const body = [
    frontmatter,
    "",
    article.summary ? `> ${article.summary}` : "",
    "",
    article.content ?? "*No content available. [Read original](" + article.url + ")*",
  ].join("\n");

  return body;
}

export function exportNoteToMarkdown(note: ExportNote): string {
  return [
    "---",
    `title: "${note.title.replace(/"/g, '\\"')}"`,
    `created: ${fullDate(note.createdAt)}`,
    "---",
    "",
    note.content,
  ].join("\n");
}
