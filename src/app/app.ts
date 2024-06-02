import Elysia from "elysia";
import { api } from "./api";
import serverTiming from "@elysiajs/server-timing";

export const app = new Elysia()
  .use(serverTiming())
  .use(api)
  .get("/", () => 53)
  .onError(({ path, request, error }) => {
    console.group(request.method, path);
    console.error(error);
    console.groupEnd();
  })

export type App = typeof app;