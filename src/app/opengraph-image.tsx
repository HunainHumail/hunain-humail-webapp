import { ImageResponse } from "next/og";
import { colorDark } from "@/design-system/tokens";
import { getProfile } from "@/services/profile";

export const alt = "Hunain Humail — GenAI engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

function displayName(name: string): { first: string; rest: string } {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length < 2) {
    return { first: name, rest: "" };
  }
  const first = parts[0] ?? name;
  return { first, rest: parts.slice(1).join(" ") };
}

export default async function OpenGraphImage() {
  const profile = await getProfile();
  const { first, rest } = displayName(profile.name);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: colorDark.bg,
          backgroundImage: `linear-gradient(${colorDark.elevated} 1px, transparent 1px), linear-gradient(90deg, ${colorDark.elevated} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          color: colorDark.text,
          padding: "72px",
        }}
      >
        <div
          style={{
            display: "flex",
            color: colorDark.accent,
            fontSize: 22,
            letterSpacing: 6,
          }}
        >
          GENAI ENGINEER
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 0.9,
            }}
          >
            {first}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
              fontSize: 92,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 0.9,
            }}
          >
            <div style={{ display: "flex" }}>{rest}</div>
            <div style={{ display: "flex", color: colorDark.accent }}>.</div>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              width: 980,
              fontSize: 32,
              lineHeight: 1.35,
              color: colorDark.muted,
            }}
          >
            {profile.headline}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
