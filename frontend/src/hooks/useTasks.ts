import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/services/taskService";

interface UseTasksParams {
  page: number;
  pageSize: number;
  search?: string;
  priority?: string;
  user_email?: string;
}

export const useTasks = ({
  page,
  pageSize,
  search,
  priority,
  user_email,
}: UseTasksParams) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tasks", page, pageSize, search, priority, user_email],
    queryFn: () => getTasks({ page, pageSize, search, priority, user_email }),
  });

  return {
    tasks: data?.items,
    totalPages: data?.total_pages,
    isLoading,
    isError,
  };
};
