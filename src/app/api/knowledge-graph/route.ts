import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { knowledgeGraphNodes, knowledgeGraphEdges } from "@/lib/db/schema";

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json({
        nodes: [
          { id: "1", label: "AI", type: "topic", size: 20 },
          { id: "2", label: "Web Dev", type: "topic", size: 16 },
          { id: "3", label: "Privacy", type: "topic", size: 12 },
        ],
        edges: [
          { source: "1", target: "2", weight: 2 },
        ],
      });
    }

    const [nodes, edges] = await Promise.all([
      db.select().from(knowledgeGraphNodes).limit(200),
      db.select().from(knowledgeGraphEdges).limit(500),
    ]);

    return NextResponse.json({ nodes, edges });
  } catch (error) {
    console.error("[API] knowledge-graph error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
