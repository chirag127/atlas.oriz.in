import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";

export async function POST(request: NextRequest) {
  try {
    const { source, data, format } = await request.json();

    if (!source || !data) {
      return NextResponse.json({ error: "source and data required" }, { status: 400 });
    }

    if (!db) return NextResponse.json({ error: "No DB" }, { status: 503 });

    let imported = 0;

    if (format === "opml") {
      const urlRegex = /xmlUrl=["']([^"']+)["']/gi;
      const titleRegex = /title=["']([^"']*)["']/gi;
      const urls: string[] = [];
      const titles: string[] = [];
      let m: RegExpExecArray | null;

      while ((m = urlRegex.exec(data)) !== null) urls.push(m[1]);
      while ((m = titleRegex.exec(data)) !== null) titles.push(m[1]);

      for (let i = 0; i < urls.length; i++) {
        try {
          await db.insert(schema.feeds).values({
            url: urls[i],
            title: titles[i] ?? "Imported Feed",
          }).onConflictDoNothing({ target: schema.feeds.url });
          imported++;
        } catch {
          // skip
        }
      }
    }

    if (format === "pocket" || source === "pocket") {
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        if (!item.url) continue;
        try {
          await db.insert(schema.articles).values({
            title: item.title ?? item.resolved_title ?? "Untitled",
            url: item.url,
            summary: item.excerpt ?? null,
          }).onConflictDoNothing({ target: schema.articles.url });
          imported++;
        } catch {
          // skip
        }
      }
    }

    return NextResponse.json({ imported, message: `Imported ${imported} items from ${source}` });
  } catch (error) {
    console.error("[Import] error:", error);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
