import { file, write } from "bun";
import { join } from "path";
import { archiveDump, createClient, createDump, rmDump, tmp } from "./utils.js";

const client = await createClient();
try {
  await createDump(client);
  const feeds = join(tmp, "indexes", "feeds", "documents.jsonl");
  const documents = await file(feeds).text();
  await write(feeds,
    documents.split(/\n/)
      .map(x => {
        if (x === "") return "";
        const document = JSON.parse(x);
        if (typeof document.time === "number") return x;
        return JSON.stringify({
          ...document,
          time: new Date(document.time).getTime(),
        })
      })
      .join("\n")
  );
  archiveDump();
} catch (error) {
  console.error(error);
}
rmDump();
