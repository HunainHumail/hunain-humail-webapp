import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getCollectionConfig } from "@/lib/admin/collections";
import { toRecord } from "@/lib/admin/record";
import { storySeed } from "@/lib/seed/story";
import { useDocEditor } from "./useDocEditor";

const story = storySeed[0];

describe("useDocEditor", () => {
  it("tracks dirty state, blocks an invalid save, and writes a valid one", async () => {
    if (!story) {
      throw new Error("Missing story seed");
    }
    const config = getCollectionConfig("story");
    const onSave = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useDocEditor({
        schema: config.schema,
        fields: config.fields,
        initial: toRecord(story),
        onSave,
      }),
    );

    expect(result.current.dirty).toBe(false);

    act(() => {
      result.current.update("title", "");
    });
    expect(result.current.dirty).toBe(true);

    let saved = true;
    await act(async () => {
      saved = await result.current.save();
    });
    expect(saved).toBe(false);
    expect(result.current.errors.title).toBeTruthy();
    expect(onSave).not.toHaveBeenCalled();

    act(() => {
      result.current.update("title", "Android freelancer");
    });
    await act(async () => {
      saved = await result.current.save();
    });
    expect(saved).toBe(true);
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Android freelancer", id: story.id }),
    );
    expect(result.current.dirty).toBe(false);
  });
});
