import type { filterSchemaType } from "@/schemas/query";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Filter } from "lucide-react";
import { taskKeys, type TaskSortableKeys } from "@/interfaces/tasks";

const filterKeyMap: Record<TaskSortableKeys, string> = {
  title: "Title",
  due_date: "Due Date",
  created_at: "Created At",
  updated_at: "Updated At",
};

interface TaskListFilterProps extends Partial<filterSchemaType> {
  onChangeFilters: (
    key: keyof filterSchemaType,
    value: string | undefined
  ) => void;
}

const TaskListFilter: React.FC<TaskListFilterProps> = ({
  priority,
  sort_by,
  sort_order,
  onChangeFilters,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Filter />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Filters</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Priority</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={priority}
                  onValueChange={(val) =>
                    onChangeFilters(
                      "priority",
                      priority === val ? undefined : val
                    )
                  }
                >
                  {["high", "medium", "low"].flatMap((_status) => (
                    <DropdownMenuRadioItem
                      key={`status-item-${_status}`}
                      value={_status}
                    >
                      {_status.toUpperCase()}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Sort by</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={sort_by}
                  onValueChange={(val) =>
                    onChangeFilters(
                      "sort_by",
                      sort_by === val ? undefined : val
                    )
                  }
                >
                  {taskKeys.flatMap((key) => (
                    <DropdownMenuRadioItem key={`sort-key-${key}`} value={key}>
                      {filterKeyMap[key]}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Sort order</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={sort_order}
                  onValueChange={(val) =>
                    onChangeFilters(
                      "sort_order",
                      sort_order === val ? undefined : val
                    )
                  }
                >
                  {["asc", "desc"].flatMap((key) => (
                    <DropdownMenuRadioItem
                      key={`sort-order-${key}`}
                      value={key}
                      className="first-letter:uppercase"
                    >
                      {key === "asc" ? "Ascending" : "Descending"}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskListFilter;
