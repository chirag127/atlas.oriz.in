"use client";

import { useState, useCallback } from "react";

export function useArticle() {
  const [loading, setLoading] = useState(false);

  const bookmark = useCallback(async (articleId: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId }),
      });
      return res.ok;
    } finally {
      setLoading(false);
    }
  }, []);

  const markRead = useCallback(async (articleId: string) => {
    try {
      await fetch(`/api/articles/${articleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
    } catch (e) {
      console.error("Failed to mark as read:", e);
    }
  }, []);

  const highlight = useCallback(
    async (articleId: string, text: string, color: string) => {
      try {
        const res = await fetch("/api/highlights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ articleId, text, color }),
        });
        return res.ok;
      } catch {
        return false;
      }
    },
    []
  );

  return { bookmark, markRead, highlight, loading };
}
