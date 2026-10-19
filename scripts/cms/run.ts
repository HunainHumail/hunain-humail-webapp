import { parseCmsArgs } from "./args";
import { runCmsCommand } from "./commands";
import { getCmsFirebaseConfig } from "./loadEnv";

export async function runCms(
  argv: readonly string[],
  runtimeOverrides: Partial<import("./commands").CmsRuntime> = {},
): Promise<number> {
  try {
    const args = parseCmsArgs(argv);
    const config = getCmsFirebaseConfig();
    await runCmsCommand(args, {
      apiKey: config.apiKey,
      projectId: config.projectId,
      ...runtimeOverrides,
    });
    return 0;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "CMS command failed";
    (runtimeOverrides.stderr ?? process.stderr).write(`${message}\n`);
    return 1;
  }
}
