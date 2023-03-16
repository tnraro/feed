import { load } from "cheerio";
import type { PageParserPlugin } from "../types.js";

export const nightwalkerPageParserPlugin = [
  /https:\/\/nightwalker\.nexon\.com\/news\/[^/]+\/detail/i,
  (body: string) => {
    const $ = load(body);
    const time = new Date($(".time").text().trim()).getTime();
    const content = $(".view_contents").text().trim();
    return {
      time,
      content,
    };
  }
]satisfies PageParserPlugin;