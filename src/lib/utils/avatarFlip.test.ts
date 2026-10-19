import { describe, expect, it } from "vitest";
import { avatarFlipFaces } from "./avatarFlip";

describe("avatarFlipFaces", () => {
  it("keeps a single image static", () => {
    expect(avatarFlipFaces(3, 1)).toEqual({
      flipped: false,
      frontIndex: 0,
      backIndex: 0,
    });
  });

  it("ping-pongs two images without changing hidden faces mid-flip", () => {
    expect(avatarFlipFaces(0, 2)).toEqual({
      flipped: false,
      frontIndex: 0,
      backIndex: 1,
    });
    expect(avatarFlipFaces(1, 2)).toEqual({
      flipped: true,
      frontIndex: 0,
      backIndex: 1,
    });
    expect(avatarFlipFaces(2, 2)).toEqual({
      flipped: false,
      frontIndex: 0,
      backIndex: 1,
    });
  });

  it("cycles three images by updating only the hidden face", () => {
    expect(avatarFlipFaces(1, 3)).toEqual({
      flipped: true,
      frontIndex: 0,
      backIndex: 1,
    });
    expect(avatarFlipFaces(2, 3)).toEqual({
      flipped: false,
      frontIndex: 2,
      backIndex: 1,
    });
    expect(avatarFlipFaces(3, 3)).toEqual({
      flipped: true,
      frontIndex: 2,
      backIndex: 0,
    });
  });
});
