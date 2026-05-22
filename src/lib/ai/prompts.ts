export function tagPrompt(args: {
  title: string;
  summary: string;
  content: string;
}): string {
  return PROMPTS.tags.build(args.title, args.content ?? args.summary);
}

export function eli5Prompt(title: string, content: string): string {
  return PROMPTS.eli5.build(title, content);
}

export function insightsPrompt(title: string, content: string): string {
  return PROMPTS.insights.build(title, content);
}

export function digestPrompt(articles: string): string {
  return PROMPTS.digest.build(articles);
}

export const PROMPTS = {
  summarize: {
    system: "You are a concise article summarizer. Output exactly 3-5 bullet points capturing the key information. Each bullet should be one sentence, max 30 words.",
    build: (title: string, content: string) =>
      `Summarize this article in 3-5 bullet points:\n\nTitle: ${title}\n\nContent:\n${content.slice(0, 8000)}`,
  },
  tldr: {
    system: "Output a single sentence TL;DR of 25 words or fewer. No prefix like 'TL;DR:'.",
    build: (title: string, content: string) =>
      `One-sentence summary:\n\nTitle: ${title}\n\n${content.slice(0, 4000)}`,
  },
  tags: {
    system: 'Extract 3-7 specific lowercase tags as a JSON array. Example: ["machine-learning","python","tutorial"]. Only output the JSON array.',
    build: (title: string, content: string) =>
      `Extract tags:\n\nTitle: ${title}\n\n${content.slice(0, 4000)}`,
  },
  eli5: {
    system: "Explain the following to a curious 12-year-old. Use simple language, max 200 words. Be engaging and use analogies.",
    build: (title: string, content: string) =>
      `Explain like I'm 5:\n\nTitle: ${title}\n\n${content.slice(0, 6000)}`,
  },
  insights: {
    system: "Extract 3-5 actionable key insights as a numbered list. Each insight should be specific and useful. One sentence each.",
    build: (title: string, content: string) =>
      `Key insights from:\n\nTitle: ${title}\n\n${content.slice(0, 8000)}`,
  },
  quality: {
    system: "Rate the article quality from 0-100 based on: depth of content, originality, writing quality, and usefulness. Output only the number.",
    build: (title: string, source: string, wordCount: number) =>
      `Rate quality (0-100):\nTitle: ${title}\nSource: ${source}\nWord count: ${wordCount}`,
  },
  chat: {
    system: "You are a helpful reading assistant. Answer questions about the article concisely. If the answer isn't in the article, say so.",
    build: (title: string, content: string, question: string) =>
      `Article: ${title}\n\n${content.slice(0, 6000)}\n\nQuestion: ${question}`,
  },
  digest: {
    system: "Write a brief, engaging morning news digest. Use a warm but informative tone. 3-5 short paragraphs covering the most important items. Start with a greeting.",
    build: (articles: string) =>
      `Create a morning digest from these top articles:\n\n${articles}`,
  },
} as const;
