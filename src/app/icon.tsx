import { ImageResponse } from "next/og";
import { colorDark } from "@/design-system/tokens";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colorDark.bg,
          color: colorDark.accent,
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        H
      </div>
    ),
    { ...size },
  );
}
