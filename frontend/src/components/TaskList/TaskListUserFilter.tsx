import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getUsers } from "@/services/userService";
import { useQuery } from "@tanstack/react-query";

const TaskListUserFilter: React.FC<React.ComponentProps<typeof Select>> = (
  props
) => {
  const { data } = useQuery({
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
          {data?.data.flatMap((user) => (
            <SelectItem key={`user-item-${user.email}`} value={user.email}>
              {user.email}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default TaskListUserFilter;
