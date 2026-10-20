import type { BlueprintBlock, BlueprintPlatform } from "@/lib/schemas/blueprint";

export interface FrameConfig {
  viewBox: string;
  width: number;
  height: number;
  safeX: number;
  safeY: number;
  safeW: number;
  safeH: number;
  headerH: number;
  tabbarH: number;
}

export const FRAME: Record<BlueprintPlatform, FrameConfig> = {
  mobile: {
    viewBox: "0 0 360 740",
    width: 360,
    height: 740,
    safeX: 24,
    safeY: 72,
    safeW: 312,
    safeH: 580,
    headerH: 48,
    tabbarH: 56,
  },
  web: {
    viewBox: "0 0 1280 800",
    width: 1280,
    height: 800,
    safeX: 200,
    safeY: 88,
    safeW: 1040,
    safeH: 640,
    headerH: 56,
    tabbarH: 0,
  },
};

export interface LayoutBlock {
  type: BlueprintBlock["type"];
  label: string;
  items: string[];
  x: number;
  y: number;
  w: number;
  h: number;
}

const GAP = 12;
export const FORM_ROW = 52;
export const LIST_ROW = 40;

export function blockRows(block: BlueprintBlock): number {
  if (block.items && block.items.length > 0) {
    return block.items.length;
  }
  if (block.count) {
    return block.count;
  }
  if (block.type === "list" || block.type === "form") {
    return 3;
  }
  return 1;
}

export function blockHeight(block: BlueprintBlock): number {
  const rows = blockRows(block);
  switch (block.type) {
    case "header":
      return 44;
    case "nav":
      return 40;
    case "button":
      return 40;
    case "image":
      return 88;
    case "card":
      return 96;
    case "list":
      return rows * LIST_ROW;
    case "form":
      return 8 + rows * FORM_ROW;
    default:
      return 36;
  }
}

export function layoutBlocks(
  platform: BlueprintPlatform,
  blocks: BlueprintBlock[],
): LayoutBlock[] {
  const frame = FRAME[platform];
  let cursorY = frame.safeY;
  const result: LayoutBlock[] = [];

  const tabbar = blocks.find((b) => b.type === "tabbar");
  const nav = blocks.find((b) => b.type === "nav");
  const stack = blocks.filter((b) => b.type !== "tabbar" && b.type !== "nav");
  const tabbarReserve =
    tabbar && platform === "mobile" ? frame.tabbarH + GAP : 0;
  const maxY = frame.safeY + frame.safeH - tabbarReserve;

  if (platform === "web" && nav) {
    const navW = 160;
    result.push({
      type: "nav",
      label: nav.label,
      items: nav.items ?? [],
      x: frame.safeX,
      y: frame.safeY,
      w: navW,
      h: frame.safeH,
    });
    cursorY = frame.safeY;
    const contentX = frame.safeX + navW + GAP;
    const contentW = frame.safeW - navW - GAP;
    for (const block of stack) {
      const laid = layoutOne(block, contentX, cursorY, contentW, maxY);
      if (laid) {
        result.push(laid);
        cursorY = laid.y + laid.h + GAP;
      }
    }
  } else {
    if (nav) {
      const laid = layoutOne(
        nav,
        frame.safeX,
        cursorY,
        frame.safeW,
        maxY,
      );
      if (laid) {
        result.push(laid);
        cursorY = laid.y + laid.h + GAP;
      }
    }
    for (const block of stack) {
      const laid = layoutOne(block, frame.safeX, cursorY, frame.safeW, maxY);
      if (laid) {
        result.push(laid);
        cursorY = laid.y + laid.h + GAP;
      }
    }
  }

  if (tabbar && platform === "mobile") {
    result.push({
      type: "tabbar",
      label: tabbar.label,
      items: [],
      x: frame.safeX,
      y: frame.safeY + frame.safeH - frame.tabbarH,
      w: frame.safeW,
      h: frame.tabbarH,
    });
  }

  return result;
}

function layoutOne(
  block: BlueprintBlock,
  x: number,
  y: number,
  w: number,
  maxY: number,
): LayoutBlock | null {
  const h = blockHeight(block);
  if (y + h > maxY) {
    return null;
  }
  return {
    type: block.type,
    label: block.label,
    items: block.items ?? [],
    x,
    y,
    w,
    h,
  };
}
