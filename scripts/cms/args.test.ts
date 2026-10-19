import { describe, expect, it } from "vitest";
import { parseCmsArgs } from "./args";

describe("parseCmsArgs", () => {
  it("parses list filters and json output", () => {
    expect(parseCmsArgs(["list", "work", "--published", "--json"])).toEqual({
      command: "list",
      collection: "work",
      filter: "published",
      json: true,
      yes: false,
      dryRun: false,
    });
    expect(parseCmsArgs(["list", "writing", "--drafts"]).filter).toBe("drafts");
    expect(parseCmsArgs(["list", "story"]).filter).toBe("all");
  });

  it("parses write commands and stdin upsert", () => {
    expect(parseCmsArgs(["get", "work", "work-1"])).toMatchObject({
      command: "get",
      collection: "work",
      id: "work-1",
    });
    expect(parseCmsArgs(["upsert", "work", "-"])).toMatchObject({
      command: "upsert",
      file: "-",
    });
    expect(parseCmsArgs(["import", "work", "items.json", "--dry-run"])).toMatchObject({
      command: "import",
      file: "items.json",
      dryRun: true,
    });
    expect(parseCmsArgs(["delete", "now", "n1", "--yes"])).toMatchObject({
      command: "delete",
      yes: true,
    });
    expect(parseCmsArgs(["reorder", "story", "a, b,c"])).toMatchObject({
      command: "reorder",
      ids: ["a", "b", "c"],
    });
    expect(parseCmsArgs(["seed", "--dry-run"]).dryRun).toBe(true);
    expect(parseCmsArgs(["publish", "writing", "w1"]).command).toBe("publish");
  });

  it("rejects unknown collections, flags, and missing args", () => {
    expect(() => parseCmsArgs(["list", "messages"])).toThrow(/Unknown collection/);
    expect(() => parseCmsArgs(["list", "work", "--all", "--drafts"])).toThrow(
      /only one/,
    );
    expect(() => parseCmsArgs(["bogus"])).toThrow(/Unknown command/);
    expect(() => parseCmsArgs(["get", "work"])).toThrow(/Missing document id/);
    expect(() => parseCmsArgs(["list", "work", "--pretty"])).toThrow(
      /Unknown flag/,
    );
  });
});
