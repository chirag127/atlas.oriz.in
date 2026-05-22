import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ArticleDetail from "./article-detail";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (!db) return { title: "Article" };
  const article = await db.select().from(schema.articles).where(eq(schema.articles.id, id)).limit(1);
  if (!article[0]) return { title: "Article Not Found" };
  return { title: article[0].title, description: article[0].summary ?? undefined };
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  if (!db) return <div className="text-center py-12 text-red-500">Database unavailable</div>;

  const article = await db.select().from(schema.articles).where(eq(schema.articles.id, id)).limit(1);
  if (!article[0]) notFound();

  let feedTitle = "Unknown";
  if (article[0].feedId) {
    const feed = await db.select().from(schema.feeds).where(eq(schema.feeds.id, article[0].feedId)).limit(1);
    if (feed[0]) feedTitle = feed[0].title ?? feedTitle;
  }

  const a = article[0];
  const serialized = {
    ...a,
    publishedAt: a.publishedAt?.toISOString() ?? new Date().toISOString(),
    createdAt: a.createdAt.toISOString(),
  };
  return <ArticleDetail article={serialized} feedTitle={feedTitle} />;
}
