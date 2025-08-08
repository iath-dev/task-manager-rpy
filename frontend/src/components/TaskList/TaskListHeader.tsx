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
import { useAuthStore } from "@/store/authStore";
import TaskListUserFilter from "./TaskListUserFilter";
import { Button } from "../ui/button";
import { FilterX } from "lucide-react";

interface TaskListHeaderProps {
  onSearch: (data: filterSchemaType) => void;
}

const defaultQuery = {
  search: "",
  user: undefined,
  priority: undefined,
};

const TaskListHeader: React.FC<TaskListHeaderProps> = ({ onSearch }) => {
  const { user: authData } = useAuthStore();
  const [query, setQuery] = useState<filterSchemaType>(defaultQuery);

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

  const clearQuery = () => {
    setQuery(() => defaultQuery);
  };

  return (
    <div className="w-full flex items-center justify-end gap-2">
      <Input
        value={search}
        placeholder="Search"
        className="max-w-sm"
        onChange={(e) => handleChange("search", e.target.value)}
      />
      {authData?.role == "ADMIN" && (
        <TaskListUserFilter
          value={user}
          onValueChange={(val) => handleChange("user", val)}
        />
      )}
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
      {query !== defaultQuery && (
        <Button size="icon" variant="ghost" onClick={clearQuery}>
          <FilterX />
        </Button>
      )}
    </div>
  );
};

export default TaskListHeader;
