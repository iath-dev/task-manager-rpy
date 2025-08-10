import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import type { filterSchemaType } from "@/schemas/query";
import { useDebounce } from "use-debounce";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { TaskFormValues } from "@/schemas/task";
import { useCreateTask } from "@/hooks/useTaskMutations";
import TaskForm from "../TaskForm/TaskForm";
import TaskListUserFilter from "./TaskListUserFilter";
import TaskListFilter from "./TaskListFilter";

interface TaskListHeaderProps {
  onSearch: (data: filterSchemaType) => void;
}

const defaultQuery: filterSchemaType = {
  search: "",
  user: undefined,
  priority: undefined,
  assigned_to_me: undefined,
  sort_by: undefined,
  sort_order: undefined,
};

const TaskListHeader: React.FC<TaskListHeaderProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<filterSchemaType>(defaultQuery);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { mutate: createTaskMutation, isPending } = useCreateTask();

  const { priority, search, user, assigned_to_me, sort_by, sort_order } = query;

  const [debounceSearch] = useDebounce(search, 500);
  const [debounceUser] = useDebounce(user, 500);
  const [debouncePriority] = useDebounce(priority, 500);

  useEffect(() => {
    onSearch({
      user: debounceUser,
      search: debounceSearch,
      priority: debouncePriority,
      assigned_to_me: assigned_to_me,
      sort_by: sort_by,
      sort_order: sort_order,
    });
  }, [
    debouncePriority,
    debounceSearch,
    debounceUser,
    assigned_to_me,
    sort_by,
    sort_order,
    onSearch,
  ]);

  const handleChange = (
    key: keyof filterSchemaType,
    value: string | boolean | undefined
  ) => {
    console.log(`Changing ${key} to`, value);

    setQuery((prevQuery) => {
      const newQuery = { ...prevQuery, [key]: value };

      // Lógica para manejar la exclusividad entre 'user' y 'assigned_to_me'
      if (key === "user") {
        if (value === "__assigned_to_me__") {
          newQuery.user = undefined; // Asegurarse de que 'user' no se envíe
          newQuery.assigned_to_me = true;
        } else if (value !== undefined) {
          newQuery.assigned_to_me = undefined; // Desactivar si se selecciona un usuario específico
        } else {
          // value es undefined (limpiar filtro de usuario)
          newQuery.assigned_to_me = undefined; // Desactivar si se limpia el filtro de usuario
        }
      } else if (key === "assigned_to_me" && value === true) {
        newQuery.user = undefined; // Si se activa assigned_to_me, limpiar user
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
        value={search || ""} // Asegurar que el input no sea undefined
        placeholder="Search"
        className="max-w-sm"
        onChange={(e) => handleChange("search", e.target.value)}
      />
      <TaskListUserFilter
        value={user}
        onValueChange={(val) => handleChange("user", val)}
      />
      <TaskListFilter
        priority={priority}
        sort_by={sort_by}
        sort_order={sort_order}
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
