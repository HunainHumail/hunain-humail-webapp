import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outDir = path.resolve(
  process.cwd(),
  "public",
  "projects",
  "white-label-vpn-sdk",
  "gallery",
);
const projectDir = path.resolve(
  process.cwd(),
  "public",
  "projects",
  "white-label-vpn-sdk",
);

const apps = [
  { folder: "/workspace/Projects/AviteoVPN", slug: "aviteovpn" },
  { folder: "/workspace/Projects/Digitunnel VPN", slug: "digitunnel-vpn" },
  { folder: "/workspace/Projects/GatewayVPN", slug: "gatewayvpn" },
  { folder: "/workspace/Projects/VpnSec", slug: "vpnsec" },
] as const;

async function main(): Promise<void> {
  await mkdir(outDir, { recursive: true });

  for (const app of apps) {
    for (let i = 1; i <= 8; i += 1) {
      const n = String(i).padStart(2, "0");
      const input = path.join(app.folder, `${n}.png`);
      const output = path.join(outDir, `${app.slug}-${n}.webp`);
      await sharp(input)
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(output);
      process.stdout.write(`wrote ${path.basename(output)}\n`);
    }
  }

  const cover2x = "/workspace/covers/samples/v2/gatewayvpn@2x.png";
  const cover1x = "/workspace/covers/samples/v2/gatewayvpn.png";

  await sharp(cover2x)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(path.join(outDir, "gatewayvpn-cover.webp"));
  process.stdout.write("wrote gatewayvpn-cover.webp\n");

  await sharp(cover1x)
    .resize(1000, 750, { fit: "cover" })
    .webp({ quality: 80 })
    .toFile(path.join(projectDir, "cover.webp"));
  await sharp(cover2x)
    .resize(2000, 1500, { fit: "cover" })
    .webp({ quality: 80 })
    .toFile(path.join(projectDir, "cover@2x.webp"));
  process.stdout.write("wrote cover.webp and cover@2x.webp\n");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "VPN gallery import failed";
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
