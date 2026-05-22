"use client";

import { useState, useCallback } from "react";

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const run = useCallback(
    async (
      task: string,
      data: { title: string; content: string; url?: string; question?: string }
    ) => {
      setLoading(true);
      setResult("");
      try {
        const res = await fetch("/api/ai/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ task, ...data }),
        });
        if (res.ok) {
          const json = await res.json();
          setResult(json.content ?? "");
          return json.content;
        }
        setResult("AI request failed");
        return null;
      } catch {
        setResult("AI unavailable");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { run, loading, result };
}
