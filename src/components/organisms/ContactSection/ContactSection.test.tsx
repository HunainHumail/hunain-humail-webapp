import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { submitContactMessage } from "@/services/contact";
import { siteSettingsSeed } from "@/lib/seed/settings";
import { ContactSection } from "./ContactSection";

vi.mock("@/services/contact", () => ({
  submitContactMessage: vi.fn(),
}));

const contact = siteSettingsSeed.contact;

describe("ContactSection", () => {
  afterEach(() => {
    vi.mocked(submitContactMessage).mockReset();
  });

  it("renders the invitation, mailto link, and form", () => {
    render(<ContactSection contact={contact} />);

    expect(screen.getByText("05 · Work with me")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Got something to build?",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(contact.intro)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: contact.email }),
    ).toHaveAttribute("href", `mailto:${contact.email}`);
    expect(document.getElementById("contact")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Email" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Topic" })).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Message" }),
    ).toBeInTheDocument();
  });

  it("shows validation errors when submitted empty", async () => {
    const user = userEvent.setup();
    render(<ContactSection contact={contact} />);

    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid email")).toBeInTheDocument();
    expect(
      screen.getByText("Message must be at least 10 characters"),
    ).toBeInTheDocument();
    expect(submitContactMessage).not.toHaveBeenCalled();
  });

  it("submits the form and shows the success state", async () => {
    vi.mocked(submitContactMessage).mockResolvedValue({
      ok: true,
      id: "mock-message",
    });
    const user = userEvent.setup();
    render(<ContactSection contact={contact} />);

    await user.type(screen.getByRole("textbox", { name: "Name" }), "Ada Lovelace");
    await user.type(
      screen.getByRole("textbox", { name: "Email" }),
      "ada@example.com",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Topic" }),
      "Roles",
    );
    await user.type(
      screen.getByRole("textbox", { name: "Message" }),
      "I would like to talk about a role.",
    );
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(submitContactMessage).toHaveBeenCalledWith({
      name: "Ada Lovelace",
      email: "ada@example.com",
      topic: "Roles",
      message: "I would like to talk about a role.",
      honeypot: "",
    });
    expect(
      await screen.findByRole("status"),
    ).toHaveTextContent("Thanks. Your message is on its way.");
    expect(
      screen.queryByRole("button", { name: "Send message" }),
    ).not.toBeInTheDocument();
  });
});
