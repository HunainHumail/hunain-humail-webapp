import type { Metadata } from "next";
import { CliLoginLive } from "./CliLoginLive";

export const metadata: Metadata = {
  title: "CLI login",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-static";

export default function CliLoginPage() {
  return <CliLoginLive />;
}
