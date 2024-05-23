import Database from "bun:sqlite";

export interface FeedConfig {
  id: string;
  name: string;
  link: string;
  interval: number;
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
      createdAt text
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
  [Symbol.dispose]() {
    this.db.close(false);
    this.#disposed = true;
  }
}