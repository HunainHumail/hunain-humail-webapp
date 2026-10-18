import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  email: z.string().trim().email("Enter a valid email"),
  topic: z.string().trim().min(1, "Choose a topic"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be at most 2000 characters"),
  honeypot: z.string().optional().default(""),
});

export type ContactMessage = z.infer<typeof contactMessageSchema>;
export type ContactMessageInput = z.input<typeof contactMessageSchema>;
