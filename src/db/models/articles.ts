import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { articles } from "../schema";
import type { InsertArticle } from "../types";

export function getArticlesOfSource(sourceId: string) {
  return db.select().from(articles)
    .where(eq(articles.sourceId, sourceId));
}

export function getNotSentArticlesOfSource(sourceId: string) {
  return db.select().from(articles)
    .where(and(eq(articles.sourceId, sourceId), eq(articles.isSent, false)));
}

export function deleteArticlesOfSource(sourceId: string) {
  return db.delete(articles)
    .where(eq(articles.sourceId, sourceId))
    .returning();
}

export function addArticles(articlez: InsertArticle[]) {
  return db.insert(articles)
    .values(articlez)
    .onConflictDoNothing()
    .returning();
}