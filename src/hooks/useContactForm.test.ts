import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { submitContactMessage } from "@/services/contact";
import { useContactForm } from "./useContactForm";

vi.mock("@/services/contact", () => ({
  submitContactMessage: vi.fn(),
}));

const options = ["Freelance", "Consulting", "Roles"] as const;

async function fillValid(result: {
  current: ReturnType<typeof useContactForm>;
}) {
  act(() => {
    result.current.setField("name", "Ada Lovelace");
    result.current.setField("email", "ada@example.com");
    result.current.setField("topic", "Consulting");
    result.current.setField(
      "message",
      "I would like to build an agentic workflow.",
    );
  });
}

describe("useContactForm", () => {
  afterEach(() => {
    vi.mocked(submitContactMessage).mockReset();
  });

  it("starts idle with the first topic and no errors", () => {
    const { result } = renderHook(() => useContactForm(options));

    expect(result.current.status).toBe("idle");
    expect(result.current.submitting).toBe(false);
    expect(result.current.errors).toEqual({});
    expect(result.current.values.topic).toBe("Freelance");
  });

  it("sets validation errors and does not submit", async () => {
    const { result } = renderHook(() => useContactForm(options));

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors.name).toBe("Name is required");
    expect(result.current.errors.email).toBe("Enter a valid email");
    expect(result.current.errors.message).toBe(
      "Message must be at least 10 characters",
    );
    expect(submitContactMessage).not.toHaveBeenCalled();
    expect(result.current.status).toBe("idle");
  });

  it("submits valid values and sets success", async () => {
    vi.mocked(submitContactMessage).mockResolvedValue({
      ok: true,
      id: "mock-message",
    });
    const { result } = renderHook(() => useContactForm(options));

    await fillValid(result);
    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(submitContactMessage).toHaveBeenCalledWith({
      name: "Ada Lovelace",
      email: "ada@example.com",
      topic: "Consulting",
      message: "I would like to build an agentic workflow.",
      honeypot: "",
    });
    expect(result.current.status).toBe("success");
    expect(result.current.submitting).toBe(false);
    expect(result.current.values.name).toBe("");
  });

  it("sets an error status when submit fails", async () => {
    vi.mocked(submitContactMessage).mockRejectedValue(new Error("offline"));
    const { result } = renderHook(() => useContactForm(options));

    await fillValid(result);
    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.status).toBe("error");
    expect(result.current.submitError).toBe(
      "Something went wrong. Try again or email me directly.",
    );
    expect(result.current.submitting).toBe(false);
  });
});
