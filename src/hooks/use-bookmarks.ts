"use client";

import { useState, useEffect, useCallback } from "react";

interface Bookmark {
  id: string;
  articleId: string;
  title: string;
  url: string;
  createdAt: string;
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookmarks")
      .then((r) => r.json())
      .then((data) => setBookmarks(data.bookmarks ?? data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const addBookmark = useCallback(async (articleId: string) => {
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId }),
    });
    if (res.ok) {
      const data = await res.json();
      setBookmarks((prev) => [data, ...prev]);
    }
    return res.ok;
  }, []);

  const removeBookmark = useCallback(async (id: string) => {
    const res = await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
    if (res.ok) {
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    }
    return res.ok;
  }, []);

  const isBookmarked = useCallback(
    (articleId: string) => bookmarks.some((b) => b.articleId === articleId),
    [bookmarks]
  );

  return { bookmarks, loading, addBookmark, removeBookmark, isBookmarked };
}
