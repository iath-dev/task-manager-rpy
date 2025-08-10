import { useQuery } from "@tanstack/react-query";
import { getUsers, type UserFilterValues } from "@/services/userService";

interface UseUsersParams {
  page: number;
  pageSize: number;
  filter: UserFilterValues;
}

export const useUsers = ({ page, pageSize, filter }: UseUsersParams) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "users",
      page,
      pageSize,
      filter.search,
      filter.role,
      filter.sortBy,
    ],
    queryFn: () => getUsers(page, pageSize, filter),
  });

  return {
    users: data?.items,
    totalPages: data?.total_pages,
    isLoading,
    isError,
  };
};
