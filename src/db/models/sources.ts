import { eq } from "drizzle-orm";
import { db } from "../db";
import { sources } from "../schema";
import type { InsertSource } from "../types";

export function getSources() {
  return db.select().from(sources);
}

export function addSource(values: Omit<InsertSource, "id">) {
  return db.insert(sources)
    .values(values)
    .returning();
}

export function getSource(sourceId: string) {
  return db.select().from(sources)
    .where(eq(sources.id, sourceId));
}

export function updateSource(sourceId: string, values: Partial<Omit<InsertSource, "id">>) {
  return db.update(sources)
    .set(values)
    .where(eq(sources.id, sourceId))
    .returning();
}

export function deleteSource(sourceId: string) {
  return db.delete(sources)
    .where(eq(sources.id, sourceId))
    .returning();
}

