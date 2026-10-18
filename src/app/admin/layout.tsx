import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { Toaster } from "@/components/admin/ui/sonner";

export const metadata: Metadata = {
  title: "Admin · Hunain Humail",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AdminGuard>{children}</AdminGuard>
      <Toaster />
    </>
  );
}
