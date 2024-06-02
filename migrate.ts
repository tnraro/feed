import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { join } from "path";
import { db } from "./src/db/db";

migrate(db, { migrationsFolder: join(import.meta.dir, "./drizzle") });