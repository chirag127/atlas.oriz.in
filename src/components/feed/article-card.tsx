"use client";

import { Clock, Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { relativeTime } from "@/lib/utils/date";
import { formatReadingTime } from "@/lib/utils/reading-time";
import type { Article } from "@/stores/feed-store";

interface ArticleCardProps {
  article: Article;
  onBookmark?: (id: string) => void;
  onClick?: (article: Article) => void;
}

export function ArticleCard({ article, onBookmark, onClick }: ArticleCardProps) {
  return (
    <article
      className="flex gap-3 p-4 border-b border-atlas-border-subtle hover:bg-atlas-bg-secondary/50 transition-colors cursor-pointer group"
      onClick={() => onClick?.(article)}
    >
      {article.imageUrl && (
        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-atlas-bg-tertiary">
          <img
            src={article.imageUrl}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-atlas-text-muted font-ui mb-1">
          <span>{article.sourceName ?? "Unknown"}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {formatReadingTime(article.readingTime)}
          </span>
          {article.publishedAt && (
            <>
              <span>·</span>
              <span>{relativeTime(article.publishedAt)}</span>
            </>
          )}
        </div>

        <h3 className="font-display text-base font-bold leading-tight line-clamp-2 mb-1 group-hover:text-atlas-accent-emerald transition-colors">
          {article.title}
        </h3>

        {(article.aiSummary ?? article.summary) && (
          <p className="text-sm text-atlas-text-secondary line-clamp-1 mb-2">
            {article.aiSummary ?? article.summary}
          </p>
        )}

        <div className="flex items-center gap-2">
          {article.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs font-ui rounded-full bg-atlas-bg-tertiary text-atlas-text-muted"
            >
              {tag}
            </span>
          ))}

          <div className="ml-auto flex items-center gap-1">
            {article.qualityScore > 70 && (
              <span className="text-xs text-atlas-accent-emerald font-ui">
                ★ {Math.round(article.qualityScore)}
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookmark?.(article.id);
              }}
              className="p-1 rounded text-atlas-text-muted hover:text-atlas-accent-amber transition-colors"
              aria-label={article.isBookmarked ? "Remove bookmark" : "Bookmark"}
            >
              {article.isBookmarked ? (
                <BookmarkCheck size={16} className="text-atlas-accent-amber" />
              ) : (
                <Bookmark size={16} />
              )}
            </button>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded text-atlas-text-muted hover:text-atlas-accent-sky transition-colors"
              aria-label="Open original"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
