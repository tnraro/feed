import { $ } from "bun";
import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { join } from "path";
import * as schema from "./schema";

await $`mkdir -p data`;
const sqlite = new Database(join(import.meta.dir, "../../data/data.sqlite"));

export const db = drizzle(sqlite, { schema });
