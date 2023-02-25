import type { ListParserPlugin, PageParserPlugin } from "../types.js";
import { bunListParserPlugin } from "./bun.list.js";
import { bunPageParserPlugin } from "./bun.page.js";
import { erListParserPlugin } from "./er.list.js";
import { erPageParserPlugin } from "./er.page.js";
import { nightwalkerListParserPlugin } from "./nightwalker.list.js";
import { nightwalkerPageParserPlugin } from "./nightwalker.page.js";

export const listParserPlugins: ListParserPlugin[] = [
  nightwalkerListParserPlugin,
  bunListParserPlugin,
  erListParserPlugin,
]

export const pageParserPlugins: PageParserPlugin[] = [
  nightwalkerPageParserPlugin,
  bunPageParserPlugin,
  erPageParserPlugin,
];