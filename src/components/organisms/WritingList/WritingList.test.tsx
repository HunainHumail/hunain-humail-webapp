import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { linkedinPosts } from "@/content/linkedin-posts";
import { writingSeed } from "@/lib/seed/writing";
import { LINKEDIN_PROFILE_URL } from "@/lib/utils/rewriteLinkedInUrls";
import { getLinkedInWritingItems } from "@/services/writing";
import { WritingList } from "./WritingList";

vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => true,
}));

const items = [...getLinkedInWritingItems(), ...writingSeed];

describe("WritingList", () => {
  it("renders LinkedIn posts as the top cards, then talks and awards", () => {
    render(<WritingList items={items} />);

    expect(screen.getByText("Writing")).toBeInTheDocument();
    expect(screen.getByText("04")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Thinking out loud." }),
    ).toBeInTheDocument();
    expect(document.getElementById("writing")).toBeInTheDocument();

    const posts = screen.getByRole("list", { name: "Posts" });
    const talks = screen.getByRole("list", { name: "Talks" });
    const awards = screen.getByRole("list", { name: "Awards" });

    expect(posts.compareDocumentPosition(talks) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(talks.compareDocumentPosition(awards) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );

    const postLinks = within(posts).getAllByRole("link");
    expect(postLinks).toHaveLength(3);
    expect(postLinks.map((link) => link.getAttribute("href"))).toEqual(
      linkedinPosts.map((post) => post.url),
    );
    for (const link of postLinks) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link).toHaveTextContent("View on LinkedIn");
    }

    expect(
      screen.getByRole("heading", { level: 3, name: "Speaker" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Winner" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Filter writing by type" }),
    ).toBeInTheDocument();
  });

  it("filters rows by type", async () => {
    const user = userEvent.setup();
    render(<WritingList items={items} />);

    const filters = screen.getByRole("group", {
      name: "Filter writing by type",
    });
    await user.click(within(filters).getByRole("button", { name: "Talks" }));

    expect(
      screen.getByRole("heading", { level: 3, name: "Speaker" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 3, name: "Winner" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        level: 3,
        name: linkedinPosts[0]?.title,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("list", { name: "Writing and talks" }),
    ).toBeInTheDocument();

    await user.click(within(filters).getByRole("button", { name: "All" }));
    expect(
      screen.getByRole("heading", { level: 3, name: "Winner" }),
    ).toBeInTheDocument();
  });

  it("does not point writing cards at the profile URL", () => {
    render(<WritingList items={items} />);
    const posts = screen.getByRole("list", { name: "Posts" });
    for (const link of within(posts).getAllByRole("link")) {
      expect(link).not.toHaveAttribute("href", LINKEDIN_PROFILE_URL);
    }
  });
});
