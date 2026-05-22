"use client";

import { useState } from "react";
import { Lightbulb, ListChecks, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Article } from "@/stores/feed-store";

interface AIPanelProps {
  article: Article;
}

type AITab = "tldr" | "insights" | "eli5" | "chat";

export function AIPanel({ article }: AIPanelProps) {
  const [activeTab, setActiveTab] = useState<AITab>("tldr");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [chatInput, setChatInput] = useState("");

  const tabs = [
    { id: "tldr" as const, label: "TL;DR", icon: Sparkles },
    { id: "insights" as const, label: "Insights", icon: Lightbulb },
    { id: "eli5" as const, label: "ELI5", icon: ListChecks },
    { id: "chat" as const, label: "Chat", icon: MessageSquare },
  ];

  const runAI = async (task: string, extraPrompt?: string) => {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task,
          title: article.title,
          content: article.content ?? article.summary ?? "",
          url: article.url,
          ...(extraPrompt && { question: extraPrompt }),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data.content ?? "No result");
      } else {
        setResult("AI request failed. Try configuring a provider in Settings.");
      }
    } catch {
      setResult("AI unavailable. Configure a provider in Settings → AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-atlas-bg-secondary border border-atlas-border rounded-xl p-4">
      <div className="flex gap-1 mb-4 overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setActiveTab(id);
              setResult("");
              if (id !== "chat") runAI(id);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-ui whitespace-nowrap transition-colors ${
              activeTab === id
                ? "bg-atlas-accent-emerald/10 text-atlas-accent-emerald"
                : "text-atlas-text-secondary hover:text-atlas-text-primary"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "chat" ? (
        <div className="space-y-3">
          {result && (
            <div className="p-3 bg-atlas-bg-tertiary rounded-lg text-sm text-atlas-text-primary whitespace-pre-wrap">
              {result}
            </div>
          )}
          <div className="flex gap-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && chatInput.trim()) {
                  runAI("chat", chatInput);
                  setChatInput("");
                }
              }}
              placeholder="Ask about this article..."
              className="flex-1 px-3 py-2 bg-atlas-bg-tertiary border border-atlas-border rounded-lg text-sm text-atlas-text-primary placeholder:text-atlas-text-muted focus:outline-none focus:border-atlas-accent-emerald"
            />
            <Button
              size="sm"
              onClick={() => {
                if (chatInput.trim()) {
                  runAI("chat", chatInput);
                  setChatInput("");
                }
              }}
              disabled={loading || !chatInput.trim()}
            >
              Ask
            </Button>
          </div>
        </div>
      ) : (
        <div>
          {loading ? (
            <div className="space-y-2">
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-4 w-5/6" />
            </div>
          ) : result ? (
            <div className="text-sm text-atlas-text-primary whitespace-pre-wrap leading-relaxed">
              {result}
            </div>
          ) : (
            <div className="text-center py-4">
              <Button size="sm" onClick={() => runAI(activeTab)}>
                Generate {activeTab.toUpperCase()}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
