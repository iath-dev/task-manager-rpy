import type { User } from "./user";

export const PriorityEnum = {
  High: "high",
  Medium: "medium",
  Low: "low",
} as const;

export type PriorityEnum = (typeof PriorityEnum)[keyof typeof PriorityEnum];

export interface Task {
  title: string;
  description: string;
  due_date: string;
  priority: PriorityEnum;
  id: number;
  created_by: User;
  assigned_to?: User;
  created_at: string;
  updated_at: string;
  completed: boolean;
}

export interface TasksStatistics {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  completed_percentage: number;
  pending_percentage: number;
}
