import { test, describe, expect } from "bun:test";
import { Database } from "bun:sqlite";
import { Model } from "./model";

describe("FeedConfig", () => {
  test("init", () => {
    using db = new Database();
    using model = new Model(db);
    model.init();

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
    using db = new Database();
    using model = new Model(db);
    model.init();

    model.setFeedConfig({ id: "id", name: "name", link: "link", interval: 53, });
    model.setFeedConfig({ id: "id", name: "renamed", link: "link 2", interval: 64, });

    expect(model.feedConfigs()).toStrictEqual([
      { id: "id", name: "renamed", link: "link 2", interval: 64 },
    ]);
  })

  test("deny same link", () => {
    using db = new Database();
    using model = new Model(db);
    model.init();

    model.setFeedConfig({ id: "id", name: "name", link: "link", interval: 53, });

    expect(() => {
      model.setFeedConfig({ id: "id2", name: "renamed", link: "link", interval: 64, });
    }).toThrowError("UNIQUE constraint failed: FeedConfig.link")
  });
});


describe("Feed", () => {
  test("init", () => {
    using db = new Database();
    using model = new Model(db);
    model.init();

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
    using db = new Database();
    using model = new Model(db);
    model.init();

    model.setFeed({ id: "id", title: "name", link: "link", description: "123" });
    model.setFeed({ id: "id2", title: "renamed", link: "link 2", createdAt: new Date(0) });

    expect(model.feeds()).toStrictEqual([
      { id: "id", title: "name", link: "link", description: "123", createdAt: null, },
      { id: "id2", title: "renamed", link: "link 2", description: null, createdAt: new Date(0).toISOString() },
    ]);
  })
});
