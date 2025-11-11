import { z } from "zod";

export const ApiSearchItem = z.object({
  id: z.number(),
  name: z.string(),
  region: z.string().optional(),
  country: z.string().optional(),
  lat: z.number().optional(),
  lon: z.number().optional(),
});

export const ApiSearchSchema = z.array(ApiSearchItem);

export type ApiSearchItemType = z.infer<typeof ApiSearchItem>;
export type ApiSearch = z.infer<typeof ApiSearchSchema>;
