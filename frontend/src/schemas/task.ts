import { PRIORITIES } from "@/lib/constants";
import { z } from "zod";

export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  due_date: z.string().optional(), // Considerar un tipo de fecha más robusto si es necesario
  priority: z.enum(PRIORITIES).optional(),
  assigned_to: z.string().optional(), // Asumimos que es el ID o email del usuario
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
