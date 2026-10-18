import { beforeEach, describe, expect, it, vi } from "vitest";
import { ADMIN_EMAIL } from "@/lib/admin";
import { PROFILE_DOC_ID, SETTINGS_DOC_ID } from "@/lib/firebase/constants";
import { nowSeed } from "@/lib/seed/now";
import { profileSeed } from "@/lib/seed/profile";
import { siteSettingsSeed } from "@/lib/seed/settings";
import { storySeed } from "@/lib/seed/story";
import { workSeed } from "@/lib/seed/work";
import { writingSeed } from "@/lib/seed/writing";

const repos = vi.hoisted(() => ({
  profile: { upsert: vi.fn() },
  settings: { upsert: vi.fn() },
  story: { upsert: vi.fn() },
  now: { upsert: vi.fn() },
  work: { upsert: vi.fn() },
  writing: { upsert: vi.fn() },
}));

const getFirebaseAuth = vi.hoisted(() => vi.fn());

vi.mock("@/lib/firebase/client", () => ({
  getFirebaseAuth: () => getFirebaseAuth(),
}));

vi.mock("@/lib/firebase/repositories", () => ({
  profileRepository: repos.profile,
  settingsRepository: repos.settings,
  storyRepository: repos.story,
  nowRepository: repos.now,
  workRepository: repos.work,
  writingRepository: repos.writing,
}));

describe("importSeedData", () => {
  beforeEach(() => {
    getFirebaseAuth.mockReset();
    for (const repo of Object.values(repos)) {
      repo.upsert.mockReset();
      repo.upsert.mockResolvedValue(undefined);
    }
  });

  it("refuses to write when the signed-in user is not the admin", async () => {
    getFirebaseAuth.mockReturnValue({ currentUser: null });
    const { importSeedData } = await import("./importSeed");
    await expect(importSeedData()).rejects.toThrow(
      "Only the admin can import seed data",
    );
    expect(repos.profile.upsert).not.toHaveBeenCalled();
  });

  it("writes every seed collection for the admin", async () => {
    getFirebaseAuth.mockReturnValue({
      currentUser: { email: ADMIN_EMAIL, emailVerified: true },
    });
    const { importSeedData } = await import("./importSeed");
    await importSeedData();
    expect(repos.profile.upsert).toHaveBeenCalledWith(
      PROFILE_DOC_ID,
      profileSeed,
    );
    expect(repos.settings.upsert).toHaveBeenCalledWith(
      SETTINGS_DOC_ID,
      siteSettingsSeed,
    );
    expect(repos.story.upsert).toHaveBeenCalledTimes(storySeed.length);
    expect(repos.now.upsert).toHaveBeenCalledTimes(nowSeed.length);
    expect(repos.work.upsert).toHaveBeenCalledTimes(workSeed.length);
    expect(repos.writing.upsert).toHaveBeenCalledTimes(writingSeed.length);
  });
});
