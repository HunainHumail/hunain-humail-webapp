import { afterEach, describe, expect, it, vi } from "vitest";
import { isFirebaseConfigured } from "@/lib/env";
import { settingsRepository } from "@/lib/firebase";
import { siteSettingsSeed } from "@/lib/seed/settings";
import { LINKEDIN_PROFILE_URL } from "@/lib/utils/rewriteLinkedInUrls";
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

  it("falls back to seed when the settings document is missing", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(settingsRepository.getById).mockResolvedValue(null);

    const settings = await getSiteSettings();
    expect(settings.seo.title).toBe(siteSettingsSeed.seo.title);
  });

  it("rewrites a stale linkedin slug from Firestore", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(settingsRepository.getById).mockResolvedValue({
      ...siteSettingsSeed,
      socials: siteSettingsSeed.socials.map((social) =>
        social.icon === "linkedin"
          ? { ...social, href: "https://www.linkedin.com/in/hunainhumail" }
          : social,
      ),
    });

    const settings = await getSiteSettings();
    expect(
      settings.socials.find((social) => social.icon === "linkedin")?.href,
    ).toBe(LINKEDIN_PROFILE_URL);
    expect(
      settings.socials.find((social) => social.icon === "github")?.href,
    ).toBe("https://github.com/hunainhumail");
    expect(
      settings.socials.find((social) => social.icon === "mail")?.href,
    ).toBe("mailto:raohunain@hotmail.com");
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
