"use client";

import { useState, useEffect, useRef } from "react";

interface GraphNode {
  id: string;
  label: string;
  type: string;
  size: number;
  x?: number;
  y?: number;
}

interface GraphEdge {
  source: string;
  target: string;
  weight: number;
}

export default function KnowledgeGraphPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    // Demo graph data
    const demoNodes: GraphNode[] = [
      { id: "1", label: "AI", type: "topic", size: 20 },
      { id: "2", label: "Machine Learning", type: "topic", size: 16 },
      { id: "3", label: "Next.js", type: "topic", size: 14 },
      { id: "4", label: "TypeScript", type: "topic", size: 12 },
      { id: "5", label: "Privacy", type: "topic", size: 10 },
      { id: "6", label: "Finance", type: "topic", size: 10 },
      { id: "7", label: "Open Source", type: "topic", size: 8 },
      { id: "8", label: "PWA", type: "topic", size: 8 },
    ];
    const demoEdges: GraphEdge[] = [
      { source: "1", target: "2", weight: 3 },
      { source: "1", target: "3", weight: 2 },
      { source: "3", target: "4", weight: 3 },
      { source: "3", target: "8", weight: 2 },
      { source: "5", target: "7", weight: 1 },
      { source: "1", target: "7", weight: 2 },
    ];

    setNodes(demoNodes);
    setEdges(demoEdges);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Simple force-directed layout
    const positions = new Map<string, { x: number; y: number }>();
    nodes.forEach((node, i) => {
      const angle = (i / nodes.length) * Math.PI * 2;
      const radius = 150;
      positions.set(node.id, {
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
      });
    });

    // Draw
    ctx.clearRect(0, 0, width, height);

    // Draw edges
    ctx.strokeStyle = "hsla(220, 16%, 18%, 0.5)";
    ctx.lineWidth = 1;
    edges.forEach((edge) => {
      const from = positions.get(edge.source);
      const to = positions.get(edge.target);
      if (from && to) {
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach((node) => {
      const pos = positions.get(node.id);
      if (!pos) return;

      const isSelected = selectedNode === node.id;

      // Glow
      if (isSelected) {
        ctx.shadowColor = "hsl(165, 80%, 45%)";
        ctx.shadowBlur = 20;
      }

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, node.size, 0, Math.PI * 2);
      ctx.fillStyle = isSelected
        ? "hsl(165, 80%, 45%)"
        : node.type === "topic"
        ? "hsl(200, 80%, 55%)"
        : "hsl(35, 95%, 55%)";
      ctx.fill();

      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      // Label
      ctx.fillStyle = "hsl(210, 20%, 92%)";
      ctx.font = "11px 'DM Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(node.label, pos.x, pos.y + node.size + 14);
    });
  }, [nodes, edges, selectedNode]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (const node of nodes) {
      const angle = (nodes.indexOf(node) / nodes.length) * Math.PI * 2;
      const radius = 150;
      const nx = canvas.width / 2 + Math.cos(angle) * radius;
      const ny = canvas.height / 2 + Math.sin(angle) * radius;

      const dist = Math.sqrt((x - nx) ** 2 + (y - ny) ** 2);
      if (dist < node.size + 5) {
        setSelectedNode(node.id === selectedNode ? null : node.id);
        return;
      }
    }
    setSelectedNode(null);
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-2">Knowledge Graph</h1>
      <p className="text-sm text-atlas-text-secondary mb-6">
        Visual representation of your reading topics and their connections.
      </p>

      <div className="bg-atlas-bg-secondary border border-atlas-border rounded-xl p-4 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="w-full cursor-pointer"
          onClick={handleCanvasClick}
        />
      </div>

      {selectedNode && (
        <div className="mt-4 p-4 bg-atlas-bg-secondary border border-atlas-border rounded-xl">
          <div className="font-ui font-medium text-sm">
            {nodes.find((n) => n.id === selectedNode)?.label}
          </div>
          <div className="text-xs text-atlas-text-muted mt-1">
            Connected to{" "}
            {edges
              .filter((e) => e.source === selectedNode || e.target === selectedNode)
              .map((e) => {
                const otherId = e.source === selectedNode ? e.target : e.source;
                return nodes.find((n) => n.id === otherId)?.label;
              })
              .filter(Boolean)
              .join(", ") || "no topics"}
          </div>
        </div>
      )}
    </div>
  );
}
