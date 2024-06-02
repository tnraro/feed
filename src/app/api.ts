import swagger from "@elysiajs/swagger";
import Elysia, { t } from "elysia";
import { db } from "../db/db";
import { deleteArticlesOfSource, getArticlesOfSource } from "../db/models/articles";
import { addSender, addSenderToSource, deleteSender, deleteSendersOfSource, getSender, getSenders, getSendersOfSource, updateSender } from "../db/models/senders";
import { addSource, deleteSource, getSource, getSources, updateSource } from "../db/models/sources";
import { createSender, createSendersToSources, createSource, sources } from "../db/schema";
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
  .get("/sources", () => getSources())
  .post("/sources", ({ body }) => addSource(body), { body: createSource })
  .post("/sources/update", async () => {
    const sourcez = await db.select().from(sources);

    return await Promise.allSettled(sourcez.map(source => update(source.id)));
  })
  .group("/sources/:sourceId", {
    params: t.Object({ sourceId: t.String({ format: "uuid" }) })
  }, app => app
    .get("/", ({ params }) => getSource(params.sourceId))
    .put("/", ({ params, body }) => updateSource(params.sourceId, body), { body: t.Partial(createSource) })
    .delete("/", ({ params }) => deleteSource(params.sourceId))
    .get("/articles", ({ params }) => getArticlesOfSource(params.sourceId))
    .delete("/articles", ({ params }) => deleteArticlesOfSource(params.sourceId))
    .get("/senders", ({ params }) => getSendersOfSource(params.sourceId))
    .post("/senders", ({ params, body }) => addSenderToSource(params.sourceId, body.senderId), { body: createSendersToSources })
    .delete("/senders", ({ params }) => deleteSendersOfSource(params.sourceId))
    .group("/senders/:senderId", {
      params: t.Object({ senderId: t.String({ format: "uuid" }) })
    }, app => app)
  )
  .get("/senders", () => getSenders())
  .post("/senders", ({ body }) => addSender(body), { body: createSender })
  .group("/senders/:senderId", {
    params: t.Object({ senderId: t.String({ format: "uuid" }) })
  }, app => app
    .get("/", ({ params }) => getSender(params.senderId))
    .put("/", ({ params, body }) => updateSender(params.senderId, body), { body: t.Partial(createSender) })
    .delete("/", ({ params }) => deleteSender(params.senderId))
  )