import type { NextConfig } from "next";

const isStaticExport =
  process.env.STATIC_EXPORT === "true" ||
  process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  trailingSlash: false,
  ...(isStaticExport ? { output: "export" as const } : {}),
  ...(isStaticExport
    ? { env: { NEXT_PUBLIC_STATIC_EXPORT: "true" } }
    : {}),
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  images: {
    unoptimized: isStaticExport,
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
