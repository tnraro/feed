import { describe, expect, test } from "bun:test";
import { nightwalkerListParserPlugin } from "./nightwalker.list.js";
import { nightwalkerPageParserPlugin } from "./nightwalker.page.js";

describe("nightwalker:list", () => {
  test("url", () => {
    const [re] = nightwalkerListParserPlugin;
    expect(re.test("")).toBe(false);
    expect(re.test("nightwalker.nexon.com")).toBe(false);
    expect(re.test("https://nightwalker.nexon.com/")).toBe(false);
    expect(re.test("https://nightwalker.nexon.com/news/notice/list")).toBe(true);
    expect(re.test("https://nightwalker.nexon.com/news/update/list")).toBe(true);
    expect(re.test("https://nightwalker.nexon.com/news/devnote/list")).toBe(true);
    expect(re.test("https://nightwalker.nexon.com/news/devnote/Detail")).toBe(false);
  });
  test("parser", async () => {
    const [_, parse] = nightwalkerListParserPlugin;
    const res = await fetch("https://nightwalker.nexon.com/news/devnote/list");
    const body = await res.text();
    const parsedBody = parse(body);
    expect(parsedBody).toBeDefined();
    expect(parsedBody.pages).toBeDefined();
    expect(parsedBody.pages[0]).toBeDefined();
    expect(parsedBody.pages[0].title).toBeDefined();
    expect(parsedBody.pages[0].url).toBeDefined();
  });
});

describe("nightwalker:page", () => {
  test("url", () => {
    const [re] = nightwalkerPageParserPlugin;
    expect(re.test("")).toBe(false);
    expect(re.test("nightwalker.nexon.com")).toBe(false);
    expect(re.test("https://nightwalker.nexon.com/")).toBe(false);
    expect(re.test("https://nightwalker.nexon.com/news/notice/list")).toBe(false);
    expect(re.test("https://nightwalker.nexon.com/news/update/list")).toBe(false);
    expect(re.test("https://nightwalker.nexon.com/news/devnote/list")).toBe(false);
    expect(re.test("https://nightwalker.nexon.com/news/devnote/Detail")).toBe(true);
    expect(re.test("https://nightwalker.nexon.com/news/devnote/Detail?page=1")).toBe(true);
  });
  test("parser", async () => {
    const [_, parse] = nightwalkerPageParserPlugin;
    const res = await fetch("https://nightwalker.nexon.com/news/devnote/Detail?page=1&articlesn=2");
    const body = await res.text();
    const parsedBody = parse(body);
    expect(parsedBody.time).toBe("2023-02-02T01:16:00.000Z");
    expect(parsedBody.content.slice(100, 150)).toBe(snapshots[0]);
  });
});

const snapshots = {
  0: "에 잠을 이루지 못했는데요.막상 오픈을 하고 나니 하루하루가 순식간에 지나가는 것 같습니다"
};