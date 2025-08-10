import { taskKeys } from "@/interfaces/tasks";
import { z } from "zod";



// Use keyof typeof to get the sort_by options dynamically
export const querySchema = z.object({
  search: z.string().optional(),
  user: z.string().optional(), // user_email in the backend
  priority: z.enum(["high", "medium", "low"]).optional(),
  assigned_to_me: z.boolean().optional(),
  sort_by: z.enum(taskKeys).optional(),
  sort_order: z.enum(["asc", "desc"]).optional(),
});

export type filterSchemaType = z.infer<typeof querySchema>;
