import { loadCmsEnv } from "./cms/loadEnv";

loadCmsEnv();

async function main(): Promise<void> {
  const { runCms } = await import("./cms/run");
  process.exitCode = await runCms(process.argv.slice(2));
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "CMS command failed";
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
