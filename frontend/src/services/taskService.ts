import type { Task, TasksStatistics } from "@/interfaces/tasks";
import type { PaginatedResponse } from "@/interfaces/pagination";
import apiClient from "./api";
import { delay } from "@/utils/delay";
import type { TaskFormValues } from "@/schemas/task";

interface GetTasksParams {
  page: number;
  pageSize: number; // Mantener como pageSize en el frontend
  search?: string;
  priority?: string;
  user_email?: string;
  assigned_to_me?: boolean; // Nuevo filtro
}

/**
 * Obtiene la lista de tareas desde el backend con paginación y filtros.
 */
export const getTasks = async ({
  page,
  pageSize,
  search,
  priority,
  user_email,
  assigned_to_me,
}: GetTasksParams): Promise<PaginatedResponse<Task>> => {
  await delay(2000);

  const { data } = await apiClient.get("/tasks", {
    params: {
      page,
      page_size: pageSize,
      user_email,
      assigned_to_me,
      priority,
      search,
    },
  });
  return data;
};

/**
 * Crea una nueva tarea.
 */
export const createTask = async (taskData: TaskFormValues): Promise<Task> => {
  const payload = {
    ...taskData,
    assigned_to: taskData.assigned_to || null, // Enviar null si es undefined o vacío
    due_date: taskData.due_date ? `${taskData.due_date}T00:00:00Z` : null, // Formato ISO o null
  };
  const { data } = await apiClient.post(`/tasks`, payload);
  return data;
};

/**
 * Actualiza una tarea existente.
 */
export const updateTask = async (
  id: number,
  taskData: Partial<TaskFormValues>
): Promise<Task> => {
  const payload = {
    ...taskData,
    assigned_to: taskData.assigned_to || null, // Enviar null si es undefined o vacío
    due_date: taskData.due_date ? `${taskData.due_date}T00:00:00Z` : null, // Formato ISO o null
  };
  const { data } = await apiClient.put<Task>(`/tasks/${id}`, payload);
  return data;
};

/**
 * Elimina una tarea por su ID.
 */
export const deleteTask = async (id: number): Promise<void> => {
  await apiClient.delete(`/tasks/${id}`);
};

export const getStats = async (): Promise<TasksStatistics> => {
  const { data } = await apiClient.get<TasksStatistics>(`/tasks/statistics`);
  return data;
};
