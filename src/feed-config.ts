import type { Model } from "./model";

export class FeedConfig {
  #id: string;
  #model;
  constructor(id: string, model: Model) {
    this.#id = id;
    this.#model = model;
  }
  get model() { return this.#model }
  get id() { return this.#id; }
  get name() { return this.#model.feedConfig(this.#id)?.name }
  get link() { return this.#model.feedConfig(this.#id)?.link }
  get interval() { return this.#model.feedConfig(this.#id)?.interval }
  update(options: Omit<FeedConfigOptions, "model" | "id">) {
    this.#model.setFeedConfig({
      id: this.#id,
      name: options.name,
      link: options.link,
      interval: options.interval,
    });
  }
}

export interface FeedConfigOptions {
  id: string;
  name: string;
  link: string;
  interval: number;
  model: Model;
}
export function createFeedConfig(options: FeedConfigOptions) {
  const config = new FeedConfig(options.id, options.model);
  config.update(options);
  return config;
}