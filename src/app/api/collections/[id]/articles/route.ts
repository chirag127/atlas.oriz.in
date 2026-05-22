import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!db) return NextResponse.json({ error: "No DB" }, { status: 503 });
  const items = await db
    .select({ article: schema.articles })
    .from(schema.articles)
    .innerJoin(schema.collectionArticles, eq(schema.articles.id, schema.collectionArticles.articleId))
    .where(eq(schema.collectionArticles.collectionId, id));
  return NextResponse.json(items.map((i) => i.article));
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { articleIds } = await request.json();
  if (!db) return NextResponse.json({ error: "No DB" }, { status: 503 });

  const values = (articleIds as string[]).map((articleId: string) => ({
    collectionId: id,
    articleId,
  }));

  await db.insert(schema.collectionArticles).values(values).onConflictDoNothing();
  return NextResponse.json({ added: values.length });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { articleIds } = await request.json();
  if (!db) return NextResponse.json({ error: "No DB" }, { status: 503 });

  for (const articleId of articleIds as string[]) {
    await db
      .delete(schema.collectionArticles)
      .where(
        eq(schema.collectionArticles.collectionId, id) &&
        eq(schema.collectionArticles.articleId, articleId)
      );
  }
  return NextResponse.json({ removed: articleIds.length });
}
