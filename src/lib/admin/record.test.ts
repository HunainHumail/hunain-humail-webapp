import { describe, expect, it } from "vitest";
import {
  deletePath,
  getPath,
  setRecordPath,
  stripUndefined,
} from "./record";

describe("admin record paths", () => {
  it("reads and writes nested object and array paths without mutation", () => {
    const source = {
      contact: { email: "old@example.com" },
      terminalLines: [{ command: "whoami", output: "hunain" }],
    };

    const next = setRecordPath(
      source,
      "terminalLines.0.command",
      "pwd",
    );

    expect(getPath(next, "terminalLines.0.command")).toBe("pwd");
    expect(getPath(next, "contact.email")).toBe("old@example.com");
    expect(source.terminalLines[0]?.command).toBe("whoami");
  });

  it("deletes an empty optional nested field and strips undefined", () => {
    const source = {
      seo: { title: "Hunain", ogImage: "" },
      photoUrl: undefined,
    };
    const withoutImage = deletePath(source, "seo.ogImage");
    expect(withoutImage.seo).toEqual({ title: "Hunain" });
    expect(stripUndefined(source)).toEqual({
      seo: { title: "Hunain", ogImage: "" },
    });
  });
});
