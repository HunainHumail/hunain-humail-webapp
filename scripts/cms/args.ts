import {
  ADMIN_COLLECTION_NAMES,
  type AdminCollectionName,
} from "@/lib/admin/collections";

export const CMS_COMMANDS = [
  "login",
  "logout",
  "whoami",
  "list",
  "get",
  "upsert",
  "delete",
  "publish",
  "unpublish",
  "reorder",
  "import",
  "seed",
] as const;

export type CmsCommandName = (typeof CMS_COMMANDS)[number];

export type ListFilter = "all" | "published" | "drafts";

export interface ParsedCmsArgs {
  command: CmsCommandName;
  collection?: AdminCollectionName;
  id?: string;
  file?: string;
  ids?: string[];
  filter: ListFilter;
  json: boolean;
  yes: boolean;
  dryRun: boolean;
}

const COLLECTION_SET = new Set<string>(ADMIN_COLLECTION_NAMES);

function isCommand(value: string): value is CmsCommandName {
  return (CMS_COMMANDS as readonly string[]).includes(value);
}

function isCollection(value: string): value is AdminCollectionName {
  return COLLECTION_SET.has(value);
}

function requireCollection(value: string | undefined): AdminCollectionName {
  if (!value) {
    throw new Error(
      `Missing collection. Use one of: ${ADMIN_COLLECTION_NAMES.join(", ")}`,
    );
  }
  if (!isCollection(value)) {
    throw new Error(
      `Unknown collection "${value}". Use one of: ${ADMIN_COLLECTION_NAMES.join(", ")}`,
    );
  }
  return value;
}

function requireValue(
  value: string | undefined,
  label: string,
): string {
  if (!value) {
    throw new Error(`Missing ${label}`);
  }
  return value;
}

export function parseCmsArgs(argv: readonly string[]): ParsedCmsArgs {
  const positionals: string[] = [];
  let filter: ListFilter = "all";
  let json = false;
  let yes = false;
  let dryRun = false;
  let sawFilter = false;

  for (const arg of argv) {
    if (arg === "--json") {
      json = true;
      continue;
    }
    if (arg === "--yes") {
      yes = true;
      continue;
    }
    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (arg === "--all" || arg === "--published" || arg === "--drafts") {
      if (sawFilter) {
        throw new Error("Use only one of --all, --published, or --drafts");
      }
      sawFilter = true;
      filter = arg.slice(2) as ListFilter;
      continue;
    }
    if (arg.startsWith("-") && arg !== "-") {
      throw new Error(`Unknown flag ${arg}`);
    }
    positionals.push(arg);
  }

  const [commandName, second, third] = positionals;
  if (!commandName) {
    throw new Error("Missing command. Try `npm run cms -- login`.");
  }
  if (!isCommand(commandName)) {
    throw new Error(`Unknown command "${commandName}"`);
  }

  const parsed: ParsedCmsArgs = {
    command: commandName,
    filter,
    json,
    yes,
    dryRun,
  };

  switch (commandName) {
    case "login":
    case "logout":
    case "whoami":
    case "seed":
      return parsed;
    case "list":
      parsed.collection = requireCollection(second);
      return parsed;
    case "get":
    case "delete":
    case "publish":
    case "unpublish":
      parsed.collection = requireCollection(second);
      parsed.id = requireValue(third, "document id");
      return parsed;
    case "upsert":
    case "import":
      parsed.collection = requireCollection(second);
      parsed.file = requireValue(third, "JSON file path (or - for stdin)");
      return parsed;
    case "reorder": {
      parsed.collection = requireCollection(second);
      const rawIds = requireValue(third, "comma-separated document ids");
      parsed.ids = rawIds
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id.length > 0);
      if (!parsed.ids.length) {
        throw new Error("Reorder needs at least one document id");
      }
      return parsed;
    }
    default:
      return parsed;
  }
}
