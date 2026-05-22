"use client";

import { useState, useEffect, useCallback } from "react";

interface Highlight {
  id: string;
  articleId: string;
  text: string;
  color: string;
  note?: string;
  position?: unknown;
}

export function useHighlights(articleId: string) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHighlights = useCallback(async () => {
    try {
      const res = await fetch(`/api/highlights/${articleId}`);
      if (res.ok) {
        const data = await res.json();
        setHighlights(Array.isArray(data) ? data : []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    fetchHighlights();
  }, [fetchHighlights]);

  const addHighlight = useCallback(async (text: string, color: string) => {
    const res = await fetch(`/api/highlights/${articleId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, color }),
    });
    if (res.ok) {
      const h = await res.json();
      setHighlights((prev) => [...prev, h]);
    }
    return res.ok;
  }, [articleId]);

  const removeHighlight = useCallback(async (id: string) => {
    const res = await fetch(`/api/highlights/${id}`, { method: "DELETE" });
    if (res.ok) setHighlights((prev) => prev.filter((h) => h.id !== id));
    return res.ok;
  }, []);

  return { highlights, loading, addHighlight, removeHighlight };
}
