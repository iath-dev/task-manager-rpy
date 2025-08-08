import type { Task } from "@/interfaces/tasks";
import type { PaginatedResponse } from "@/interfaces/pagination";
import apiClient from "./api";
import { delay } from "@/utils/delay";

interface GetTasksParams {
  page: number;
  pageSize: number;
  search?: string;
  priority?: string;
  user_email?: string;
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
}: GetTasksParams): Promise<PaginatedResponse<Task>> => {
  await delay(2000);

  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("page_size", pageSize.toString());

  if (search) {
    params.append("search", search);
  }
  if (priority) {
    params.append("priority", priority);
  }
  if (user_email) {
    params.append("user_email", user_email);
  }

  const { data } = await apiClient.get(`/tasks?${params.toString()}`);
  return data;
};
