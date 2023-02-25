import { load } from "cheerio";
import type { PageParserPlugin } from "../types.js";

export const erPageParserPlugin = [
  /https:\/\/playeternalreturn\.com\/posts\/news\/[^/]+$/i,
  (body: string) => {
    const $ = load(body);
    const content = $(".er-article-content").text().trim();
    return {
      content,
    };
  }
] satisfies PageParserPlugin;