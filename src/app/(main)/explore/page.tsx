"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Github, Zap, Globe, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArticleList } from "@/components/feed/article-list";
import type { Article } from "@/stores/feed-store";

interface TrendingTopic {
  name: string;
  count: number;
  change: number;
}

interface DiscoveryResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<"trending" | "hn" | "github" | "discover">("trending");
  const [trending, setTrending] = useState<TrendingTopic[]>([]);
  const [discovery, setDiscovery] = useState<DiscoveryResult[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: "trending" as const, label: "Trending", icon: TrendingUp },
    { id: "hn" as const, label: "Hacker News", icon: Zap },
    { id: "github" as const, label: "GitHub", icon: Github },
    { id: "discover" as const, label: "Discover", icon: Globe },
  ];

  const fetchDiscovery = async (query: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/discovery?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setDiscovery(data.results ?? []);
      }
    } catch (e) {
      console.error("Discovery failed:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "discover" && searchQuery) {
      fetchDiscovery(searchQuery);
    }
  }, [activeTab, searchQuery]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Explore</h1>

      <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-ui whitespace-nowrap transition-colors ${
              activeTab === id
                ? "bg-atlas-accent-emerald/10 text-atlas-accent-emerald border border-atlas-accent-emerald/30"
                : "text-atlas-text-secondary hover:text-atlas-text-primary hover:bg-atlas-bg-secondary"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "trending" && (
        <div className="space-y-3">
          <p className="text-sm text-atlas-text-secondary font-ui">
            Trending topics based on your reading patterns and global activity.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {["AI Agents", "Rust", "Local-First", "Edge Computing", "WebAssembly", "Privacy"].map(
              (topic) => (
                <Card key={topic} hover className="p-4">
                  <div className="font-ui font-medium text-sm">{topic}</div>
                  <div className="text-xs text-atlas-accent-emerald mt-1">Trending ↑</div>
                </Card>
              )
            )}
          </div>
        </div>
      )}

      {activeTab === "hn" && (
        <div className="space-y-3">
          <p className="text-sm text-atlas-text-secondary font-ui">
            Top stories from Hacker News, refreshed every 30 minutes.
          </p>
          <HackerNewsList />
        </div>
      )}

      {activeTab === "github" && (
        <div className="space-y-3">
          <p className="text-sm text-atlas-text-secondary font-ui">
            Trending repositories on GitHub this week.
          </p>
          <GitHubTrending />
        </div>
      )}

      {activeTab === "discover" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-atlas-text-muted" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search the web for articles..."
                className="w-full pl-9 pr-3 py-2 bg-atlas-bg-tertiary border border-atlas-border rounded-lg text-sm text-atlas-text-primary placeholder:text-atlas-text-muted focus:outline-none focus:border-atlas-accent-emerald"
              />
            </div>
            <Button onClick={() => fetchDiscovery(searchQuery)} disabled={loading || !searchQuery.trim()}>
              Search
            </Button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="skeleton h-4 w-3/4 mb-2" />
                  <div className="skeleton h-3 w-full" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {discovery.map((result, i) => (
                <Card key={i} hover className="p-4">
                  <a href={result.url} target="_blank" rel="noopener noreferrer">
                    <div className="text-xs text-atlas-text-muted font-ui mb-1">
                      {new URL(result.url).hostname}
                    </div>
                    <h3 className="font-display text-sm font-bold mb-1 hover:text-atlas-accent-emerald transition-colors">
                      {result.title}
                    </h3>
                    <p className="text-xs text-atlas-text-secondary line-clamp-2">
                      {result.snippet}
                    </p>
                  </a>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function HackerNewsList() {
  const [stories, setStories] = useState<Array<{ title: string; url: string; score: number; comments: number }>>([]);

  useEffect(() => {
    fetch("https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=15")
      .then((r) => r.json())
      .then((data) => {
        setStories(
          (data.hits ?? []).map((h: { title: string; url?: string; objectID?: string; points: number; num_comments: number }) => ({
            title: h.title,
            url: h.url ?? `https://news.ycombinator.com/item?id=${h.objectID ?? ""}`,
            score: h.points,
            comments: h.num_comments,
          }))
        );
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-2">
      {stories.map((story, i) => (
        <Card key={i} hover className="p-3">
          <a href={story.url} target="_blank" rel="noopener noreferrer">
            <div className="flex items-start gap-3">
              <span className="text-xs text-atlas-text-muted font-mono w-6 text-right shrink-0">
                {i + 1}
              </span>
              <div>
                <h3 className="text-sm font-ui font-medium hover:text-atlas-accent-emerald transition-colors">
                  {story.title}
                </h3>
                <div className="text-xs text-atlas-text-muted mt-1">
                  ▲ {story.score} · {story.comments} comments
                </div>
              </div>
            </div>
          </a>
        </Card>
      ))}
    </div>
  );
}

function GitHubTrending() {
  const [repos, setRepos] = useState<Array<{ name: string; description: string; stars: number; language: string; url: string }>>([]);

  useEffect(() => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    fetch(`https://api.github.com/search/repositories?q=created:>${weekAgo}+stars:>100&sort=stars&order=desc&per_page=15`)
      .then((r) => r.json())
      .then((data) => {
        setRepos(
          (data.items ?? []).map((r: { full_name: string; description?: string; stargazers_count: number; language?: string; html_url: string }) => ({
            name: r.full_name,
            description: r.description ?? "",
            stars: r.stargazers_count,
            language: r.language ?? "",
            url: r.html_url,
          }))
        );
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-2">
      {repos.map((repo, i) => (
        <Card key={i} hover className="p-3">
          <a href={repo.url} target="_blank" rel="noopener noreferrer">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-ui font-medium text-atlas-accent-sky">
                  {repo.name}
                </h3>
                <p className="text-xs text-atlas-text-secondary mt-1 line-clamp-2">
                  {repo.description}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-atlas-text-muted">
                  {repo.language && <span>{repo.language}</span>}
                  <span>⭐ {repo.stars.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </a>
        </Card>
      ))}
    </div>
  );
}
