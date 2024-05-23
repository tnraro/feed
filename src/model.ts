import Database from "bun:sqlite";

export interface FeedConfig {
  id: string;
  name: string;
  link: string;
  interval: number;
}

export interface Feed {
  id: string,
  feedConfigId: string,
  title: string,
  link: string,
  description?: string,
  createdAt?: Date,
}

export class Model {
  db;
  #disposed = false;
  constructor(db: Database) {
    this.db = db;
  }
  init() {
    if (this.#disposed) return;
    this.db.exec("PRAGMA journal_mode = WAL;");
    this.db.exec("PRAGMA foreign_keys = ON;");
    this.db.exec(`
    create table if not exists FeedConfig (
      id text primary key,
      name text not null,
      link text not null unique,
      interval integer not null
    ) without rowid;
    
    create table if not exists Feed (
      id text primary key,
      title text not null,
      link text not null unique,
      description text,
      createdAt text,
      feedConfigId text references FeedConfig (id)
        on update cascade
        on delete cascade
    ) without rowid;
    `);
  }
  setFeedConfig(config: FeedConfig) {
    this.db.query(`
      insert into FeedConfig (id, name, link, interval)
      values ($id, $name, $link, $interval)
      on conflict(id)
        do update set
          name=excluded.name,
          link=excluded.link,
          interval=excluded.interval
    `)
      .run({
        $id: config.id,
        $name: config.name,
        $link: config.link,
        $interval: config.interval,
      });
  }
  feedConfigs() {
    return this.db.query(`
      select id, name, link, interval from FeedConfig
    `)
      .all();
  }
  setFeed(feed: Feed) {
    this.db.query(`
      insert into Feed (id, title, link, description, createdAt, feedConfigId)
      values ($id, $title, $link, $description, $createdAt, $feedConfigId)
    `)
      .run({
        $id: feed.id,
        $title: feed.title,
        $link: feed.link,
        $description: feed.description ?? null,
        $createdAt: feed.createdAt?.toISOString() ?? null,
        $feedConfigId: feed.feedConfigId,
      })
  }
  feeds() {
    return this.db.query(`
      select id, title, link, description, createdAt, feedConfigId from Feed
    `)
      .all();
  }
  [Symbol.dispose]() {
    this.db.close(false);
    this.#disposed = true;
  }
}