import { ROLES } from "@/lib/constants";
import { z } from "zod";

export const userFormSchema = z.object({
  full_name: z.string().min(1, "Title is required"),
  role: z.enum(ROLES).optional(),
  is_active: z.boolean().optional(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
