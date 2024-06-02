import { eq } from "drizzle-orm";
import { db } from "../db";
import { articles } from "../schema";

export function getArticlesOfSource(sourceId: string) {
  return db.select().from(articles)
    .where(eq(articles.sourceId, sourceId));
}

export function deleteArticlesOfSource(sourceId: string) {
  return db.delete(articles)
    .where(eq(articles.sourceId, sourceId))
    .returning();
}
