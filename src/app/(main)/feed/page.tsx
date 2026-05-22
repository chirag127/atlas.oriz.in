"use client";

import { useState, useEffect, useCallback } from "react";
import { ArticleList } from "@/components/feed/article-list";
import { CategoryTabs } from "@/components/feed/category-tabs";
import { ReaderView } from "@/components/reader/reader-view";
import { useFeedStore, type Article } from "@/stores/feed-store";
import { FEED_CATEGORIES } from "@/lib/feeds/sources";

export default function FeedPage() {
  const {
    articles, setArticles, isLoading, setLoading,
    activeCategory, setActiveCategory, selectedArticle, setSelectedArticle,
  } = useFeedStore();

  const [page, setPage] = useState(1);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        ...(activeCategory && { category: activeCategory }),
      });
      const res = await fetch(`/api/articles?${params}`);
      if (res.ok) {
        const data = await res.json();
        if (page === 1) {
          setArticles(data.articles ?? []);
        }
      }
    } catch (e) {
      console.error("Failed to fetch articles:", e);
    } finally {
      setLoading(false);
    }
  }, [page, activeCategory, setArticles, setLoading]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleBookmark = async (id: string) => {
    try {
      await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId: id }),
      });
    } catch (e) {
      console.error("Bookmark failed:", e);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold mb-4">Your Feed</h1>
        <CategoryTabs
          categories={FEED_CATEGORIES}
          active={activeCategory}
          onSelect={setActiveCategory}
        />
      </div>

      <ArticleList
        articles={articles}
        isLoading={isLoading}
        onBookmark={handleBookmark}
        onClick={setSelectedArticle}
      />

      {selectedArticle && (
        <ReaderView
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </>
  );
}
