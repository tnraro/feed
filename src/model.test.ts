import { test, describe, expect, beforeEach, afterEach } from "bun:test";
import { Database } from "bun:sqlite";
import { Model } from "./model";

let model: Model;
beforeEach(() => {
  const db = new Database();
  model = new Model(db);
  model.init();
});
afterEach(() => {
  model[Symbol.dispose]();
});

describe("FeedConfig", () => {
  test("init", () => {
    model.setFeedConfig({
      id: "id",
      name: "name",
      link: "link",
      interval: 53,
    });

    expect(model.feedConfigs()).toStrictEqual([
      { id: "id", name: "name", link: "link", interval: 53 },
    ]);
  });

  test("update", () => {
    model.setFeedConfig({ id: "id", name: "name", link: "link", interval: 53, });
    model.setFeedConfig({ id: "id", name: "renamed", link: "link 2", interval: 64, });

    expect(model.feedConfigs()).toStrictEqual([
      { id: "id", name: "renamed", link: "link 2", interval: 64 },
    ]);
  })

  test("deny same link", () => {
    model.setFeedConfig({ id: "id", name: "name", link: "link", interval: 53, });

    expect(() => {
      model.setFeedConfig({ id: "id2", name: "renamed", link: "link", interval: 64, });
    }).toThrowError("UNIQUE constraint failed: FeedConfig.link")
  });
});


describe("Feed", () => {
  test("init", () => {
    model.setFeed({
      id: "id",
      title: "title",
      link: "link",
    });

    expect(model.feeds()).toStrictEqual([
      { id: "id", title: "title", link: "link", createdAt: null, description: null },
    ]);
  });

  test("insertion", () => {
    model.setFeed({ id: "id", title: "name", link: "link", description: "123" });
    model.setFeed({ id: "id2", title: "renamed", link: "link 2", createdAt: new Date(0) });

    expect(model.feeds()).toStrictEqual([
      { id: "id", title: "name", link: "link", description: "123", createdAt: null, },
      { id: "id2", title: "renamed", link: "link 2", description: null, createdAt: new Date(0).toISOString() },
    ]);
  })
});
