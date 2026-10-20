import type { ProfileCta } from "@/lib/schemas/profile";

export function heroCtas(
  ctas: readonly ProfileCta[],
  blueprintEnabled: boolean,
): ProfileCta[] {
  if (blueprintEnabled) {
    return [...ctas];
  }
  return ctas.filter((cta) => !cta.href.endsWith("#blueprint"));
}
