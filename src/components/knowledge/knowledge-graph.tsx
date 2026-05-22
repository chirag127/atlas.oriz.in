"use client";

import { useEffect, useState } from "react";
import { Share2, Loader2 } from "lucide-react";
import { computeGraphStats } from "@/lib/gamification/graph";
import type { KnowledgeGraphNode, KnowledgeGraphEdge } from "@/lib/gamification/graph";

export function KnowledgeGraph() {
  const [nodes, setNodes] = useState<KnowledgeGraphNode[]>([]);
  const [edges, setEdges] = useState<KnowledgeGraphEdge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/knowledge-graph")
      .then((r) => r.json())
      .then((data) => {
        setNodes(data.nodes ?? []);
        setEdges(data.edges ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
      </div>
    );
  }

  const stats = computeGraphStats(nodes, edges);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-center">
          <p className="text-2xl font-bold text-white">{stats.topicCount}</p>
          <p className="text-xs text-zinc-500 mt-1">Topics</p>
        </div>
        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-center">
          <p className="text-2xl font-bold text-white">{stats.connectionCount}</p>
          <p className="text-xs text-zinc-500 mt-1">Connections</p>
        </div>
        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-center">
          <p className="text-2xl font-bold text-white">{stats.score}</p>
          <p className="text-xs text-zinc-500 mt-1">Score</p>
        </div>
      </div>

      {nodes.length === 0 ? (
        <div className="text-center py-12">
          <Share2 className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
          <p className="text-sm text-zinc-500">No topics yet. Start reading to build your knowledge graph.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Topics</p>
          <div className="flex flex-wrap gap-2">
            {nodes.filter((n) => n.type === "topic").map((node) => (
              <span
                key={node.id}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-300"
                style={{ opacity: 0.5 + node.weight * 0.5 }}
              >
                {node.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
