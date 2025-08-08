import { PriorityEnum, type TaskResponse } from "@/interfaces/tasks";
import type { User } from "@/interfaces/user";

export const mockUsers: User[] = [
  {
    id: 1,
    email: "admin@example.com",
    full_name: "Admin User",
    username: "username",
  },
  {
    id: 2,
    email: "user@example.com",
    full_name: "Regular User",
    username: "username",
  },
  {
    id: 3,
    email: "guest@example.com",
    full_name: "Guest User",
    username: "username",
  },
];

export const mockTasks: TaskResponse[] = [
  {
    id: 1,
    title: "Implement authentication",
    description:
      "Implement JWT authentication with admin and regular user roles.",
    completed: false,
    due_date: "2025-08-15T17:00:00Z",
    priority: PriorityEnum.High,
    created_by: mockUsers[0],
    assigned_to: mockUsers[1],
    created_at: "2025-08-01T10:00:00Z",
    updated_at: "2025-08-01T10:00:00Z",
  },
  {
    id: 2,
    title: "Design database schema",
    description: "Define PostgreSQL schema for tasks and users.",
    completed: true,
    due_date: "2025-07-30T23:59:59Z",
    priority: PriorityEnum.High,
    created_by: mockUsers[0],
    assigned_to: undefined,
    created_at: "2025-07-25T09:00:00Z",
    updated_at: "2025-07-30T18:00:00Z",
  },
  {
    id: 3,
    title: "Develop task creation form",
    description: "Create React form for adding new tasks with validation.",
    completed: false,
    due_date: "2025-08-20T12:00:00Z",
    priority: PriorityEnum.Medium,
    created_by: mockUsers[1],
    assigned_to: mockUsers[1],
    created_at: "2025-08-05T14:30:00Z",
    updated_at: "2025-08-05T14:30:00Z",
  },
  {
    id: 4,
    title: "Set up CI/CD pipeline",
    description:
      "Configure GitHub Actions for automated testing and deployment.",
    completed: false,
    due_date: "2025-08-25T09:00:00Z",
    priority: PriorityEnum.Low,
    created_by: mockUsers[0],
    assigned_to: mockUsers[0],
    created_at: "2025-08-10T11:00:00Z",
    updated_at: "2025-08-10T11:00:00Z",
  },
];
