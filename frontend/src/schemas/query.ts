import { z } from "zod";

export const querySchema = z.object({
  search: z.string().optional(),
  user: z.string().optional(),
  priority: z.enum(["high", "medium", "low"]).optional(),
});

export type filterSchemaType = z.infer<typeof querySchema>;
