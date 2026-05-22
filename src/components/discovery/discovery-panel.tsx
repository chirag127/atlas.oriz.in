"use client";

import { useState } from "react";
import { Search, Globe, Loader2 } from "lucide-react";

export function DiscoveryPanel() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Array<{ title: string; url: string; summary?: string }>>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/discovery/explore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data.explore ?? []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="Search topics or keywords..."
          className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={search}
          disabled={loading || !query.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 rounded-lg text-sm text-white transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((r, i) => (
            <a
              key={i}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start gap-3">
                <Globe className="w-4 h-4 text-zinc-500 mt-1 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-100 truncate">{r.title}</p>
                  {r.summary && <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{r.summary}</p>}
                  <p className="text-xs text-zinc-600 mt-1 truncate">{r.url}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
