import { create } from 'zustand'

import type { Task } from '@/interfaces/tasks'
import type { filterSchemaType } from '@/schemas/query'

interface TaskState {
  page: number
  pageSize: string
  filter: filterSchemaType
  editingTask: Task | null
  setPage: (page: number) => void
  setPageSize: (pageSize: string) => void
  setFilter: (filter: filterSchemaType) => void
  setEditingTask: (task: Task | null) => void
  reset: () => void
}

const initialTaskState: TaskState = {
  page: 1,
  pageSize: '5',
  editingTask: null,
  filter: {
    search: '',
    user: undefined,
    priority: undefined,
    assigned_to_me: undefined,
    sort_by: 'created_at',
    sort_order: 'desc',
  },
  setPage: () => {},
  setPageSize: () => {},
  setFilter: () => {},
  setEditingTask: () => {},
  reset: () => {},
}

export const useTaskStore = create<TaskState>(set => ({
  ...initialTaskState,
  setPage: page => set({ page }),
  setPageSize: pageSize => set({ pageSize }),
  setFilter: filter => set({ filter }),
  setEditingTask: task => set({ editingTask: task }),
  reset: () => set(initialTaskState),
}))
