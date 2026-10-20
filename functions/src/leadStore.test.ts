// @vitest-environment node
import { describe, expect, it } from "vitest";
import { omitUndefined } from "./leadStore";

describe("omitUndefined", () => {
  it("drops undefined fields so Firestore can store a failed lead", () => {
    expect(
      omitUndefined({
        email: "ada@example.com",
        spec: undefined,
        errorCode: "provider-error",
      }),
    ).toEqual({
      email: "ada@example.com",
      errorCode: "provider-error",
    });
  });
});
