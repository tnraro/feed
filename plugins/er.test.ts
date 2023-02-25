import { describe, expect, test } from "bun:test";
import { erListParserPlugin } from "./er.list.js";
import { erPageParserPlugin } from "./er.page.js";

describe("er:list", () => {
  test("url", () => {
    const [re] = erListParserPlugin;
    expect(re.test("https://playeternalreturn.com/api/v1/posts/news")).toBe(true);
    expect(re.test("https://playeternalreturn.com/api/v1/posts/news?page=1")).toBe(true);
    expect(re.test("https://playeternalreturn.com/api/v1/posts/news?page=5")).toBe(true);
  });
  test("parser", async () => {
    const [_, parse] = erListParserPlugin;
    const res = await fetch("https://playeternalreturn.com/api/v1/posts/news?page=5", {
      headers: {
        cookie: "locale=ko_KR"
      }
    });
    const body = await res.text();
    const parsedBody = parse(body);
    expect(parsedBody).not.toBeFalsy();
    expect(parsedBody.pages).toBeDefined();
    expect(parsedBody.pages[0]).toBeDefined();
    expect(parsedBody.pages[0].category).toBeDefined();
    expect(parsedBody.pages[0].summary).toBeDefined();
    expect(parsedBody.pages[0].time).toBeDefined();
    expect(parsedBody.pages[0].title).toBeDefined();
    expect(parsedBody.pages[0].url).toBeDefined();
    expect(parsedBody.next).toBeDefined();
  });
});

// describe("er:page", () => {
//   test("url", () => {
//     const [re] = erPageParserPlugin;
//     expect(re.test("")).toBe(false);
//     expect(re.test("bun.sh")).toBe(false);
//     expect(re.test("https://bun.sh")).toBe(false);
//     expect(re.test("https://bun.sh/blog")).toBe(false);
//     expect(re.test("https://bun.sh/blog/")).toBe(false);
//     expect(re.test("https://bun.sh/blog/bun-v0.5.0")).toBe(true);
//   });
//   test("parser", async () => {
//     const [_, parse] = erPageParserPlugin;
//     const res = await fetch("https://bun.sh/blog/bun-v0.5.0");
//     const body = await res.text();
//     const parsedBody = parse(body);
//     expect(parsedBody).not.toBeFalsy();
//     expect(parsedBody.title).toBe("Bun v0.5");
//     expect(parsedBody.time).toStrictEqual(new Date("2023-01-17T15:00:00.000Z"));
//     expect(parsedBody.content.slice(100, 150)).toBe("eatures including npm workspaces, Bun.dns, and sup")
//   });
// })