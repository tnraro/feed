import { test, describe, expect, beforeEach, afterEach } from "bun:test";
import { Database } from "bun:sqlite";
import { Model } from "./model";
import { createFeedConfig } from "./feed-config";

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
    const config = createFeedConfig({
      id: "id",
      name: "name",
      link: "link",
      interval: 53,
      model,
    });

    expect(config.id).toBe("id");
    expect(config.name).toBe("name");
    expect(config.link).toBe("link");
    expect(config.interval).toBe(53);
  });

  test("update", () => {
    const config = createFeedConfig({
      id: "id",
      name: "name",
      link: "link",
      interval: 53,
      model,
    });
    config.update({
      name: "name2",
      link: "link2",
      interval: 64,
    });
    expect(config.id).toBe("id");
    expect(config.name).toBe("name2");
    expect(config.link).toBe("link2");
    expect(config.interval).toBe(64);
  })
});