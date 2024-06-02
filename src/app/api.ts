import swagger from "@elysiajs/swagger";
import Elysia, { t } from "elysia";
import { db } from "../db/db";
import { articles, createSender, createSendersToSources, createSource, senders, sendersToSources, sources } from "../db/schema";
import { eq } from "drizzle-orm";
import { update } from "./models/update";

export const api = new Elysia({ prefix: "/api" })
  .use(swagger({
    documentation: {
      info: {
        title: "feed",
        version: "0.0.0",
        description: "Self-hosted feed manager API documentation",
      }
    }
  }))
  .get("/sources", () => db.select().from(sources))
  .post("/sources", ({ body }) => db.insert(sources).values(body).returning(), {
    body: createSource,
  })
  .post("/sources/update", async () => {
    const sourcez = await db.select().from(sources);

    return await Promise.allSettled(sourcez.map(source => update(source.id)));
  })
  .group("/sources/:sourceId", {
    params: t.Object({ sourceId: t.String({ format: "uuid" }) })
  }, app => app
    .get("/", ({ params }) => db.select().from(sources).where(eq(sources.id, params.sourceId)))
    .put("/", ({ params, body }) => db.update(sources).set(body).where(eq(sources.id, params.sourceId)), { body: t.Partial(createSource) })
    .delete("/", ({ params }) => db.delete(sources).where(eq(sources.id, params.sourceId)))
    .get("/articles", ({ params }) => db.select().from(articles).where(eq(articles.sourceId, params.sourceId)))
    .delete("/articles", ({ params }) => db.delete(articles).where(eq(articles.sourceId, params.sourceId)))
    .get("/senders", ({ params }) => db.select().from(sendersToSources)
      .leftJoin(senders, eq(sendersToSources.senderId, senders.id))
      .where(eq(sendersToSources.sourceId, params.sourceId))
      .all()
      .map(group => group.senders)
      .filter(<T>(sender: T | null): sender is T => sender != null)
    )
    .post("/senders", ({ params, body }) => db.insert(sendersToSources).values({
      senderId: body.senderId,
      sourceId: params.sourceId
    }).returning(), { body: createSendersToSources })
    .delete("/senders", ({ params }) => db.delete(sendersToSources).where(eq(sendersToSources.sourceId, params.sourceId)))
    .group("/senders/:senderId", {
      params: t.Object({ senderId: t.String({ format: "uuid" }) })
    }, app => app)
  )
  .get("/senders", () => db.select().from(senders))
  .post("/senders", ({ body }) => db.insert(senders).values(body).returning(), { body: createSender })
  .group("/senders/:senderId", {
    params: t.Object({ senderId: t.String({ format: "uuid" }) })
  }, app => app
    .get("/", ({ params }) => db.select().from(senders).where(eq(senders.id, params.senderId)))
    .put("/", ({ params, body }) => db.update(senders).set(body).where(eq(senders.id, params.senderId)), { body: t.Partial(createSender) })
    .delete("/", ({ params }) => db.delete(senders).where(eq(senders.id, params.senderId)))
  )