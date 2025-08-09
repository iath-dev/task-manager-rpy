import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "../ui/select";
import { getUsers } from "@/services/userService";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";

const TaskListUserFilter: React.FC<React.ComponentProps<typeof Select>> = (
  props
) => {
  const { user: authUser } = useAuthStore();
  const { data } = useQuery({
    enabled: authUser?.role === "ADMIN",
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  return (
    <Select {...props}>
      <SelectTrigger>
        <SelectValue placeholder="Filter by user" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Users</SelectLabel>
          {authUser && (
            <SelectItem value="__assigned_to_me__">Assigned to me</SelectItem>
          )}
          <SelectSeparator />
          {data?.data.flatMap((_user) => (
            <SelectItem key={`user-item-${_user.email}`} value={_user.email}>
              {_user.email}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default TaskListUserFilter;
