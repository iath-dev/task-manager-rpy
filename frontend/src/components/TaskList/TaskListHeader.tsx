import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { filterSchemaType } from "@/schemas/query";
import { useDebounce } from "use-debounce";
import type { User } from "@/interfaces/user";

interface TaskListHeaderProps {
  users: User[];
  onSearch: (data: filterSchemaType) => void;
}

const TaskListHeader: React.FC<TaskListHeaderProps> = ({
  users = [],
  onSearch,
}) => {
  const [query, setQuery] = useState<filterSchemaType>({
    search: "",
    user: undefined,
    priority: undefined,
  });

  const { priority, search, user } = query;

  const [debounceSearch] = useDebounce(search, 500);
  const [debounceUser] = useDebounce(user, 500);
  const [debouncePriority] = useDebounce(priority, 500);

  useEffect(() => {
    onSearch({
      search: debounceSearch,
      priority: debouncePriority,
      user: debounceUser,
    });
  }, [debounceSearch, debounceUser, debouncePriority]);

  const handleChange = (key: keyof filterSchemaType, value: string) => {
    setQuery((_query) => ({ ..._query, [key]: value }));
  };

  return (
    <div className="w-full flex items-center justify-end gap-2">
      <Input
        value={search}
        placeholder="Search"
        className="max-w-sm"
        onChange={(e) => handleChange("search", e.target.value)}
      />
      <Select value={user} onValueChange={(val) => handleChange("user", val)}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by user" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Users</SelectLabel>
            {users.flatMap((user) => (
              <SelectItem key={`user-item-${user.id}`} value={`${user.id}`}>
                {user.full_name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        value={priority}
        onValueChange={(val) => handleChange("priority", val)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            {["high", "medium", "low"].flatMap((_status) => (
              <SelectItem key={`status-item-${_status}`} value={_status}>
                {_status.toUpperCase()}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TaskListHeader;
