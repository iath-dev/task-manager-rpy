import React, { useEffect, useState } from "react";

import { PlusCircle } from "lucide-react";
import { useDebounce } from "use-debounce";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateTask } from "@/hooks/useTasks";
import type { filterSchemaType } from "@/schemas/query";
import type { TaskFormValues } from "@/schemas/task";
import { useTaskStore } from "@/store/taskStore";

import TaskForm from "../TaskForm/TaskForm";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import UserEmailSelect from "../Users/UserEmailSelect";

import TaskListFilter from "./TaskListFilter";


const TaskListHeader: React.FC = () => {
  const { filter, setFilter } = useTaskStore();
  const [localQuery, setLocalQuery] = useState<filterSchemaType>(filter);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { mutate: createTaskMutation, isPending } = useCreateTask();

  const [debouncedQuery] = useDebounce(localQuery, 500);

  useEffect(() => {
    setFilter(debouncedQuery);
  }, [debouncedQuery, setFilter]);

  useEffect(() => {
    setLocalQuery(filter);
  }, [filter]);

  const handleChange = (
    key: keyof filterSchemaType,
    value: string | boolean | undefined
  ) => {
    setLocalQuery((prevQuery) => {
      const newQuery = { ...prevQuery, [key]: value };

      if (key === "user") {
        if (value === "__assigned_to_me__") {
          newQuery.user = undefined;
          newQuery.assigned_to_me = true;
        } else if (value !== undefined) {
          newQuery.assigned_to_me = undefined;
        } else {
          newQuery.assigned_to_me = undefined;
        }
      } else if (key === "assigned_to_me" && value === true) {
        newQuery.user = undefined;
      }
      return newQuery;
    });
  };

  const handleCreateSuccess = (data: TaskFormValues) => {
    createTaskMutation(data);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="w-full flex items-center justify-end gap-2">
      <Input
        value={localQuery.search || ""}
        placeholder="Search"
        className="max-w-sm"
        onChange={(e) => handleChange("search", e.target.value)}
      />
      <UserEmailSelect
        value={localQuery.user}
        onValueChange={(val) => handleChange("user", val)}
      />
      <TaskListFilter
        priority={localQuery.priority}
        sort_by={localQuery.sort_by}
        sort_order={localQuery.sort_order}
        onChangeFilters={handleChange}
      />

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <PlusCircle />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <TaskForm onSubmit={handleCreateSuccess} isPending={isPending} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskListHeader;
