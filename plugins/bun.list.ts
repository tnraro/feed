import { load } from "cheerio";
import type { ListParserPlugin } from "../types.js";

export const bunListParserPlugin = [
  /^https:\/\/bun\.sh\/blog\/?$/i,
  (body) => {
    const $ = load(body);
    const pages = $("a.BlogCard")
      .map((_, x) => {
        return {
          url: x.attribs.href,
          title: $(x).find("div.text-2xl").text().trim(),
          time: new Date($(x).find("span.text-gray-600:nth-child(2)").text().trim()).getTime(),
          summary: $(x).find("p.text-lg").text().trim(),
        }
      })
      .get();
    const next = undefined;
    return { pages, next };
  }
]satisfies ListParserPlugin;