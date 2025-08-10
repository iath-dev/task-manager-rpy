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
import { getUsersEmails } from "@/services/userService";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";

const TaskListUserFilter: React.FC<React.ComponentProps<typeof Select>> = (
  props
) => {
  const { user: authUser } = useAuthStore();
  const { data } = useQuery({
    enabled: authUser?.role === "ADMIN",
    queryKey: ["emails"],
    queryFn: () => getUsersEmails(),
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
          {data?.data.flatMap((email) => (
            <SelectItem key={`user-item-${email}`} value={email}>
              {email}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default TaskListUserFilter;
