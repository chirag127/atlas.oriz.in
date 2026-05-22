"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Clock } from "lucide-react";

interface Article {
  id: string;
  title: string;
  summary?: string | null;
  content?: string | null;
  url: string;
  publishedAt: string;
  feedId?: string | null;
  readingTimeMinutes?: number | null;
}

export default function ArticleDetail({
  article,
  feedTitle,
}: {
  article: Article;
  feedTitle: string;
}) {
  const readingTime = article.readingTimeMinutes ?? Math.max(1, Math.ceil((article.content?.length ?? 0) / 1500));

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href="/feed"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to feed
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 leading-tight tracking-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              {feedTitle}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {readingTime} min read
            </span>
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </header>

        {article.summary && (
          <div className="mb-8 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 text-zinc-300 text-sm leading-relaxed">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 block">
              Summary
            </span>
            {article.summary}
          </div>
        )}

        <div className="prose prose-invert prose-zinc max-w-none text-zinc-300 leading-relaxed space-y-4">
          {article.content ? (
            article.content.split("\n").map((paragraph: string, i: number) => (
              <p key={i}>{paragraph}</p>
            ))
          ) : (
            <p className="text-zinc-500 italic">No content available.</p>
          )}
        </div>
      </article>

      <div className="mt-12 pt-8 border-t border-zinc-800">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm text-white transition-colors"
        >
          Read original
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </main>
  );
}
