import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers, updateUser } from "@/services/userService";
import type { UserFormValues } from "@/schemas/user";
import { toast } from "sonner";
import type { UseUsersParams } from "@/interfaces/user";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: UseUsersParams) => [...userKeys.lists(), params] as const,
};

export const useUsers = ({ page, pageSize, filter }: UseUsersParams) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: userKeys.list({ page, pageSize, filter }),
    queryFn: () => getUsers(page, pageSize, filter),
  });

  return {
    users: data?.items,
    totalPages: data?.total_pages,
    isLoading,
    isError,
    error,
  };
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userData }: { id: number; userData: UserFormValues }) =>
      updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating user:", error);
      toast.error("Failed to update user. Please try again.");
    },
  });
};
