export const FIRESTORE_WRITE_CHUNK_SIZE = 450;

export function chunkItems<T>(
  items: readonly T[],
  size = FIRESTORE_WRITE_CHUNK_SIZE,
): T[][] {
  if (size < 1) {
    throw new Error("chunk size must be at least 1");
  }

  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}
