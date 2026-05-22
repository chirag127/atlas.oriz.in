import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { articleIds } = await request.json();
    if (!db) return NextResponse.json({ error: "No DB", markdown: "" }, { status: 503 });

    const articles = await db
      .select()
      .from(schema.articles)
      .where(
        articleIds?.length
          ? eq(schema.articles.id, articleIds[0])
          : eq(schema.articles.id, "")
      );

    if (!articles.length) return NextResponse.json({ error: "No articles", markdown: "" });

    const markdown = articles.map((a: { title: string; url: string; content: string | null; publishedAt: Date | null }) =>
      `# ${a.title}\n\n> Source: ${a.url}\n> Published: ${a.publishedAt?.toISOString() ?? "unknown"}\n\n${a.content ?? ""}`
    ).join("\n\n---\n\n");

    return NextResponse.json({ markdown });
  } catch (error) {
    console.error("[Markdown Export] error:", error);
    return NextResponse.json({ error: "Export failed", markdown: "" });
  }
}
