import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUTPUT_ROOT = path.resolve(process.cwd(), "public", "projects");
const WIDTH_1X = 1000;
const HEIGHT_1X = 750;
const WIDTH_2X = 2000;
const HEIGHT_2X = 1500;
const WEBP_QUALITY = 80;

const SPACE_GROTESK =
  "/usr/share/fonts/truetype/sand-box/google/Space Grotesk/SpaceGrotesk-VariableFont_wght.ttf";
const IBM_PLEX_MONO =
  "/usr/share/fonts/truetype/sand-box/google/IBM Plex Mono/IBMPlexMono-Bold.ttf";

export interface PlaceholderCover {
  slug: string;
  title: string;
  label: string;
}

export const PLACEHOLDER_COVERS: PlaceholderCover[] = [
  {
    slug: "golflinks",
    title: "Golflinks",
    label: "Code Avenue / 2020",
  },
  {
    slug: "grocery",
    title: "Grocery App",
    label: "Client app",
  },
  {
    slug: "high-end-crypto-demo",
    title: "High-End Crypto Demo",
    label: "BurjX / 2025",
  },
  {
    slug: "innerspark",
    title: "InnerSpark",
    label: "Upwork / 2025",
  },
  {
    slug: "freelance-android",
    title: "Freelance Android",
    label: "Freelancer.com / 2017-2020",
  },
];

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function wrapTitle(title: string, maxChars: number): string[] {
  const words = title.split(/\s+/u);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines.slice(0, 3);
}

function gridLines(width: number, height: number, step: number): string {
  const lines: string[] = [];
  for (let x = step; x < width; x += step) {
    lines.push(
      `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="#ffffff" stroke-opacity="0.04"/>`,
    );
  }
  for (let y = step; y < height; y += step) {
    lines.push(
      `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="#ffffff" stroke-opacity="0.04"/>`,
    );
  }
  return lines.join("");
}

export function placeholderCoverSvg(
  item: PlaceholderCover,
  width: number,
  height: number,
): string {
  const pad = Math.round(width * 0.08);
  const titleSize = Math.round(width * 0.072);
  const labelSize = Math.round(width * 0.018);
  const dot = Math.round(width * 0.012);
  const lines = wrapTitle(item.title, width >= 1600 ? 18 : 16);
  const lineHeight = Math.round(titleSize * 0.95);
  const titleTop = Math.round(height * 0.46);
  const titleXml = lines
    .map((line, index) => {
      const y = titleTop + index * lineHeight;
      return `<text x="${pad + dot * 3}" y="${y}" font-family="Space Grotesk, sans-serif" font-size="${titleSize}" font-weight="600" letter-spacing="-0.04em" fill="#e8eef5">${escapeXml(line)}</text>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>
      @font-face { font-family: "Space Grotesk"; src: url("file://${SPACE_GROTESK}"); }
      @font-face { font-family: "IBM Plex Mono"; src: url("file://${IBM_PLEX_MONO}"); }
    </style>
  </defs>
  <rect width="${width}" height="${height}" fill="#0a0e14"/>
  ${gridLines(width, height, Math.round(width * 0.05))}
  <text x="${pad}" y="${Math.round(height * 0.12)}" font-family="IBM Plex Mono, monospace" font-size="${labelSize}" fill="#8b9bb4">${escapeXml(item.label.toUpperCase())}</text>
  <circle cx="${pad + dot}" cy="${titleTop - Math.round(titleSize * 0.35)}" r="${dot}" fill="#22d3ee"/>
  ${titleXml}
</svg>`;
}

export async function writePlaceholderCover(item: PlaceholderCover): Promise<void> {
  const outputDir = path.join(OUTPUT_ROOT, item.slug);
  await mkdir(outputDir, { recursive: true });

  const svg1x = Buffer.from(placeholderCoverSvg(item, WIDTH_1X, HEIGHT_1X));
  const svg2x = Buffer.from(placeholderCoverSvg(item, WIDTH_2X, HEIGHT_2X));

  await sharp(svg1x)
    .webp({ quality: WEBP_QUALITY })
    .toFile(path.join(outputDir, "cover.webp"));
  await sharp(svg2x)
    .webp({ quality: WEBP_QUALITY })
    .toFile(path.join(outputDir, "cover@2x.webp"));
}

async function main(): Promise<void> {
  for (const item of PLACEHOLDER_COVERS) {
    await writePlaceholderCover(item);
    process.stdout.write(`Placeholder ${item.slug}\n`);
  }
}

const invokedDirectly = process.argv[1]?.endsWith(
  "generate-placeholder-covers.ts",
);

if (invokedDirectly) {
  main().catch((error: unknown) => {
    const message =
      error instanceof Error ? error.message : "Placeholder cover generation failed";
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  });
}
