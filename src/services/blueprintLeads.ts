import { blueprintLeadsRepository } from "@/lib/firebase/repositories/blueprintLeadsRepository";
import {
  blueprintLeadStatusSchema,
  type BlueprintLead,
  type BlueprintLeadStatus,
} from "@/lib/schemas/blueprint";

export async function listBlueprintLeads(): Promise<BlueprintLead[]> {
  return blueprintLeadsRepository.list();
}

export function subscribeBlueprintLeads(
  onChange: (items: BlueprintLead[]) => void,
  onError?: (error: Error) => void,
): () => void {
  return blueprintLeadsRepository.subscribe(onChange, onError);
}

export async function setBlueprintLeadStatus(
  id: string,
  status: BlueprintLeadStatus,
): Promise<void> {
  blueprintLeadStatusSchema.parse(status);
  await blueprintLeadsRepository.updateStatus(id, status);
}
