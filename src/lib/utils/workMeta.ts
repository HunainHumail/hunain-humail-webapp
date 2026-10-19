export function workMetaLabel(item: {
  company?: string;
  period?: string;
}): string | undefined {
  const parts = [item.company, item.period].filter(
    (part): part is string => Boolean(part),
  );
  return parts.length > 0 ? parts.join(" · ") : undefined;
}
