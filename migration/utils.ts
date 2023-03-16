import { MeiliSearch } from "meilisearch";
import { join } from "path";

export const root = join(import.meta.dir, "..");
export const dumps = join(root, "dumps");
export const tmp = join(root, "tmp");

export async function createClient() {
  const client = new MeiliSearch({
    host: "http://localhost:7700",
    apiKey: Bun.env.MEILI_MASTER_KEY,
  });
  await client.health();
  return client;
}

export async function createDump(client: MeiliSearch) {
  const dumpCreationTask = await client.createDump();

  if (dumpCreationTask.status === "failed") throw new Error(`Dump creation task failed. task uid: ${dumpCreationTask.taskUid}`, {
    cause: dumpCreationTask.taskUid
  });

  const dumpUid = await getDumpUid(client, dumpCreationTask.taskUid);

  rmDump();
  Bun.spawnSync(["mkdir", "-p", tmp]);
  Bun.spawnSync(["tar", "zxf", join(dumps, dumpUid + ".dump")], {
    cwd: tmp
  });
}

export function archiveDump(filename = "my") {
  const dumpPath = join(dumps, filename + ".dump");
  Bun.spawnSync(["tar", "zcf", dumpPath, "*"], {
    cwd: tmp
  });
  console.log("Dump file is ready");
  console.log(`./meilisearch --import-dump ${dumpPath}`);
}

export function rmDump() {
  Bun.spawnSync(["rm", "-rf", tmp]);
}

/// ----
export async function getDumpUid(client: MeiliSearch, taskUid: number, delay: number = 300) {
  while (true) {
    await Bun.sleep(delay);
    const task = await client.getTask(taskUid);
    if (task.status === "failed") {
      throw new Error(`Dump creation task failed. task uid: ${taskUid}`, {
        cause: task
      });
    }
    if (task.status === "succeeded") {
      return (task.details as { dumpUid: string }).dumpUid;
    }
  }
}