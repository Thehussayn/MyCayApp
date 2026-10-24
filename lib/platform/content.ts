import { getDb } from "@/lib/db";
export interface ArticleRecord {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  status: string;
  updatedAt: string;
}
export function publishedArticles(): ArticleRecord[] {
  return ((getDb() as any).articles || []).filter(
    (a: ArticleRecord) => a.status === "PUBLISHED",
  );
}
