import { describe, expect, it } from "vitest";
import {
  decodeMap,
  decodeValue,
  documentIdFromName,
  encodeMap,
  encodeValue,
} from "./values";

describe("Firestore value codec", () => {
  it("encodes and decodes primitive values", () => {
    expect(encodeValue("hello")).toEqual({ stringValue: "hello" });
    expect(encodeValue(12)).toEqual({ integerValue: "12" });
    expect(encodeValue(1.5)).toEqual({ doubleValue: 1.5 });
    expect(encodeValue(true)).toEqual({ booleanValue: true });
    expect(encodeValue(null)).toEqual({ nullValue: "NULL_VALUE" });

    expect(decodeValue({ stringValue: "hello" })).toBe("hello");
    expect(decodeValue({ integerValue: "12" })).toBe(12);
    expect(decodeValue({ doubleValue: 1.5 })).toBe(1.5);
    expect(decodeValue({ booleanValue: false })).toBe(false);
    expect(decodeValue({ nullValue: "NULL_VALUE" })).toBeNull();
  });

  it("encodes and decodes arrays, maps, and timestamps", () => {
    const stamped = new Date("2026-10-19T12:00:00.000Z");
    const encoded = encodeMap({
      title: "Open finance",
      tags: ["agents", "payments"],
      featured: false,
      publishedAt: stamped,
      extra: null,
    });

    expect(encoded).toEqual({
      title: { stringValue: "Open finance" },
      tags: {
        arrayValue: {
          values: [{ stringValue: "agents" }, { stringValue: "payments" }],
        },
      },
      featured: { booleanValue: false },
      publishedAt: { timestampValue: "2026-10-19T12:00:00.000Z" },
      extra: { nullValue: "NULL_VALUE" },
    });

    expect(decodeMap(encoded)).toEqual({
      title: "Open finance",
      tags: ["agents", "payments"],
      featured: false,
      publishedAt: "2026-10-19T12:00:00.000Z",
      extra: null,
    });
    expect(decodeValue({ timestampValue: "2026-01-01T00:00:00Z" })).toBe(
      "2026-01-01T00:00:00Z",
    );
  });

  it("strips undefined map fields and reads a document id from its name", () => {
    expect(encodeMap({ keep: "yes", skip: undefined })).toEqual({
      keep: { stringValue: "yes" },
    });
    expect(
      documentIdFromName(
        "projects/demo/databases/(default)/documents/cliSessions/abc",
      ),
    ).toBe("abc");
  });
});
