import { eq } from "drizzle-orm";
import { db } from "../db";
import { senders, sendersToSources } from "../schema";
import type { InsertSender } from "../types";

export function getSendersOfSource(sourceId: string) {
  return db.select().from(sendersToSources)
    .leftJoin(senders, eq(sendersToSources.senderId, senders.id))
    .where(eq(sendersToSources.sourceId, sourceId))
    .all()
    .map(group => group.senders)
    .filter(<T>(sender: T | null): sender is T => sender != null)
}

export function addSenderToSource(sourceId: string, senderId: string) {
  return db.insert(sendersToSources)
    .values({
      senderId,
      sourceId,
    })
    .returning();
}

export function deleteSendersOfSource(sourceId: string) {
  return db.delete(sendersToSources)
    .where(eq(sendersToSources.sourceId, sourceId))
}

export function getSenders() {
  return db.select().from(senders);
}

export function addSender(values: Omit<InsertSender, "id">) {
  return db.insert(senders)
    .values(values)
    .returning();
}

export function getSender(senderId: string) {
  return db.select().from(senders)
    .where(eq(senders.id, senderId));
}

export function updateSender(senderId: string, values: Partial<Omit<InsertSender, "id">>) {
  return db.update(senders)
    .set(values)
    .where(eq(senders.id, senderId))
    .returning();
}

export function deleteSender(senderId: string) {
  return db.delete(senders)
    .where(eq(senders.id, senderId))
}