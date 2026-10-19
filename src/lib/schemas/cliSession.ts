import { z } from "zod";

export const cliSessionWriteSchema = z.object({
  refreshToken: z.string().min(1),
  email: z.string().email(),
  code: z.string().min(1),
});

export type CliSessionWrite = z.infer<typeof cliSessionWriteSchema>;
