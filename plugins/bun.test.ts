import { describe, expect, test } from "bun:test";
import { bunListParserPlugin } from "./bun.list.js";
import { bunPageParserPlugin } from "./bun.page.js";

describe("bun:list", () => {
  test("url", () => {
    const [re] = bunListParserPlugin;
    expect(re.test("")).toBe(false);
    expect(re.test("bun.sh")).toBe(false);
    expect(re.test("https://bun.sh")).toBe(false);
    expect(re.test("https://bun.sh/blog")).toBe(true);
    expect(re.test("https://bun.sh/blog/")).toBe(true);
    expect(re.test("https://bun.sh/blog/bun-v0.5.0")).toBe(false);
  });
  test("parser", async () => {
    const [_, parse] = bunListParserPlugin;
    const res = await fetch("https://bun.sh/blog");
    const body = await res.text();
    const parsedBody = parse(body);
    expect(parsedBody).not.toBeFalsy();
    expect(parsedBody.pages).toBeDefined();
    expect(parsedBody.pages[0]).toBeDefined();
    expect(parsedBody.pages[0].summary).toBeDefined();
    expect(parsedBody.pages[0].time).toBeDefined();
    expect(parsedBody.pages[0].title).toBeDefined();
    expect(parsedBody.pages[0].url).toBeDefined();
    expect(parsedBody.next).toBeUndefined();
  });
});

describe("bun:page", () => {
  test("url", () => {
    const [re] = bunPageParserPlugin;
    expect(re.test("")).toBe(false);
    expect(re.test("bun.sh")).toBe(false);
    expect(re.test("https://bun.sh")).toBe(false);
    expect(re.test("https://bun.sh/blog")).toBe(false);
    expect(re.test("https://bun.sh/blog/")).toBe(false);
    expect(re.test("https://bun.sh/blog/bun-v0.5.0")).toBe(true);
  });
  test("parser", async () => {
    const [_, parse] = bunPageParserPlugin;
    const res = await fetch("https://bun.sh/blog/bun-v0.5.0");
    const body = await res.text();
    const parsedBody = parse(body);
    expect(parsedBody).not.toBeFalsy();
    expect(parsedBody.content.slice(100, 150)).toBe("eatures including npm workspaces, Bun.dns, and sup")
  });
})