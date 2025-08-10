import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "@/services/taskService";
import type { Task, UseTasksParams } from "@/interfaces/tasks";
import { toast } from "sonner";
import type { TaskFormValues } from "@/schemas/task";

// Query key factory for tasks
export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (filters: UseTasksParams) => [...taskKeys.lists(), filters] as const,
};

export const useTasks = (params: UseTasksParams) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: taskKeys.list(params), // Usar finalUserEmail y assigned_to_me en la clave
    queryFn: () =>
      getTasks({
        page: params.page,
        pageSize: params.pageSize,
        search: params.search,
        priority: params.priority,
        user_email: params.user,
        assigned_to_me: params.assigned_to_me,
        order_by: params.sort_by,
        order_direction: params.sort_order,
      }),
  });

  return {
    tasks: data?.items,
    totalPages: data?.total_pages,
    isLoading,
    isError,
    error,
  };
};

/**
 * Hook para crear una nueva tarea.
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskData: TaskFormValues) => createTask(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created successfully.");
    },
    onError: (error) => {
      console.error("Error creating task:", error);
      toast.error("Failed to create task. Please try again.");
    },
  });
};

/**
 * Hook para actualizar una tarea.
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, taskData }: { id: number; taskData: Partial<Task> }) =>
      updateTask(id, taskData),
    onSuccess: () => {
      // Invalida la caché de todas las queries que empiezan con 'tasks'
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task updated successfully.");
    },
    onError: (error) => {
      console.error("Error updating task:", error);
      toast.error("Failed to update task. Please try again.");
    },
  });
};

/**
 * Hook para eliminar una tarea.
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: () => {
      // Invalida la caché de todas las queries que empiezan con 'tasks'
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted successfully.");
    },
    onError: (error) => {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task. Please try again.");
    },
  });
};
