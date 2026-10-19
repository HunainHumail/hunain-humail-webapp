import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SOURCE_ROOT = process.env.PROJECTS_SOURCE ?? "/workspace/Projects";
const OUTPUT_ROOT = path.resolve(process.cwd(), "public", "projects");
const WEBP_QUALITY = 80;

const PROJECTS: { folder: string; slug: string }[] = [
  { folder: "Boon & Bliss", slug: "boon-and-bliss" },
  { folder: "Coachendo (Urkip)", slug: "coachendo" },
  { folder: "MH1", slug: "mh1" },
  { folder: "OmanOil", slug: "omanoil" },
  { folder: "Royal Gas (Abu Dhabi)", slug: "royal-gas" },
  { folder: "ShopScope", slug: "shopscope" },
  { folder: "TickFilm", slug: "tickfilm" },
];

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function convertCover(
  inputPath: string,
  outputPath: string,
  width: number,
  height: number,
): Promise<void> {
  await sharp(inputPath)
    .rotate()
    .resize(width, height, { fit: "cover", position: "attention" })
    .webp({ quality: WEBP_QUALITY })
    .toFile(outputPath);
}

async function importCovers(): Promise<void> {
  for (const project of PROJECTS) {
    const source = path.join(SOURCE_ROOT, project.folder, "01.png");
    if (!(await fileExists(source))) {
      throw new Error(`Missing 01.png for ${project.folder}`);
    }

    const outputDir = path.join(OUTPUT_ROOT, project.slug);
    await mkdir(outputDir, { recursive: true });
    await convertCover(source, path.join(outputDir, "cover.webp"), 1000, 750);
    await convertCover(source, path.join(outputDir, "cover@2x.webp"), 2000, 1500);
    process.stdout.write(`Imported ${project.slug}\n`);
  }
}

importCovers().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Screenshot cover import failed";
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
