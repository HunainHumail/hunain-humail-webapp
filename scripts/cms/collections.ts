import {
  getCollectionConfig,
  type AdminCollectionName,
} from "@/lib/admin/collections";
import { getPath } from "@/lib/admin/record";
import {
  PROFILE_DOC_ID,
  SETTINGS_DOC_ID,
} from "@/lib/firebase/constants";
import type { ListFilter } from "./args";
import type { RestDocument } from "./firestoreRest";

export function singletonId(collection: AdminCollectionName): string | undefined {
  if (collection === "profile") {
    return PROFILE_DOC_ID;
  }
  if (collection === "settings") {
    return SETTINGS_DOC_ID;
  }
  return undefined;
}

export function documentTitle(collection: AdminCollectionName, data: Record<string, unknown>): string {
  const field = getCollectionConfig(collection).titleField;
  const value = getPath(data, field);
  return typeof value === "string" && value.length > 0 ? value : "";
}

export function documentKey(data: Record<string, unknown>, id: string): string {
  return typeof data.slug === "string" && data.slug.length > 0 ? data.slug : id;
}

export function matchesFilter(
  data: Record<string, unknown>,
  filter: ListFilter,
): boolean {
  if (filter === "all") {
    return true;
  }
  return data.status === (filter === "published" ? "published" : "draft");
}

export function toListRow(
  collection: AdminCollectionName,
  document: RestDocument,
): { id: string; title: string; status: string; order: string } {
  const order =
    typeof document.data.order === "number" ? String(document.data.order) : "";
  const status =
    typeof document.data.status === "string" ? document.data.status : "";
  return {
    id: documentKey(document.data, document.id),
    title: documentTitle(collection, document.data),
    status,
    order,
  };
}

export function formatTable(
  rows: Array<{ id: string; title: string; status: string; order: string }>,
): string {
  const header = { id: "ID/SLUG", title: "TITLE", status: "STATUS", order: "ORDER" };
  const all = [header, ...rows];
  const widths = {
    id: Math.max(...all.map((row) => row.id.length)),
    title: Math.max(...all.map((row) => row.title.length)),
    status: Math.max(...all.map((row) => row.status.length)),
    order: Math.max(...all.map((row) => row.order.length)),
  };
  return all
    .map((row) =>
      [
        row.id.padEnd(widths.id),
        row.title.padEnd(widths.title),
        row.status.padEnd(widths.status),
        row.order.padStart(widths.order),
      ].join("  "),
    )
    .join("\n");
}
