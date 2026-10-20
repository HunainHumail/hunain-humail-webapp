"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BlueprintLeadDetail } from "@/components/admin/BlueprintLeadDetail";
import { BlueprintLeadsPanel } from "@/components/admin/BlueprintLeadsPanel";
import { useBlueprintLeads } from "@/hooks/useBlueprintLeads";

function BlueprintsPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { findById, setStatus, loading } = useBlueprintLeads();

  if (id) {
    if (loading) {
      return <p role="status">Loading</p>;
    }
    const lead = findById(id);
    if (!lead) {
      return <p role="status">Lead not found.</p>;
    }
    return (
      <BlueprintLeadDetail
        lead={lead}
        onStatusChange={(status) => void setStatus(id, status)}
      />
    );
  }

  return <BlueprintLeadsPanel />;
}

export default function AdminBlueprintsPage() {
  return (
    <Suspense fallback={<p role="status">Loading</p>}>
      <BlueprintsPageContent />
    </Suspense>
  );
}
