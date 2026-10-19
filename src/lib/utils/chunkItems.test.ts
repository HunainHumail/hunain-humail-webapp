import { describe, expect, it } from "vitest";
import { FIRESTORE_WRITE_CHUNK_SIZE, chunkItems } from "./chunkItems";

describe("chunkItems", () => {
  it("keeps Firestore batches under the 500-op limit", () => {
    expect(FIRESTORE_WRITE_CHUNK_SIZE).toBeLessThan(500);
    expect(FIRESTORE_WRITE_CHUNK_SIZE).toBeLessThanOrEqual(450);

    const items = Array.from({ length: 451 }, (_, index) => index);
    const chunks = chunkItems(items);

    expect(chunks).toHaveLength(2);
    expect(chunks[0]).toHaveLength(FIRESTORE_WRITE_CHUNK_SIZE);
    expect(chunks[1]).toEqual([450]);
    expect(chunks.every((chunk) => chunk.length <= 450)).toBe(true);
  });

  it("returns an empty list for no items", () => {
    expect(chunkItems([])).toEqual([]);
  });
});
