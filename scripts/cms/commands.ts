import { ADMIN_EMAIL } from "@/lib/admin";
import type { AdminCollectionName } from "@/lib/admin/collections";
import { buildSeedImportPayload } from "@/lib/seed/importPayload";
import { stripUndefined } from "@/lib/utils/stripUndefined";
import { isRecord } from "@/lib/admin/record";
import type { ParsedCmsArgs } from "./args";
import { formatTable, matchesFilter, toListRow } from "./collections";
import {
  deleteCredentials,
  readCredentials,
  writeCredentials,
} from "./credentials";
import {
  commitRestWrites,
  deleteRestDocument,
  getRestDocument,
  listRestDocuments,
  type CommitWrite,
} from "./firestoreRest";
import {
  chunkImportWrites,
  planImport,
  prepareCmsDocument,
  resolveDocumentId,
} from "./importDocs";
import {
  CLI_SESSION_COLLECTION,
  createLoginChallenge,
  pollCliSession,
} from "./login";
import { asDocumentList, readJsonInput, writeLine } from "./io";
import { getIdToken, resetIdTokenCache } from "./tokens";

export interface CmsRuntime {
  apiKey: string;
  projectId: string;
  configDir?: string;
  fetchFn?: typeof fetch;
  now?: () => number;
  sleep?: (ms: number) => Promise<void>;
  stdout?: NodeJS.WriteStream;
  stderr?: NodeJS.WriteStream;
}

async function requireAuth(runtime: CmsRuntime) {
  return getIdToken({
    apiKey: runtime.apiKey,
    configDir: runtime.configDir,
    fetchFn: runtime.fetchFn,
    now: runtime.now,
  });
}

function out(runtime: CmsRuntime): NodeJS.WriteStream {
  return runtime.stdout ?? process.stdout;
}

function print(runtime: CmsRuntime, text: string): void {
  writeLine(out(runtime), text);
}

function updatedAt(runtime: CmsRuntime): string {
  return new Date((runtime.now ?? Date.now)()).toISOString();
}

async function writeBatches(
  runtime: CmsRuntime,
  idToken: string,
  writes: readonly CommitWrite[],
): Promise<void> {
  for (const chunk of chunkImportWrites(writes)) {
    await commitRestWrites({
      projectId: runtime.projectId,
      idToken,
      writes: chunk,
      fetchFn: runtime.fetchFn,
    });
  }
}

async function existingIds(
  runtime: CmsRuntime,
  idToken: string,
  collection: AdminCollectionName,
): Promise<Set<string>> {
  const documents = await listRestDocuments({
    projectId: runtime.projectId,
    collection,
    idToken,
    fetchFn: runtime.fetchFn,
  });
  return new Set(documents.map((document) => document.id));
}

async function runLogin(runtime: CmsRuntime): Promise<void> {
  const challenge = createLoginChallenge();
  print(runtime, `Open ${challenge.url}`);
  print(runtime, `User code: ${challenge.userCode}`);
  print(runtime, "Waiting for the browser to confirm this code…");

  const session = await pollCliSession({
    projectId: runtime.projectId,
    sessionId: challenge.sessionId,
    fetchFn: runtime.fetchFn,
    sleep: runtime.sleep,
    now: runtime.now,
  });

  writeCredentials(
    { refreshToken: session.refreshToken, email: session.email },
    runtime.configDir,
  );
  resetIdTokenCache();

  const auth = await getIdToken({
    apiKey: runtime.apiKey,
    configDir: runtime.configDir,
    fetchFn: runtime.fetchFn,
    now: runtime.now,
  });
  if (auth.email.toLowerCase() !== ADMIN_EMAIL) {
    deleteCredentials(runtime.configDir);
    throw new Error("Signed-in account is not the verified admin");
  }

  await deleteRestDocument({
    projectId: runtime.projectId,
    collection: CLI_SESSION_COLLECTION,
    id: challenge.sessionId,
    idToken: auth.idToken,
    fetchFn: runtime.fetchFn,
  });
  print(runtime, `Logged in as ${auth.email}`);
}

function runLogout(runtime: CmsRuntime): void {
  resetIdTokenCache();
  deleteCredentials(runtime.configDir);
  print(runtime, "Logged out");
}

function runWhoami(runtime: CmsRuntime): void {
  const credentials = readCredentials(runtime.configDir);
  if (!credentials) {
    throw new Error("Not logged in. Run `npm run cms -- login`.");
  }
  print(runtime, credentials.email);
}

async function runList(
  runtime: CmsRuntime,
  collection: AdminCollectionName,
  args: ParsedCmsArgs,
): Promise<void> {
  const auth = await requireAuth(runtime);
  const documents = (
    await listRestDocuments({
      projectId: runtime.projectId,
      collection,
      idToken: auth.idToken,
      fetchFn: runtime.fetchFn,
    })
  )
    .filter((document) => matchesFilter(document.data, args.filter))
    .sort((left, right) => {
      const leftOrder = typeof left.data.order === "number" ? left.data.order : 0;
      const rightOrder =
        typeof right.data.order === "number" ? right.data.order : 0;
      return leftOrder - rightOrder;
    });

  const rows = documents.map((document) => toListRow(collection, document));
  if (args.json) {
    print(runtime, JSON.stringify(rows, null, 2));
    return;
  }
  print(runtime, rows.length ? formatTable(rows) : "No documents");
}

async function runGet(
  runtime: CmsRuntime,
  collection: AdminCollectionName,
  id: string,
): Promise<void> {
  const auth = await requireAuth(runtime);
  const document = await getRestDocument({
    projectId: runtime.projectId,
    collection,
    id,
    idToken: auth.idToken,
    fetchFn: runtime.fetchFn,
  });
  if (!document) {
    throw new Error(`${collection}/${id} was not found`);
  }
  print(runtime, JSON.stringify({ id: document.id, ...document.data }, null, 2));
}

async function upsertDocuments(
  runtime: CmsRuntime,
  collection: AdminCollectionName,
  sources: unknown[],
  dryRun: boolean,
): Promise<{ created: number; updated: number }> {
  const auth = await requireAuth(runtime);
  const existing = await existingIds(runtime, auth.idToken, collection);
  const writes: CommitWrite[] = [];
  let created = 0;
  let updated = 0;
  const now = updatedAt(runtime);

  for (const source of sources) {
    if (!isRecord(source)) {
      throw new Error(`${collection} document is not an object`);
    }
    const id = resolveDocumentId(collection, source);
    const current = await getRestDocument({
      projectId: runtime.projectId,
      collection,
      id,
      idToken: auth.idToken,
      fetchFn: runtime.fetchFn,
    });
    const prepared = prepareCmsDocument(
      collection,
      source,
      now,
      current?.data,
    );
    writes.push({
      collection,
      id: prepared.id,
      data: isRecord(stripUndefined(prepared.data))
        ? (stripUndefined(prepared.data) as Record<string, unknown>)
        : prepared.data,
    });
    if (existing.has(prepared.id) || current) {
      updated += 1;
    } else {
      created += 1;
    }
  }

  if (!dryRun) {
    await writeBatches(runtime, auth.idToken, writes);
  }
  return { created, updated };
}

async function runUpsert(
  runtime: CmsRuntime,
  collection: AdminCollectionName,
  file: string,
): Promise<void> {
  const payload = await readJsonInput(file);
  const result = await upsertDocuments(
    runtime,
    collection,
    asDocumentList(payload),
    false,
  );
  print(
    runtime,
    `Upserted ${result.created + result.updated} (${result.created} created, ${result.updated} updated)`,
  );
}

async function runDelete(
  runtime: CmsRuntime,
  collection: AdminCollectionName,
  id: string,
  yes: boolean,
): Promise<void> {
  if (!yes) {
    throw new Error(`Refusing to delete ${collection}/${id} without --yes`);
  }
  const auth = await requireAuth(runtime);
  await deleteRestDocument({
    projectId: runtime.projectId,
    collection,
    id,
    idToken: auth.idToken,
    fetchFn: runtime.fetchFn,
  });
  print(runtime, `Deleted ${collection}/${id}`);
}

async function patchStatus(
  runtime: CmsRuntime,
  collection: AdminCollectionName,
  id: string,
  status: "published" | "draft",
): Promise<void> {
  const auth = await requireAuth(runtime);
  const current = await getRestDocument({
    projectId: runtime.projectId,
    collection,
    id,
    idToken: auth.idToken,
    fetchFn: runtime.fetchFn,
  });
  if (!current) {
    throw new Error(`${collection}/${id} was not found`);
  }
  const prepared = prepareCmsDocument(
    collection,
    { ...current.data, status },
    updatedAt(runtime),
    current.data,
  );
  await writeBatches(runtime, auth.idToken, [
    { collection, id: prepared.id, data: prepared.data },
  ]);
  print(runtime, `${status === "published" ? "Published" : "Unpublished"} ${collection}/${id}`);
}

async function runReorder(
  runtime: CmsRuntime,
  collection: AdminCollectionName,
  ids: string[],
): Promise<void> {
  const auth = await requireAuth(runtime);
  const writes: CommitWrite[] = [];
  const now = updatedAt(runtime);
  for (const [index, id] of ids.entries()) {
    const current = await getRestDocument({
      projectId: runtime.projectId,
      collection,
      id,
      idToken: auth.idToken,
      fetchFn: runtime.fetchFn,
    });
    if (!current) {
      throw new Error(`${collection}/${id} was not found`);
    }
    const prepared = prepareCmsDocument(
      collection,
      { ...current.data, order: index + 1 },
      now,
      current.data,
    );
    writes.push({ collection, id: prepared.id, data: prepared.data });
  }
  await writeBatches(runtime, auth.idToken, writes);
  print(runtime, `Reordered ${ids.length} ${collection} documents`);
}

async function runImport(
  runtime: CmsRuntime,
  collection: AdminCollectionName,
  file: string,
  dryRun: boolean,
): Promise<void> {
  const payload = await readJsonInput(file);
  if (!Array.isArray(payload)) {
    throw new Error("Import expects a JSON array");
  }
  const auth = await requireAuth(runtime);
  const existing = await existingIds(runtime, auth.idToken, collection);
  const plan = planImport({
    collection,
    documents: payload,
    existingIds: existing,
    updatedAt: updatedAt(runtime),
  });
  if (!dryRun) {
    await writeBatches(runtime, auth.idToken, plan.writes);
  }
  print(
    runtime,
    `${dryRun ? "Dry run: would import" : "Imported"} ${plan.writes.length} ${collection} (${plan.created} created, ${plan.updated} updated)`,
  );
}

async function runSeed(runtime: CmsRuntime, dryRun: boolean): Promise<void> {
  const auth = await requireAuth(runtime);
  const payload = buildSeedImportPayload(() => updatedAt(runtime));
  let created = 0;
  let updated = 0;
  const writes: CommitWrite[] = [];

  const byCollection = new Map<AdminCollectionName, unknown[]>();
  for (const document of payload.documents) {
    const list = byCollection.get(document.collection) ?? [];
    list.push({ id: document.id, ...document.data });
    byCollection.set(document.collection, list);
  }

  for (const [collection, documents] of byCollection) {
    const existing = await existingIds(runtime, auth.idToken, collection);
    const plan = planImport({
      collection,
      documents,
      existingIds: existing,
      updatedAt: updatedAt(runtime),
    });
    created += plan.created;
    updated += plan.updated;
    writes.push(...plan.writes);
  }

  if (!dryRun) {
    await writeBatches(runtime, auth.idToken, writes);
  }
  print(
    runtime,
    `${dryRun ? "Dry run: would seed" : "Seeded"} ${writes.length} documents (${created} created, ${updated} updated)`,
  );
}

export async function runCmsCommand(
  args: ParsedCmsArgs,
  runtime: CmsRuntime,
): Promise<void> {
  switch (args.command) {
    case "login":
      await runLogin(runtime);
      return;
    case "logout":
      runLogout(runtime);
      return;
    case "whoami":
      runWhoami(runtime);
      return;
    case "list":
      await runList(runtime, args.collection ?? "work", args);
      return;
    case "get":
      await runGet(runtime, args.collection ?? "work", args.id ?? "");
      return;
    case "upsert":
      await runUpsert(runtime, args.collection ?? "work", args.file ?? "-");
      return;
    case "delete":
      await runDelete(
        runtime,
        args.collection ?? "work",
        args.id ?? "",
        args.yes,
      );
      return;
    case "publish":
      await patchStatus(
        runtime,
        args.collection ?? "work",
        args.id ?? "",
        "published",
      );
      return;
    case "unpublish":
      await patchStatus(
        runtime,
        args.collection ?? "work",
        args.id ?? "",
        "draft",
      );
      return;
    case "reorder":
      await runReorder(runtime, args.collection ?? "work", args.ids ?? []);
      return;
    case "import":
      await runImport(
        runtime,
        args.collection ?? "work",
        args.file ?? "",
        args.dryRun,
      );
      return;
    case "seed":
      await runSeed(runtime, args.dryRun);
      return;
    default:
      throw new Error(`Unknown command ${args.command}`);
  }
}
