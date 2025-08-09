import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask, deleteTask, createTask } from "@/services/taskService";
import type { Task } from "@/interfaces/tasks";
import type { TaskFormValues } from "@/schemas/task";

/**
 * Hook para crear una nueva tarea.
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskData: TaskFormValues) => createTask(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
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
    },
  });
};
