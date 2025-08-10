import { PRIORITIES } from "@/lib/constants";
import { z } from "zod";

export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  due_date: z.string().optional(), // Consider a more robust date type if necessary
  priority: z.enum(PRIORITIES).optional(),
  assigned_to: z.string().optional(), // We assume it is the user's ID or email
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
