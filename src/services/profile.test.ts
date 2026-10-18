import { afterEach, describe, expect, it, vi } from "vitest";
import { isFirebaseConfigured } from "@/lib/env";
import { profileRepository } from "@/lib/firebase";
import { profileSeed } from "@/lib/seed/profile";
import { getProfile } from "./profile";

vi.mock("@/lib/env", () => ({
  isFirebaseConfigured: vi.fn(() => false),
}));

vi.mock("@/lib/firebase", () => ({
  PROFILE_DOC_ID: "main",
  profileRepository: {
    getById: vi.fn(),
  },
}));

describe("getProfile", () => {
  afterEach(() => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(false);
    vi.mocked(profileRepository.getById).mockReset();
  });

  it("returns validated published profile seed when Firebase is not configured", async () => {
    const profile = await getProfile();
    expect(profile.name).toBe("Hunain Humail");
    expect(profile.terminalLines.length).toBeGreaterThan(0);
    expect(profile.ctas[0].label).toBe("View work");
    expect(profileRepository.getById).not.toHaveBeenCalled();
  });

  it("returns the repository document when Firebase is configured", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(profileRepository.getById).mockResolvedValue({
      ...profileSeed,
      headline: "GenAI engineer from Firestore",
    });

    const profile = await getProfile();
    expect(profile.headline).toBe("GenAI engineer from Firestore");
    expect(profileRepository.getById).toHaveBeenCalledWith("main");
  });

  it("falls back to seed when the repository throws", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(profileRepository.getById).mockRejectedValue(
      new Error("offline"),
    );

    const profile = await getProfile();
    expect(profile.name).toBe("Hunain Humail");
    expect(profile.headline).toBe(profileSeed.headline);
  });
});
