import type { ListParserPlugin, PageDocument } from "../types.js";

export const erListParserPlugin = [
  /^https:\/\/playeternalreturn\.com\/api\/v1\/posts\/news/i,
  (body) => {
    const data = JSON.parse(body);
    const categoryIdToNameMap = new Map<string, string>(data.board.categories.map((x: any) => [
      x.id,
      x.i18ns.ko_KR.name,
    ]));
    const next = data.current_page + 1 > data.total_page
      ? undefined
      : `news?page=${data.current_page + 1}`;
    return {
      pages: data.articles
        .filter((x: any) => !x.i18ns.ko_KR.is_hidden)
        .map((x: any) => ({
          url: x.url,
          title: x.i18ns.ko_KR.title.trim(),
          category: categoryIdToNameMap.get(x.category_id)!,
          time: x.created_at,
          summary: x.i18ns.ko_KR.summary.trim(),
        })) as Pick<PageDocument, "url" | "title" | "category" | "time" | "summary">[],
      next
    };
  }
]satisfies ListParserPlugin;