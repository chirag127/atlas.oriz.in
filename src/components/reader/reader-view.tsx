"use client";

import { useState, useEffect } from "react";
import { X, Bookmark, BookmarkCheck, Share2, Volume2, MessageSquare, Lightbulb, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIPanel } from "@/components/ai/ai-panel";
import { relativeTime, fullDate } from "@/lib/utils/date";
import { formatReadingTime } from "@/lib/utils/reading-time";
import type { Article } from "@/stores/feed-store";

interface ReaderViewProps {
  article: Article;
  onClose: () => void;
}

export function ReaderView({ article, onClose }: ReaderViewProps) {
  const [showAI, setShowAI] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(article.isBookmarked ?? false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleBookmark = async () => {
    setIsBookmarked(!isBookmarked);
    try {
      await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId: article.id }),
      });
    } catch {
      setIsBookmarked(isBookmarked);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-atlas-bg-primary overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 glass border-b border-atlas-border-subtle">
        <div className="flex items-center justify-between h-12 px-4 max-w-3xl mx-auto">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-atlas-text-secondary hover:text-atlas-text-primary hover:bg-atlas-bg-secondary transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={handleBookmark}
              className="p-1.5 rounded-lg text-atlas-text-secondary hover:text-atlas-accent-amber transition-colors"
            >
              {isBookmarked ? (
                <BookmarkCheck size={20} className="text-atlas-accent-amber" />
              ) : (
                <Bookmark size={20} />
              )}
            </button>
            <button
              onClick={() => setShowAI(!showAI)}
              className={`p-1.5 rounded-lg transition-colors ${
                showAI
                  ? "text-atlas-accent-emerald bg-atlas-accent-emerald/10"
                  : "text-atlas-text-secondary hover:text-atlas-accent-emerald hover:bg-atlas-bg-secondary"
              }`}
            >
              <Lightbulb size={20} />
            </button>
            <button className="p-1.5 rounded-lg text-atlas-text-secondary hover:text-atlas-text-primary hover:bg-atlas-bg-secondary transition-colors">
              <Volume2 size={20} />
            </button>
            <button className="p-1.5 rounded-lg text-atlas-text-secondary hover:text-atlas-text-primary hover:bg-atlas-bg-secondary transition-colors">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Article meta */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-atlas-text-muted font-ui mb-3">
            <span>{article.sourceName ?? "Unknown"}</span>
            {article.author && (
              <>
                <span>·</span>
                <span>{article.author}</span>
              </>
            )}
            {article.publishedAt && (
              <>
                <span>·</span>
                <span>{fullDate(article.publishedAt)}</span>
              </>
            )}
            <span>·</span>
            <span>{formatReadingTime(article.readingTime)}</span>
          </div>

          <h1 className="font-display text-3xl font-bold leading-tight mb-4">
            {article.title}
          </h1>

          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs font-ui rounded-full bg-atlas-bg-tertiary text-atlas-text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* AI Panel */}
        {showAI && (
          <div className="mb-8">
            <AIPanel article={article} />
          </div>
        )}

        {/* Article content */}
        <div className="article-content">
          {article.content ? (
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          ) : (
            <div>
              <p className="text-atlas-text-secondary mb-4">
                {article.summary ?? "No content available."}
              </p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-atlas-accent-sky hover:underline"
              >
                Read full article <span>→</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
