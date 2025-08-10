import type { User } from "@/interfaces/user";
import apiClient from "./api";
import type { PaginatedResponse } from "@/interfaces/pagination";
import type { UserFormValues } from "@/schemas/user";
import type { Role } from "@/lib/constants";

export interface UserFilterValues {
  search: string;
  role?: Role;
  sortBy?: SortOptionsType;
}

export type SortOptionsType =
  | "full_name_asc"
  | "full_name_desc"
  | "email_asc"
  | "email_desc";

export async function getUsersEmails() {
  const res = await apiClient.get<string[]>("/users/emails");
  return res;
}

export async function getUsers(
  page = 1,
  pageSize = 10,
  filter: UserFilterValues
) {
  const res = await apiClient.get<PaginatedResponse<User>>("/users", {
    params: {
      page,
      page_size: pageSize,
      full_name: filter.search,
      role: filter.role,
      sort_by: filter.sortBy,
    },
  });
  return res.data;
}

export const updateUser = async (
  uid: number,
  payload: UserFormValues
): Promise<User> => {
  const { data } = await apiClient.put(`/users/${uid}`, payload);
  return data;
};
