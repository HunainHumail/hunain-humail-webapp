import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SOURCE_ROOT =
  process.env.COVER_SOURCE ?? "/workspace/To be uploaded";
const OUTPUT_ROOT = path.resolve(process.cwd(), "public", "projects");
const WEBP_QUALITY = 80;

const PROJECTS: { folder: string; slug: string }[] = [
  { folder: "Al Rayyan TV (Qatar)", slug: "al-rayyan-tv" },
  { folder: "Banoon (Riyadh)", slug: "banoon" },
  { folder: "Bring itt (Traer)", slug: "bring-itt" },
  { folder: "Emdee Healthcare App", slug: "emdee" },
  { folder: "Escrow Trakker for Landlords", slug: "escrow-trakker-landlords" },
  { folder: "Escrow Trakker for Lawyers", slug: "escrow-trakker-lawyers" },
  { folder: "Fast Brix", slug: "fast-brix" },
  { folder: "I-Sense CRM (My Float by I-Sense)", slug: "my-float" },
  { folder: "Lions Clubs Connect", slug: "lions-clubs-connect" },
  { folder: "LuvIQ", slug: "luviq" },
  { folder: "Savesor Smart Hotel Rooms", slug: "savesor" },
  { folder: "Tecobi", slug: "tecobi" },
  { folder: "Terranzo", slug: "terranzo" },
  { folder: "Trinnect", slug: "trinnect" },
  { folder: "Vigil", slug: "vigil" },
  { folder: "Wellspent Screen Time SDK", slug: "wellspent" },
];

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function convertCover(inputPath: string, outputPath: string, width: number, height: number) {
  await sharp(inputPath)
    .resize(width, height, { fit: "cover", withoutEnlargement: false })
    .webp({ quality: WEBP_QUALITY })
    .toFile(outputPath);
}

async function importCovers(): Promise<void> {
  for (const project of PROJECTS) {
    const sourceDir = path.join(SOURCE_ROOT, project.folder);
    const outputDir = path.join(OUTPUT_ROOT, project.slug);
    const cover1x = path.join(sourceDir, "cover.png");
    const cover2x = path.join(sourceDir, "cover@2x.png");

    if (!(await fileExists(cover1x))) {
      throw new Error(`Missing cover.png for ${project.folder}`);
    }

    await mkdir(outputDir, { recursive: true });

    const out1x = path.join(outputDir, "cover.webp");
    const out2x = path.join(outputDir, "cover@2x.webp");

    await convertCover(cover1x, out1x, 1000, 750);

    if (await fileExists(cover2x)) {
      await convertCover(cover2x, out2x, 2000, 1500);
    } else {
      await convertCover(cover1x, out2x, 2000, 1500);
    }

    process.stdout.write(`Imported ${project.slug}\n`);
  }
}

importCovers().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Cover import failed";
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
