import { messagesRepository } from "@/lib/firebase/repositories";
import type { InboxMessage } from "@/lib/schemas/inboxMessage";

export function listInbox(): Promise<InboxMessage[]> {
  return messagesRepository.list();
}

export function subscribeInbox(
  onChange: (items: InboxMessage[]) => void,
  onError?: (error: Error) => void,
): () => void {
  return messagesRepository.subscribe(onChange, onError);
}

export function markInboxRead(id: string): Promise<void> {
  return messagesRepository.markRead(id);
}
