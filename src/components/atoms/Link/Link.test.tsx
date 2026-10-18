import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Link } from "./Link";

const LINKEDIN = "https://www.linkedin.com/in/hunain-humail";

describe("Link", () => {
  it("renders internal link", () => {
    render(<Link href="/work">Work</Link>);
    const link = screen.getByRole("link", { name: "Work" });
    expect(link).toHaveAttribute("href", "/work");
    expect(link).not.toHaveAttribute("target");
  });

  it("renders absolute https urls as a plain anchor with the exact href", () => {
    render(<Link href={LINKEDIN}>LinkedIn</Link>);
    const link = screen.getByRole("link", { name: "LinkedIn" });
    expect(link.tagName).toBe("A");
    expect(link.getAttribute("href")).toBe(LINKEDIN);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("does not prefix a base path or append a trailing slash", () => {
    render(<Link href={LINKEDIN}>LinkedIn</Link>);
    const href = screen.getByRole("link", { name: "LinkedIn" }).getAttribute("href");
    expect(href).toBe(LINKEDIN);
    expect(href?.startsWith("https://")).toBe(true);
    expect(href?.startsWith("/")).toBe(false);
    expect(href?.endsWith("/")).toBe(false);
  });

  it("promotes a protocol-less host so next/link cannot treat it as a route", () => {
    render(<Link href="linkedin.com/in/hunainhumail">LinkedIn</Link>);
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      LINKEDIN,
    );
  });

  it("keeps github and mailto absolute and external", () => {
    render(
      <>
        <Link href="https://github.com/hunainhumail">GitHub</Link>
        <Link href="mailto:raohunain@hotmail.com">Email</Link>
        <Link href="//x.com/example">X</Link>
      </>,
    );
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/hunainhumail",
    );
    const email = screen.getByRole("link", { name: "Email" });
    expect(email).toHaveAttribute("href", "mailto:raohunain@hotmail.com");
    expect(email).toHaveAttribute("target", "_blank");
    expect(email).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("link", { name: "X" })).toHaveAttribute(
      "href",
      "https://x.com/example",
    );
  });
});
