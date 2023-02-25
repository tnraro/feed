import { load } from "cheerio";
import type { ListParserPlugin } from "../types.js";

export const nightwalkerListParserPlugin = [
  /^https:\/\/nightwalker\.nexon\.com\/news\/[^/]+\/list/i,
  (body) => {
    const $ = load(body);
    const pages = $(".board_list a").map((_, x) => {
      return {
        url: x.attribs.href,
        title: $(x)
          .contents()
          .filter((_, x) => x.nodeType === 3)
          .text()
          .trim()
      }
    }).get();
    const next = $(".paging a.on").next().attr("href");
    return { pages, next };
  }
]satisfies ListParserPlugin;

