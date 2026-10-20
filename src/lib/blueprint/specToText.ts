import type { BlueprintSpec } from "@/lib/schemas/blueprint";

export function specToText(spec: BlueprintSpec): string {
  const lines: string[] = [
    spec.appName,
    "",
    spec.summary,
    "",
    `For: ${spec.audience}`,
    `First version: ${spec.mvp}`,
    "",
    "Assumptions:",
    ...spec.assumptions.map((item) => `- ${item}`),
    "",
    "Later:",
    ...spec.later.map((item) => `- ${item}`),
    "",
    "Screens:",
  ];

  for (const screen of spec.screens) {
    lines.push(`- ${screen.title}: ${screen.purpose}`);
  }

  lines.push("", "Features:");
  for (const feature of spec.features) {
    lines.push(`- ${feature}`);
  }

  return lines.join("\n");
}

export function buildContactPrefill(
  spec: BlueprintSpec,
  idea: string,
): string {
  const message = [
    `Blueprint: ${spec.appName}`,
    "",
    `First version: ${spec.mvp}`,
    spec.summary,
    "",
    `Idea: ${idea}`,
  ].join("\n");
  return message.length > 2000 ? message.slice(0, 2000) : message;
}
