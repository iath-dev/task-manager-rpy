import type { User } from "./user";

export const PriorityEnum = {
  High: "high",
  Medium: "medium",
  Low: "low",
} as const;

export type PriorityEnum = (typeof PriorityEnum)[keyof typeof PriorityEnum];

export interface TaskResponse {
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
