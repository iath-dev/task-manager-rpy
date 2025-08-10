import { taskKeys } from "@/interfaces/tasks";
import { z } from "zod";

// Define la interface con las opciones de sort_by
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  user: string;
  assigned_to_me: boolean;
  // agrega aquí los campos que quieras permitir en sort_by
}

// Usa keyof typeof para obtener las opciones de sort_by dinámicamente
export const querySchema = z.object({
  search: z.string().optional(),
  user: z.string().optional(), // user_email en el backend
  priority: z.enum(["high", "medium", "low"]).optional(),
  assigned_to_me: z.boolean().optional(),
  sort_by: z.enum(taskKeys).optional(),
  sort_order: z.enum(["asc", "desc"]).optional(),
});

export type filterSchemaType = z.infer<typeof querySchema>;
