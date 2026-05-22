"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

export function HackerNewsList() {
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
