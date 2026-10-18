import { describe, expect, it } from "vitest";
import { ADMIN_EMAIL, isAdmin } from "./admin";

describe("isAdmin", () => {
  it("accepts the verified admin email", () => {
    expect(
      isAdmin({ email: ADMIN_EMAIL, emailVerified: true }),
    ).toBe(true);
  });

  it("matches the admin email regardless of case", () => {
    expect(
      isAdmin({
        email: "HunainHumail786@gmail.com",
        emailVerified: true,
      }),
    ).toBe(true);
  });

  it("rejects a different verified account", () => {
    expect(
      isAdmin({ email: "someone@example.com", emailVerified: true }),
    ).toBe(false);
  });

  it("rejects the admin email when it is not verified", () => {
    expect(
      isAdmin({ email: ADMIN_EMAIL, emailVerified: false }),
    ).toBe(false);
  });

  it("rejects missing users and empty emails", () => {
    expect(isAdmin(null)).toBe(false);
    expect(isAdmin(undefined)).toBe(false);
    expect(isAdmin({ email: null, emailVerified: true })).toBe(false);
    expect(isAdmin({ email: "", emailVerified: true })).toBe(false);
  });
});
