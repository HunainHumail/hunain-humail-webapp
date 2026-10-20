import * as esbuild from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

await esbuild.build({
  entryPoints: [path.join(root, "functions/src/index.ts")],
  outfile: path.join(root, "functions/lib/index.js"),
  bundle: true,
  platform: "node",
  target: "node22",
  format: "cjs",
  alias: {
    "@": path.join(root, "src"),
  },
  external: ["firebase-functions", "firebase-admin", "@google/genai"],
});
