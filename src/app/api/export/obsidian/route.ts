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

    const vaultName = "atlas-reader";
    const markdown = articles.map((a: { title: string; url: string; summary: string | null; content: string | null; publishedAt: Date | null; feedId: string | null }) =>
      `---\ntitle: "${a.title}"\nsource: "${a.url}"\ndate: "${a.publishedAt?.toISOString() ?? ""}"\nfolder: "Inbox"\nfeed_id: "${a.feedId ?? ""}"\n---\n\n# ${a.title}\n\n${a.summary ?? a.content ?? ""}\n\n> Imported from [Atlas](${a.url}) on ${new Date().toISOString().split("T")[0]}`
    ).join("\n\n---\n\n");

    return NextResponse.json({ markdown, vaultName });
  } catch (error) {
    console.error("[Obsidian Export] error:", error);
    return NextResponse.json({ error: "Export failed", markdown: "" });
  }
}
