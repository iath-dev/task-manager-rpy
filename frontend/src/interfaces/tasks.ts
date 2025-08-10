import type { Priority } from "@/lib/constants";
import type { User } from "./user";

export interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string;
  priority: Priority;
  created_by: User;
  assigned_to?: User;
  created_at: string;
  updated_at: string;
  completed: boolean;
}

export type TaskSortableKeys = Exclude<
  keyof Task,
  "id" | "description" | "priority" | "assigned_to" | "created_by" | "completed"
>;

export const taskKeys = [
  "title",
  "due_date",
  "created_at",
  "updated_at",
] as const satisfies TaskSortableKeys[];

export interface TasksStatistics {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  completed_percentage: number;
  pending_percentage: number;
}

export interface UseTasksParams {
  page: number;
  pageSize: number;
  search?: string;
  priority?: string;
  user?: string; // user_email en el backend
  assigned_to_me?: boolean; // Nuevo filtro
  sort_by?: string;
  sort_order?: "asc" | "desc";
}
