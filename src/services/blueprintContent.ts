import type { BlueprintContent } from "@/lib/schemas/blueprint";
import { blueprintContentSeed } from "@/lib/seed/blueprint";

export async function getBlueprintContent(): Promise<BlueprintContent> {
  return blueprintContentSeed;
}
