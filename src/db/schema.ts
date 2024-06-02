import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { t } from "elysia";

export const sources = sqliteTable("sources", {
  id: text("id").$defaultFn(() => crypto.randomUUID()).primaryKey(),
  name: text("name").notNull().unique(),
  type: text("type", { enum: ["feed"] }).notNull(),
  link: text("link").notNull().unique(),
});

export const createSource = t.Object({
  name: t.String({ minLength: 1 }),
  type: t.Union([t.Literal("feed")]),
  link: t.String({ format: "uri" }),
});

export const articles = sqliteTable("articles", {
  id: text("id").$defaultFn(() => crypto.randomUUID()).primaryKey(),
  title: text("title"),
  description: text("description"),
  link: text("link").notNull().unique(),
  publishedAt: integer("published_at", { mode: "timestamp" }).notNull().default(sql`(current_timestamp)`),
  isSent: integer("is_sent", { mode: "boolean" }).notNull().default(false),
  sourceId: text("source_id").references(() => sources.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
});

export const senders = sqliteTable("senders", {
  id: text("id").$defaultFn(() => crypto.randomUUID()).primaryKey(),
  name: text("name").notNull().unique(),
  type: text("type", { enum: ["discord-webhook", "email"] }).notNull(),
  to: text("to").notNull().unique(),
});

export const createSender = t.Object({
  name: t.String({ minLength: 1 }),
  type: t.Union([t.Literal("discord-webhook"), t.Literal("email")]),
  to: t.String(),
});

export const sendersToSources = sqliteTable("sendersToSources", {
  senderId: text("sender_id").notNull().references(() => senders.id, { onDelete: "cascade", onUpdate: "cascade" }),
  sourceId: text("source_id").notNull().references(() => sources.id, { onDelete: "cascade", onUpdate: "cascade" }),
});
export const createSendersToSources = t.Object({
  senderId: t.String({ format: "uuid" }),
});