"use client";

import { ArticleCard } from "./article-card";
import { ArticleCardSkeleton } from "@/components/ui/skeleton";
import type { Article } from "@/stores/feed-store";

interface ArticleListProps {
  articles: Article[];
  isLoading?: boolean;
  onBookmark?: (id: string) => void;
  onClick?: (article: Article) => void;
  emptyMessage?: string;
}

export function ArticleList({
  articles,
  isLoading,
  onBookmark,
  onClick,
  emptyMessage = "No articles yet. Add some feeds to get started!",
}: ArticleListProps) {
  if (isLoading && articles.length === 0) {
    return (
      <div className="divide-y divide-atlas-border-subtle">
        {Array.from({ length: 5 }).map((_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-4xl mb-4">📭</div>
        <p className="text-atlas-text-secondary font-ui">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-atlas-border-subtle">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          onBookmark={onBookmark}
          onClick={onClick}
        />
      ))}
      {isLoading && (
        <div className="py-4">
          <ArticleCardSkeleton />
        </div>
      )}
    </div>
  );
}
