import { isFirebaseConfigured } from "@/lib/env";
import { messagesRepository } from "@/lib/firebase";
import {
  contactMessageSchema,
  type ContactMessage,
} from "@/lib/schemas/contactMessage";

export interface SubmitContactMessageResult {
  ok: true;
  id: string;
}

function isDevOrTest(): boolean {
  return (
    process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
  );
}

export async function submitContactMessage(
  data: unknown,
): Promise<SubmitContactMessageResult> {
  const parsed: ContactMessage = contactMessageSchema.parse(data);

  if (parsed.honeypot.length > 0) {
    return { ok: true, id: "dropped" };
  }

  if (!isFirebaseConfigured()) {
    if (!isDevOrTest()) {
      throw new Error("Contact form is unavailable.");
    }
    return { ok: true, id: "mock-message" };
  }

  const created = await messagesRepository.create({
    name: parsed.name,
    email: parsed.email,
    topic: parsed.topic,
    message: parsed.message,
    createdAt: new Date().toISOString(),
  });

  return { ok: true, id: created.id };
}
