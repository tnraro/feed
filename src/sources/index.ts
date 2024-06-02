import type { InsertArticle, InsertSource } from "../db/types";
import { fetchFeed } from "./feed";

export async function fetchSource(source: InsertSource): Promise<InsertArticle[]> {
  switch (source.type) {
    case "feed": return await fetchFeed(source);
  }
  throw new Error(`Unsupported source type: "${source.type}"`);
}
