"use client";

import { MonoLabel } from "@/components/atoms/MonoLabel";
import { Text } from "@/components/atoms/Text";
import { FORM_ROW, FRAME, LIST_ROW, layoutBlocks } from "@/lib/blueprint/layoutBlocks";
import type { BlueprintPlatform, BlueprintScreen } from "@/lib/schemas/blueprint";
import { cn } from "@/lib/utils/cn";

export interface WireframeScreenProps {
  screen: BlueprintScreen;
  platform: BlueprintPlatform;
  index: number;
  className?: string;
}

function BlockGlyph({
  block,
}: {
  block: ReturnType<typeof layoutBlocks>[number];
}) {
  const { x, y, w, h, type, label, items } = block;
  const stroke = "stroke-blueprint-line fill-none";
  const ink = "fill-text font-mono";
  const mute = "fill-muted font-mono";

  switch (type) {
    case "header":
      return (
        <g data-block-type={type}>
          <rect x={x} y={y} width={w} height={h} className={stroke} rx={4} />
          <text x={x + 12} y={y + h / 2 + 5} fontSize={22} className={ink}>
            {label.slice(0, 24)}
          </text>
        </g>
      );
    case "nav":
      return (
        <g data-block-type={type}>
          <rect x={x} y={y} width={w} height={h} className={stroke} rx={4} />
          {Array.from({ length: 4 }).map((_, i) => (
            <rect
              key={i}
              x={x + 8 + i * ((w - 16) / 4)}
              y={y + h / 2 - 10}
              width={(w - 32) / 4}
              height={20}
              className={stroke}
              rx={10}
            />
          ))}
        </g>
      );
    case "list":
      return (
        <g data-block-type={type}>
          {Array.from({ length: Math.max(1, items.length) }).map((_, i) => {
            const rowY = y + i * LIST_ROW;
            return (
              <g key={i}>
                <circle cx={x + 14} cy={rowY + 20} r={7} className={stroke} />
                <text x={x + 30} y={rowY + 26} fontSize={20} className={ink}>
                  {(items[i] ?? label).slice(0, 26)}
                </text>
              </g>
            );
          })}
        </g>
      );
    case "card":
      return (
        <g data-block-type={type}>
          <rect x={x} y={y} width={w} height={h} className={stroke} rx={8} />
          <rect
            x={x + 12}
            y={y + 12}
            width={w - 24}
            height={h * 0.4}
            className={stroke}
          />
          <text x={x + 12} y={y + h - 18} fontSize={20} className={ink}>
            {label.slice(0, 28)}
          </text>
        </g>
      );
    case "form":
      return (
        <g data-block-type={type}>
          {Array.from({ length: Math.max(1, items.length) }).map((_, i) => {
            const top = y + 8 + i * FORM_ROW;
            return (
              <g key={i}>
                <text x={x} y={top + 16} fontSize={18} className={mute}>
                  {(items[i] ?? label).slice(0, 22)}
                </text>
                <rect
                  x={x}
                  y={top + 22}
                  width={w}
                  height={24}
                  className={stroke}
                  rx={4}
                />
              </g>
            );
          })}
        </g>
      );
    case "button":
      return (
        <g data-block-type={type}>
          <rect
            x={x + w * 0.15}
            y={y}
            width={w * 0.7}
            height={h}
            className={stroke}
            rx={h / 2}
          />
          <text
            x={x + w / 2}
            y={y + h / 2 + 6}
            fontSize={18}
            textAnchor="middle"
            className={ink}
          >
            {label.slice(0, 18)}
          </text>
        </g>
      );
    case "image":
      return (
        <g data-block-type={type}>
          <rect x={x} y={y} width={w} height={h} className={stroke} />
          <line x1={x} y1={y} x2={x + w} y2={y + h} className={stroke} />
          <line x1={x + w} y1={y} x2={x} y2={y + h} className={stroke} />
          <text x={x + 12} y={y + h / 2 + 4} fontSize={18} className={mute}>
            {label.slice(0, 20)}
          </text>
        </g>
      );
    case "tabbar":
      return (
        <g data-block-type={type}>
          <rect x={x} y={y} width={w} height={h} className={stroke} />
          {Array.from({ length: 4 }).map((_, i) => (
            <circle
              key={i}
              cx={x + w * (0.15 + i * 0.23)}
              cy={y + h / 2}
              r={8}
              className={stroke}
            />
          ))}
        </g>
      );
    default:
      return null;
  }
}

function DeviceFrame({ platform }: { platform: BlueprintPlatform }) {
  const frame = FRAME[platform];
  if (platform === "mobile") {
    return (
      <>
        <rect
          x={8}
          y={8}
          width={frame.width - 16}
          height={frame.height - 16}
          rx={32}
          className="fill-surface stroke-blueprint-line"
        />
        <rect
          x={frame.width / 2 - 40}
          y={24}
          width={80}
          height={8}
          rx={4}
          className="fill-muted"
        />
      </>
    );
  }
  return (
    <>
      <rect
        x={0}
        y={0}
        width={frame.width}
        height={56}
        className="fill-surface stroke-blueprint-line"
      />
      {Array.from({ length: 3 }).map((_, i) => (
        <circle
          key={i}
          cx={24 + i * 16}
          cy={28}
          r={5}
          className="stroke-blueprint-line fill-none"
        />
      ))}
      <rect
        x={120}
        y={16}
        width={frame.width - 240}
        height={24}
        rx={6}
        className="stroke-blueprint-line fill-none"
      />
      <rect
        x={0}
        y={56}
        width={frame.width}
        height={frame.height - 56}
        className="fill-surface stroke-blueprint-line"
      />
    </>
  );
}

export function WireframeScreen({
  screen,
  platform,
  index,
  className,
}: WireframeScreenProps) {
  const frame = FRAME[platform];
  const titleId = `wireframe-${screen.id}-title`;
  const laidOut = layoutBlocks(platform, screen.blocks);

  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      <svg
        viewBox={frame.viewBox}
        role="img"
        aria-labelledby={titleId}
        className="h-auto w-full max-w-full bg-grid rounded-md"
      >
        <title id={titleId}>{screen.title}</title>
        <DeviceFrame platform={platform} />
        {laidOut.map((block, blockIndex) => (
          <BlockGlyph key={`${block.type}-${blockIndex}`} block={block} />
        ))}
      </svg>
      <figcaption className="space-y-1">
        <MonoLabel>{`Screen ${String(index + 1).padStart(2, "0")}`}</MonoLabel>
        <Text as="p" className="font-display tracking-tight">
          {screen.title}
        </Text>
        <Text variant="muted" as="p" className="text-sm">
          {screen.purpose}
        </Text>
      </figcaption>
    </figure>
  );
}
