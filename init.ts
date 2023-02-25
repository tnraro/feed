import { mkdir } from "fs/promises";
import { MeiliSearch } from "meilisearch";

const client = new MeiliSearch({
  host: "http://localhost:7700",
  apiKey: Bun.env.MEILI_MASTER_KEY,
});

await client.health();

const feeds = client.index("feeds");
feeds.updateSettings({
  searchableAttributes: ["content", "summary", "title", "game", "category"],
  filterableAttributes: ["game", "category"],
  sortableAttributes: ["time"],
});

const template = await Bun.file("index.template.html").text();
const substitutedText = template.replaceAll(/{{([^}]+)}}/g, (_, p1) => Bun.env[p1] ?? `{{${p1}}}`);

await mkdir("public", { recursive: true });
await Bun.write("public/index.html", substitutedText);