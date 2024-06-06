import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "sqlite",
  strict: true,
  out: "./drizzle"
});