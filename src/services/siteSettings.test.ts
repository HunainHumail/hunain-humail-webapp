import { afterEach, describe, expect, it, vi } from "vitest";
import { isFirebaseConfigured } from "@/lib/env";
import { settingsRepository } from "@/lib/firebase";
import { siteSettingsSeed } from "@/lib/seed/settings";
import { getSiteSettings } from "./siteSettings";

vi.mock("@/lib/env", () => ({
  isFirebaseConfigured: vi.fn(() => false),
}));

vi.mock("@/lib/firebase", () => ({
  SETTINGS_DOC_ID: "site",
  settingsRepository: {
    getById: vi.fn(),
  },
}));

describe("getSiteSettings", () => {
  afterEach(() => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(false);
    vi.mocked(settingsRepository.getById).mockReset();
  });

  it("returns validated seed settings when Firebase is not configured", async () => {
    const settings = await getSiteSettings();
    expect(settings.nav).toHaveLength(5);
    expect(settings.nav[0].label).toBe("Story");
    expect(settings.socials.length).toBeGreaterThan(0);
    expect(settings.seo.title).toBe("Hunain Humail");
    expect(settings.contact).toEqual({
      email: "raohunain@hotmail.com",
      intro: "Open to freelance builds, consulting and interesting roles.",
      options: ["Freelance", "Consulting", "Roles"],
    });
    expect(settingsRepository.getById).not.toHaveBeenCalled();
  });

  it("returns the repository document when Firebase is configured", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(settingsRepository.getById).mockResolvedValue({
      ...siteSettingsSeed,
      seo: {
        ...siteSettingsSeed.seo,
        title: "From Firestore",
      },
    });

    const settings = await getSiteSettings();
    expect(settings.seo.title).toBe("From Firestore");
    expect(settingsRepository.getById).toHaveBeenCalledWith("site");
  });

  it("falls back to seed when the repository throws", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(settingsRepository.getById).mockRejectedValue(
      new Error("offline"),
    );

    const settings = await getSiteSettings();
    expect(settings.seo.title).toBe(siteSettingsSeed.seo.title);
  });
});
