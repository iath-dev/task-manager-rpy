import { z } from "zod";

export const querySchema = z.object({
  search: z.string().optional(),
  user: z.string().optional(), // user_email en el backend
  priority: z.enum(["high", "medium", "low"]).optional(),
  assigned_to_me: z.boolean().optional(), // Nuevo filtro
});

export type filterSchemaType = z.infer<typeof querySchema>;
