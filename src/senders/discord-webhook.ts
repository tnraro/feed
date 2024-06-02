
import TurndownService from "turndown";
import type { SelectArticle, SelectSource } from "../db/types";

export async function sendToDiscordWebhook(sender: { to: string }, source: SelectSource, articles: SelectArticle[]) {
  const ts = new TurndownService();
  const res = await fetch(sender.to, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: "",
      username: source.name,
      embeds: articles.slice(0, 10).map(article => ({
        title: article.title,
        description: ts.turndown(article.description?.replaceAll(/<style.+?<\/style>|<script.+?<\/script>/gs, "").trim() ?? "").slice(0, 500),
        url: article.link,
      }))
    })
  });
  if (!res.ok) throw new Error(await res.text());
  return source.id;
}