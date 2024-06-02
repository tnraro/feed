import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../db/db";
import { articles, senders, sendersToSources, sources } from "../../db/schema";
import { sendTo } from "../../senders";
import { fetchSource } from "../../sources";
import type { InsertArticle, SelectArticle, SelectSource } from "../../db/types";
import { getSource } from "../../db/models/sources";

export async function update(sourceId: string) {
  const source = (await getSource(sourceId))[0];
  if (source == null) throw new Error(`No such source: "${sourceId}"`);

  await insertArticles(await fetchSource(source));

  const updates = await getNotSentArticlesBySourceId(source.id);
  if (updates.length === 0) return [];

  const result = await sendArticles(source, updates);

  for (const sourceId of succeededResultValues(result)) {
    await markAsSent(sourceId, updates);
  }

  return result;

  async function sendArticles(source: SelectSource, articles: SelectArticle[]) {
    return await Promise.allSettled((await senderz(source.id))
      .map(group => group.senders)
      .filter(<T>(sender: T | null | undefined): sender is T => sender != null)
      .map(sender => sendTo(sender, source, articles)));
  }

  async function senderz(sourceId: string) {
    return await db.select().from(sendersToSources)
      .leftJoin(senders, eq(sendersToSources.senderId, senders.id))
      .where(eq(sendersToSources.sourceId, sourceId));
  }

  async function markAsSent(sourceId: string, updates: { sourceId: string | null, id: string }[]) {
    await db.update(articles)
      .set({ isSent: true })
      .where(inArray(articles.id, updates
        .filter(article => article.sourceId === sourceId)
        .map(article => article.id)));
  }

  function succeededResultValues<T>(results: PromiseSettledResult<T>[]) {
    return results
      .filter(<T>(r: PromiseSettledResult<T>): r is PromiseFulfilledResult<T> => r.status === "fulfilled")
      .map(r => r.value);
  }

  async function getNotSentArticlesBySourceId(sourceId: string) {
    return await db.select().from(articles)
      .where(and(eq(articles.sourceId, sourceId), eq(articles.isSent, false)));
  }
  async function insertArticles(items: InsertArticle[], markAsSent = false) {
    if (items.length <= 0) return;

    const values = items.map(item => ({
      ...item,
      isSent: markAsSent,
    }));
    await db.insert(articles).values(values).onConflictDoNothing();
  }
}


