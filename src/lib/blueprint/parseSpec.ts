import {
  blueprintSpecSchema,
  type BlueprintPlatform,
  type BlueprintSpec,
} from "@/lib/schemas/blueprint";

export type ParseBlueprintSpecResult =
  | { ok: true; spec: BlueprintSpec }
  | { ok: false; issues: string[] };

const BLOCK_TYPES = new Set([
  "header",
  "nav",
  "list",
  "card",
  "form",
  "button",
  "image",
  "tabbar",
]);

function clip(value: unknown, max: number): string {
  if (typeof value !== "string") {
    return "";
  }
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (trimmed.length <= max) {
    return trimmed;
  }
  const sliced = trimmed.slice(0, max);
  const boundary = sliced.lastIndexOf(" ");
  const cut = boundary > max * 0.6 ? sliced.slice(0, boundary) : sliced;
  return cut.trim();
}

function slugify(value: string, fallback: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || fallback;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function clipList(value: unknown, maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => clip(item, maxLen))
    .filter((item) => item.length > 0)
    .slice(0, maxItems);
}

/** Gemini drafts are useful but loose. Fit them to the schema before validating. */
export function normalizeBlueprintDraft(input: unknown): unknown {
  const raw = asRecord(input);
  if (!raw) {
    return input;
  }

  const seen = new Set<string>();
  const screens = Array.isArray(raw.screens) ? raw.screens.slice(0, 4) : [];
  const normalizedScreens = screens.flatMap((screen, index) => {
    const record = asRecord(screen);
    if (!record) {
      return [];
    }
    const title = clip(record.title, 40) || `Screen ${index + 1}`;
    let id = slugify(clip(record.id, 40) || title, `screen-${index + 1}`);
    if (seen.has(id)) {
      id = `${id}-${index + 1}`;
    }
    seen.add(id);

    const blocks = Array.isArray(record.blocks) ? record.blocks : [];
    const normalizedBlocks = blocks.flatMap((block) => {
      const item = asRecord(block);
      if (!item || typeof item.type !== "string" || !BLOCK_TYPES.has(item.type)) {
        return [];
      }
      const label = clip(item.label, 40) || title;
      const names = clipList(item.items, 4, 28);
      return [
        {
          type: item.type,
          label,
          ...(names.length > 0 ? { items: names } : {}),
        },
      ];
    });

    if (normalizedBlocks.length === 0) {
      return [];
    }

    return [
      {
        id,
        title,
        purpose: clip(record.purpose, 160) || title,
        blocks: normalizedBlocks.slice(0, 6),
      },
    ];
  });

  return {
    appName: clip(raw.appName, 40),
    summary: clip(raw.summary, 300),
    audience: clip(raw.audience, 80),
    mvp: clip(raw.mvp, 220),
    assumptions: clipList(raw.assumptions, 4, 140),
    later: clipList(raw.later, 4, 120),
    platform: raw.platform,
    screens: normalizedScreens,
    features: clipList(raw.features, 5, 80),
  };
}

export function parseBlueprintSpec(
  text: unknown,
  platform: BlueprintPlatform,
): ParseBlueprintSpecResult {
  let parsed: unknown = text;
  if (typeof text === "string") {
    try {
      parsed = JSON.parse(text) as unknown;
    } catch {
      return { ok: false, issues: ["json"] };
    }
  }

  const result = blueprintSpecSchema.safeParse(
    normalizeBlueprintDraft(parsed),
  );
  if (!result.success) {
    return {
      ok: false,
      issues: result.error.issues.map(
        (issue) => `${issue.path.join(".") || "spec"}: ${issue.message}`,
      ),
    };
  }

  return {
    ok: true,
    spec: { ...result.data, platform },
  };
}
