export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type: "topic" | "article" | "tag";
  weight: number;
}

export interface KnowledgeGraphEdge {
  source: string;
  target: string;
  weight: number;
  type: string;
}

export function computeGraphStats(
  nodes: KnowledgeGraphNode[],
  edges: KnowledgeGraphEdge[]
) {
  const topicCount = nodes.filter((n) => n.type === "topic").length;
  const connectionCount = edges.length;
  const density = nodes.length > 1
    ? (2 * connectionCount) / (nodes.length * (nodes.length - 1))
    : 0;

  return {
    topicCount,
    connectionCount,
    density: Math.round(density * 100) / 100,
    score: Math.round(Math.min(100, topicCount * 5 + connectionCount * 2)),
  };
}
