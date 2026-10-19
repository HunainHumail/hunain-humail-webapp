import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AVATAR_FLIP_INTERVAL_MS } from "@/lib/utils/avatarFlip";
import { ProfileAvatar } from "./ProfileAvatar";

vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: vi.fn(() => false),
}));

const github = { src: "/avatar/github.webp", alt: "Hunain Humail" };
const linkedin = { src: "/avatar/linkedin.webp", alt: "Hunain Humail portrait" };

describe("ProfileAvatar", () => {
  beforeEach(() => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders the image and alt", () => {
    render(<ProfileAvatar images={[github]} />);
    expect(screen.getByRole("img", { name: github.alt })).toHaveAttribute(
      "src",
      github.src,
    );
  });

  it("flips on the interval when two images are present", () => {
    vi.useFakeTimers();
    const { container } = render(<ProfileAvatar images={[github, linkedin]} />);
    const card = container.querySelector(".avatar-flip-card");
    expect(card).toBeTruthy();
    expect(card).not.toHaveClass("is-flipped");
    expect(screen.getByRole("img", { name: github.alt })).toHaveAttribute(
      "src",
      github.src,
    );

    act(() => {
      vi.advanceTimersByTime(AVATAR_FLIP_INTERVAL_MS);
    });

    expect(card).toHaveClass("is-flipped");
    expect(screen.getByRole("img", { name: linkedin.alt })).toHaveAttribute(
      "src",
      linkedin.src,
    );
  });

  it("does not start an interval with one image", () => {
    const spy = vi.spyOn(window, "setInterval");
    render(<ProfileAvatar images={[github]} />);
    expect(spy).not.toHaveBeenCalled();
    expect(document.querySelector(".avatar-flip-card")).not.toBeInTheDocument();
  });

  it("does not start an interval when reduced motion is on", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    const spy = vi.spyOn(window, "setInterval");
    render(<ProfileAvatar images={[github, linkedin]} />);
    expect(spy).not.toHaveBeenCalled();
    expect(screen.getByRole("img", { name: github.alt })).toBeInTheDocument();
    expect(
      screen.queryByRole("img", { name: linkedin.alt }),
    ).not.toBeInTheDocument();
    expect(document.querySelector(".avatar-flip-card")).not.toBeInTheDocument();
  });
});
