import { isStaticExport } from "@/lib/env";

export function imageUnoptimized(): boolean {
  return isStaticExport();
}
