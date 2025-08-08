import type { User } from "@/interfaces/user";
import apiClient from "./api";

export async function getUsers() {
  const res = await apiClient.get<User[]>("/users");
  return res;
}
