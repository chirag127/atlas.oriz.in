"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

export function GitHubTrending() {
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
