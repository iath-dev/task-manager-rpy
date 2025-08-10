import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/services/taskService";

interface UseTasksParams {
  page: number;
  pageSize: number;
  search?: string;
  priority?: string;
  user?: string; // user_email en el backend
  assigned_to_me?: boolean; // Nuevo filtro
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export const useTasks = ({
  page,
  pageSize,
  search,
  priority,
  user,
  assigned_to_me,
  sort_by,
  sort_order,
}: UseTasksParams) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "tasks",
      page,
      pageSize,
      search,
      priority,
      user,
      assigned_to_me,
      sort_by,
      sort_order,
    ], // Usar finalUserEmail y assigned_to_me en la clave
    queryFn: () =>
      getTasks({
        page,
        pageSize,
        search,
        priority,
        user_email: user, // Enviar finalUserEmail al servicio
        assigned_to_me: assigned_to_me,
        order_by: sort_by,
        order_direction: sort_order,
      }),
  });

  return {
    tasks: data?.items,
    totalPages: data?.total_pages,
    isLoading,
    isError,
  };
};
