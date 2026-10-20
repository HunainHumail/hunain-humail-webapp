import { describe, expect, it } from "vitest";
import { layoutBlocks, type LayoutBlock } from "./layoutBlocks";

function intersects(a: LayoutBlock, b: LayoutBlock): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

describe("layoutBlocks", () => {
  it("keeps a mobile MVP screen inside the frame without overlapping the tab bar", () => {
    const laid = layoutBlocks("mobile", [
      { type: "header", label: "Nearby" },
      { type: "list", label: "Shops", items: ["Fade Room", "North Clip", "Walk-in"] },
      { type: "form", label: "Visit", items: ["Your name", "Service", "Time"] },
      { type: "button", label: "Confirm visit" },
      { type: "tabbar", label: "Home" },
    ]);

    const tabbar = laid.find((block) => block.type === "tabbar");
    expect(tabbar).toBeDefined();
    const content = laid.filter((block) => block.type !== "tabbar");

    for (const block of content) {
      expect(block.y + block.h).toBeLessThanOrEqual(tabbar?.y ?? 0);
    }

    for (let i = 0; i < laid.length; i += 1) {
      for (let j = i + 1; j < laid.length; j += 1) {
        const left = laid[i];
        const right = laid[j];
        if (left && right) {
          expect(intersects(left, right)).toBe(false);
        }
      }
    }
  });
});
