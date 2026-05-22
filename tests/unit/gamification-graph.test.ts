import { describe, it, expect } from "vitest";
import { computeGraphStats } from "@/lib/gamification/graph";
import type { KnowledgeGraphNode, KnowledgeGraphEdge } from "@/lib/gamification/graph";

describe("computeGraphStats", () => {
  it("returns zero stats for empty graph", () => {
    const stats = computeGraphStats([], []);
    expect(stats.topicCount).toBe(0);
    expect(stats.connectionCount).toBe(0);
    expect(stats.density).toBe(0);
    expect(stats.score).toBe(0);
  });

  it("returns correct stats for a graph with nodes and edges", () => {
    const nodes: KnowledgeGraphNode[] = [
      { id: "t1", label: "AI", type: "topic", weight: 1 },
      { id: "t2", label: "ML", type: "topic", weight: 0.8 },
      { id: "t3", label: "Robotics", type: "topic", weight: 0.6 },
      { id: "a1", label: "Article 1", type: "article", weight: 0.5 },
    ];
    const edges: KnowledgeGraphEdge[] = [
      { source: "t1", target: "t2", weight: 1, type: "related" },
      { source: "t1", target: "a1", weight: 1, type: "mentions" },
      { source: "t2", target: "t3", weight: 0.5, type: "related" },
    ];

    const stats = computeGraphStats(nodes, edges);
    expect(stats.topicCount).toBe(3);
    expect(stats.connectionCount).toBe(3);
    expect(stats.density).toBeGreaterThan(0);
    expect(stats.score).toBeGreaterThan(0);
  });

  it("score is capped at 100", () => {
    const nodes: KnowledgeGraphNode[] = Array.from({ length: 20 }, (_, i) => ({
      id: `t${i}`,
      label: `Topic ${i}`,
      type: "topic" as const,
      weight: 1,
    }));
    const edges: KnowledgeGraphEdge[] = Array.from({ length: 30 }, (_, i) => ({
      source: `t${i % 20}`,
      target: `t${(i + 1) % 20}`,
      weight: 1,
      type: "related",
    }));

    const stats = computeGraphStats(nodes, edges);
    expect(stats.score).toBeLessThanOrEqual(100);
  });
});
