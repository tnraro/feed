import type { SelectArticle, SelectSender, SelectSource } from "../db/types";

export async function sendToEmail(sender: SelectSender, source: SelectSource, articles: SelectArticle[]) {
  throw new Error("Not implemented yet");
  return source.id;
}