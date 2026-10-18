export function workCoverSrc(
  coverUrl: string,
  variant: "1x" | "2x" = "1x",
): string {
  if (variant === "2x") {
    return coverUrl.replace(/cover\.webp$/u, "cover@2x.webp");
  }

  return coverUrl;
}

export function workCoverAlt(title: string): string {
  return `${title} cover`;
}
