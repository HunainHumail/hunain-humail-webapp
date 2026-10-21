"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BlueprintLeadDetail } from "@/components/admin/BlueprintLeadDetail";
import { BlueprintLeadsPanel } from "@/components/admin/BlueprintLeadsPanel";
import { useBlueprintLeads } from "@/hooks/useBlueprintLeads";
import type { BlueprintLead } from "@/lib/schemas/blueprint";

/** Failed attempt whose retry succeeded: show the saved wireframe the client saw. No model calls. */
function findSavedSibling(lead: BlueprintLead, items: BlueprintLead[]) {
  if (lead.spec) return undefined;
  return items.find(
    (item) =>
      item.id !== lead.id &&
      item.spec &&
      item.email === lead.email &&
      item.idea.trim() === lead.idea.trim() &&
      item.platform === lead.platform,
  );
}

function BlueprintsPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { findById, setStatus, loading, items } = useBlueprintLeads();

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
        savedLead={findSavedSibling(lead, items)}
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
