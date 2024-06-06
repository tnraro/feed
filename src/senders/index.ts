import type { SelectArticle, SelectSender, SelectSource } from "../db/types";
import { sendToDiscordWebhook } from "./discord-webhook";
import { sendToEmail } from "./email";

export async function sendTo(sender: SelectSender, source: SelectSource, articles: SelectArticle[]) {
  switch (sender.type) {
    case "discord-webhook": return await sendToDiscordWebhook(sender, source, articles);
    case "email": return await sendToEmail(sender, source, articles);
  }
  throw new Error(`Unsupported sender type: "${sender.type}"`);
}