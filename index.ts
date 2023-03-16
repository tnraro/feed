import { MeiliSearch, MeiliSearchApiError } from "meilisearch";
import { sources } from "./list.js";
import { listParserPlugins, pageParserPlugins } from "./plugins/index.js";
import { PageContext, PageDocument } from "./types.js";
import { resolveAbsoluteUrl, resolvePageId } from "./utils.js";

const client = new MeiliSearch({
  host: "http://127.0.0.1:7700",
  apiKey: Bun.env.API_KEY,
});

await client.health();

const feeds = client.index("feeds");

sources.forEach((source) => {
  const { entrypoint, ...context } = source;
  processPageList(entrypoint, context);
});

export function processPageList(entrypoint: string, context: PageContext) {
  for (const lpp of listParserPlugins) {
    const [re, parse] = lpp;
    if (re.test(entrypoint)) {
      console.log(entrypoint)
      fetchText(entrypoint)
        .then(x => parse(x, entrypoint))
        .then(async x => {
          let enablingNextPage = true;
          for (const page of x.pages) {
            const url = resolveAbsoluteUrl(page.url, entrypoint);
            const id = resolvePageId(url);
            const newContext = {
              id,
              ...context,
              ...page,
              url,
            };
            try {
              const data = await feeds.getDocument(id);
              if (!Object.entries(data)
                .every(([key, value]) => (newContext as any)[key] === value)) {
                processPage(url, newContext);
              }
              enablingNextPage = false;
            } catch (error) {
              if (error instanceof MeiliSearchApiError) {
                if (error.code === "document_not_found") {
                  processPage(url, newContext);
                  enablingNextPage = false;
                } else {
                  console.error(error);
                }
              }
            }
          }
          if (enablingNextPage && x.next != null) {
            const next = resolveAbsoluteUrl(x.next, entrypoint);
            processPageList(next, context);
          }
        })
        .catch(e => console.error(e))
      break;
    }
  }
}
export function processPage(url: string, context: PageContext) {
  for (const ppp of pageParserPlugins) {
    const [re, parse] = ppp;
    if (re.test(url)) {
      fetchText(url)
        .then(x => parse(x, url))
        .then(x => {
          const page = {
            ...context,
            ...x
          }
          if (isPage(page)) {
            feeds.addDocuments([page]);
          } else {
            console.error("ERR:", page)
          }
        })
        .catch(e => console.error(e))
    }
  }
}

function isPage(context: PageContext): context is PageDocument {
  if (typeof context.id !== "string") return false;
  if (typeof context.game !== "string") return false;
  if (typeof context.category !== "string") return false;
  if (typeof context.url !== "string") return false;
  if (typeof context.title !== "string") return false;
  if (typeof context.content !== "string") return false;
  if (typeof context.time !== "number") return false;
  if (!(context.summary == null || typeof context.summary === "string")) return false;
  return true;
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      cookie: "locale=ko_KR",
    },
  });
  if (res.status >= 400) {
    switch (res.status) {
      case 429: {
        return Bun.sleep(1000)
          .then(() => fetchText(url));
      }
      default:
        throw res;
    }
  }
  return res.text();
}