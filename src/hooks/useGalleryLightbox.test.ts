import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useGalleryLightbox } from "./useGalleryLightbox";

describe("useGalleryLightbox", () => {
  it("opens, wraps next and previous, and closes", () => {
    const { result } = renderHook(() => useGalleryLightbox(3));

    act(() => {
      result.current.open(2);
    });
    expect(result.current.index).toBe(2);
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.next();
    });
    expect(result.current.index).toBe(0);

    act(() => {
      result.current.prev();
    });
    expect(result.current.index).toBe(2);

    act(() => {
      result.current.close();
    });
    expect(result.current.index).toBeNull();
    expect(result.current.isOpen).toBe(false);
  });
});
