import { z } from "zod";

export const ApiSession = z.object({
  token: z.string().nullable().optional(),
  expires_in: z.number().nullable().optional(),
  message: z.string().optional(),
});

export const ApiSessionSchema = ApiSession;
export type ApiSessionType = z.infer<typeof ApiSessionSchema>;
