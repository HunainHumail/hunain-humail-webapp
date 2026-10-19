import { mkdtempSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  credentialsPath,
  deleteCredentials,
  readCredentials,
  writeCredentials,
} from "./credentials";

describe("CMS credentials file", () => {
  it("writes mode 600 in a 700 directory and can be removed", () => {
    const configDir = mkdtempSync(join(tmpdir(), "hh-cms-"));
    const stored = writeCredentials(
      { refreshToken: "refresh-1", email: "hunainhumail786@gmail.com" },
      configDir,
    );

    expect(stored).toBe(credentialsPath(configDir));
    expect(statSync(configDir).mode & 0o777).toBe(0o700);
    expect(statSync(stored).mode & 0o777).toBe(0o600);
    expect(readCredentials(configDir)).toEqual({
      refreshToken: "refresh-1",
      email: "hunainhumail786@gmail.com",
    });
    expect(deleteCredentials(configDir)).toBe(true);
    expect(readCredentials(configDir)).toBeNull();
  });
});
