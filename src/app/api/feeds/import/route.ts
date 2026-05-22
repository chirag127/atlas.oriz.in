import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const text = await file.text();

    if (!db) return NextResponse.json({ error: "No DB" }, { status: 503 });

    const urlRegex = /xmlUrl=["']([^"']+)["']/gi;
    const titleRegex = /title=["']([^"']*)["']/gi;
    const urls: string[] = [];
    const titles: string[] = [];

    let m;
    while ((m = urlRegex.exec(text)) !== null) urls.push(m[1]);
    while ((m = titleRegex.exec(text)) !== null) titles.push(m[1]);

    let imported = 0;
    for (let i = 0; i < urls.length; i++) {
      try {
        await db.insert(schema.feeds).values({
          url: urls[i],
          title: titles[i] ?? "Imported Feed",
        }).onConflictDoNothing({ target: schema.feeds.url });
        imported++;
      } catch {
        // skip duplicates
      }
    }

    return NextResponse.json({ imported, total: urls.length });
  } catch (error) {
    console.error("[Import OPML] error:", error);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
