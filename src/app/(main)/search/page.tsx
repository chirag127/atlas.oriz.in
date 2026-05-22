"use client";

import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { ArticleList } from "@/components/feed/article-list";
import type { Article } from "@/stores/feed-store";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results ?? []);
      }
    } catch (e) {
      console.error("Search failed:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div>
      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-atlas-text-muted" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            handleSearch(e.target.value);
          }}
          placeholder="Search articles, notes, highlights..."
          className="w-full pl-10 pr-10 py-3 bg-atlas-bg-secondary border border-atlas-border rounded-xl text-atlas-text-primary placeholder:text-atlas-text-muted focus:outline-none focus:border-atlas-accent-emerald font-ui"
          autoFocus
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setResults([]); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-atlas-text-muted hover:text-atlas-text-primary"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <ArticleList
        articles={results}
        isLoading={loading}
        emptyMessage={query.length < 2 ? "Type to search..." : `No results for "${query}"`}
      />
    </div>
  );
}
