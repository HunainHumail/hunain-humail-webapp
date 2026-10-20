#!/usr/bin/env node
/**
 * Upload Gemini + hash salt to Firebase Secret Manager (never commit keys to git).
 *
 *   npx firebase login
 *   GEMINI_API_KEY="your-key" npm run setup:blueprint-secrets
 */
import { randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const project = process.env.FIREBASE_PROJECT ?? "hunain-humail-webapp";
const firebaseBin = path.join(root, "node_modules", ".bin", "firebase");

function runFirebase(args, input) {
  const result = spawnSync(firebaseBin, args, {
    cwd: root,
    input,
    encoding: "utf8",
    stdio: ["pipe", "inherit", "inherit"],
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function main() {
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  if (!geminiKey) {
    process.stderr.write(
      "Usage: GEMINI_API_KEY=\"your-key\" npm run setup:blueprint-secrets\n",
    );
    process.exit(1);
  }

  const salt =
    process.env.BLUEPRINT_HASH_SALT?.trim() ?? randomBytes(32).toString("hex");

  process.stderr.write(`Project: ${project}\n`);
  process.stderr.write("Setting GEMINI_API_KEY…\n");
  runFirebase(
    [
      "functions:secrets:set",
      "GEMINI_API_KEY",
      "--data-file",
      "-",
      "--project",
      project,
      "--force",
    ],
    geminiKey,
  );

  process.stderr.write("Setting BLUEPRINT_HASH_SALT…\n");
  runFirebase(
    [
      "functions:secrets:set",
      "BLUEPRINT_HASH_SALT",
      "--data-file",
      "-",
      "--project",
      project,
      "--force",
    ],
    salt,
  );

  process.stderr.write(
    "\nSecrets saved. Fill .env.local (Firebase + RECAPTCHA), then: npm run deploy:blueprint\n",
  );
}

main();
