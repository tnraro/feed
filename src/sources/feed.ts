import { parseFeed } from "htmlparser2";
import type { InsertArticle, InsertSource } from "../db/types";

export async function fetchFeed(source: InsertSource) {
  const res = await fetch(source.link);
  if (!res.ok) throw res;
  const body = await res.text();
  return parseFeed(body)?.items
    .map(item => ({
      title: item.title,
      description: item.description,
      link: item.link,
      publishedAt: item.pubDate,
      sourceId: source.id,
    } as InsertArticle))
    .filter((item) => item.link != null) ?? [];
}