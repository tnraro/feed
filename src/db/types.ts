import type { articles, senders, sources } from "./schema";

export type SelectArticle = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;

export type SelectSource = typeof sources.$inferSelect;
export type InsertSource = typeof sources.$inferInsert;

export type SelectSender = typeof senders.$inferSelect;
export type InsertSender = typeof senders.$inferInsert;