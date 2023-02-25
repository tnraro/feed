import { load } from "cheerio";
import type { PageParserPlugin } from "../types.js";

export const bunPageParserPlugin = [
  /https:\/\/bun\.sh\/blog\/[^/]+$/i,
  (body: string) => {
    const $ = load(body);
    const content = $("article").text().trim();
    return {
      content,
    };
  }
]satisfies PageParserPlugin;