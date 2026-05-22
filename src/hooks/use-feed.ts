"use client";

import { useState, useEffect, useCallback } from "react";
import type { Article } from "@/stores/feed-store";

interface UseFeedOptions {
  limit?: number;
  category?: string;
}

export function useFeed({ limit = 20, category }: UseFeedOptions = {}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchArticles = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(pageNum), limit: String(limit) });
      if (category) params.set("category", category);
      const res = await fetch(`/api/articles?${params}`);
      if (res.ok) {
        const data = await res.json();
        if (pageNum === 1) {
          setArticles(data.articles ?? []);
        } else {
          setArticles((prev) => [...prev, ...(data.articles ?? [])]);
        }
        setHasMore((data.articles?.length ?? 0) === limit);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [limit, category]);

  useEffect(() => {
    fetchArticles(1);
  }, [fetchArticles]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchArticles(nextPage);
    }
  };

  const refresh = () => {
    setPage(1);
    fetchArticles(1);
  };

  return { articles, loading, hasMore, loadMore, refresh };
}
