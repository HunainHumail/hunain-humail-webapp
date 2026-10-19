import { FIRESTORE_WRITE_CHUNK_SIZE } from "@/lib/utils/chunkItems";
import {
  decodeMap,
  documentIdFromName,
  encodeMap,
  type FirestoreValue,
} from "./values";

export const FIRESTORE_COMMIT_LIMIT = FIRESTORE_WRITE_CHUNK_SIZE;

export interface RestDocument {
  id: string;
  data: Record<string, unknown>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function documentsRoot(projectId: string): string {
  return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents`;
}

export function documentName(
  projectId: string,
  collection: string,
  id: string,
): string {
  return `projects/${projectId}/databases/(default)/documents/${collection}/${id}`;
}

export function documentUrl(
  projectId: string,
  collection: string,
  id: string,
): string {
  return `${documentsRoot(projectId)}/${encodeURIComponent(collection)}/${encodeURIComponent(id)}`;
}

function authHeaders(idToken?: string): Record<string, string> {
  return idToken ? { Authorization: `Bearer ${idToken}` } : {};
}

async function readJson(response: Response): Promise<unknown> {
  return response.json().catch(() => null);
}

function errorMessage(body: unknown, fallback: string): string {
  if (
    isRecord(body) &&
    isRecord(body.error) &&
    typeof body.error.message === "string"
  ) {
    return body.error.message;
  }
  return fallback;
}

export function restDocumentFromBody(body: unknown): RestDocument | null {
  if (!isRecord(body) || typeof body.name !== "string") {
    return null;
  }
  return {
    id: documentIdFromName(body.name),
    data: decodeMap(isRecord(body.fields) ? body.fields : undefined),
  };
}

export async function getRestDocument(options: {
  projectId: string;
  collection: string;
  id: string;
  idToken?: string;
  fetchFn?: typeof fetch;
}): Promise<RestDocument | null> {
  const fetchFn = options.fetchFn ?? fetch;
  const response = await fetchFn(
    documentUrl(options.projectId, options.collection, options.id),
    { headers: authHeaders(options.idToken) },
  );
  if (response.status === 404) {
    return null;
  }
  const body = await readJson(response);
  if (!response.ok) {
    throw new Error(
      errorMessage(body, `Failed to get ${options.collection}/${options.id}`),
    );
  }
  return restDocumentFromBody(body);
}

export async function listRestDocuments(options: {
  projectId: string;
  collection: string;
  idToken: string;
  fetchFn?: typeof fetch;
}): Promise<RestDocument[]> {
  const fetchFn = options.fetchFn ?? fetch;
  const documents: RestDocument[] = [];
  let pageToken = "";

  do {
    const url = new URL(
      `${documentsRoot(options.projectId)}/${encodeURIComponent(options.collection)}`,
    );
    url.searchParams.set("pageSize", "300");
    if (pageToken) {
      url.searchParams.set("pageToken", pageToken);
    }
    const response = await fetchFn(url.toString(), {
      headers: authHeaders(options.idToken),
    });
    const body = await readJson(response);
    if (!response.ok) {
      throw new Error(
        errorMessage(body, `Failed to list ${options.collection}`),
      );
    }
    if (isRecord(body) && Array.isArray(body.documents)) {
      for (const item of body.documents) {
        const parsed = restDocumentFromBody(item);
        if (parsed) {
          documents.push(parsed);
        }
      }
    }
    pageToken =
      isRecord(body) && typeof body.nextPageToken === "string"
        ? body.nextPageToken
        : "";
  } while (pageToken);

  return documents;
}

export async function deleteRestDocument(options: {
  projectId: string;
  collection: string;
  id: string;
  idToken: string;
  fetchFn?: typeof fetch;
}): Promise<void> {
  const fetchFn = options.fetchFn ?? fetch;
  const response = await fetchFn(
    documentUrl(options.projectId, options.collection, options.id),
    { method: "DELETE", headers: authHeaders(options.idToken) },
  );
  if (response.status === 404) {
    return;
  }
  if (!response.ok) {
    const body = await readJson(response);
    throw new Error(
      errorMessage(body, `Failed to delete ${options.collection}/${options.id}`),
    );
  }
}

export interface CommitWrite {
  collection: string;
  id: string;
  data: Record<string, unknown>;
}

export function commitWritesPayload(
  projectId: string,
  writes: readonly CommitWrite[],
): { writes: Array<{ update: { name: string; fields: Record<string, FirestoreValue> } }> } {
  return {
    writes: writes.map((write) => ({
      update: {
        name: documentName(projectId, write.collection, write.id),
        fields: encodeMap(write.data),
      },
    })),
  };
}

export async function commitRestWrites(options: {
  projectId: string;
  idToken: string;
  writes: readonly CommitWrite[];
  fetchFn?: typeof fetch;
}): Promise<void> {
  if (options.writes.length === 0) {
    return;
  }
  if (options.writes.length > FIRESTORE_COMMIT_LIMIT) {
    throw new Error(
      `Commit exceeds ${FIRESTORE_COMMIT_LIMIT} writes; split the batch first`,
    );
  }
  const fetchFn = options.fetchFn ?? fetch;
  const response = await fetchFn(`${documentsRoot(options.projectId)}:commit`, {
    method: "POST",
    headers: {
      ...authHeaders(options.idToken),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commitWritesPayload(options.projectId, options.writes)),
  });
  if (!response.ok) {
    const body = await readJson(response);
    throw new Error(errorMessage(body, "Firestore commit failed"));
  }
}
