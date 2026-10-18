export function reorderCollectionIds(
  ids: readonly string[],
  activeId: string,
  overId: string | null,
): string[] | null {
  if (!overId || activeId === overId) {
    return null;
  }
  const oldIndex = ids.indexOf(activeId);
  const newIndex = ids.indexOf(overId);
  if (oldIndex < 0 || newIndex < 0) {
    return null;
  }
  const next = ids.slice();
  const [moved] = next.splice(oldIndex, 1);
  if (!moved) {
    return null;
  }
  next.splice(newIndex, 0, moved);
  return next;
}
