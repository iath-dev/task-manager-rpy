import type { Task } from "@/interfaces/tasks";
import type { filterSchemaType } from "@/schemas/query";
import { create } from "zustand";

interface TaskState {
  page: number;
  pageSize: string;
  filter: filterSchemaType;
  editingTask: Task | null;
  setPage: (page: number) => void;
  setPageSize: (pageSize: string) => void;
  setFilter: (filter: filterSchemaType) => void;
  setEditingTask: (task: Task | null) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  page: 1,
  pageSize: "5",
  editingTask: null,
  filter: {
    search: "",
    user: undefined,
    priority: undefined,
    assigned_to_me: undefined,
    sort_by: "created_at",
    sort_order: "desc",
  },
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize }),
  setFilter: (filter) => set({ filter }),
  setEditingTask: (task) => set({ editingTask: task }),
}));
