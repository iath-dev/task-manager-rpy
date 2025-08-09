import React, { useEffect, useState, useMemo } from "react";
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
import TaskListUserFilter from "./TaskListUserFilter";
import { Button } from "../ui/button";
import { FilterX, PlusCircle } from "lucide-react";
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

interface TaskListHeaderProps {
  onSearch: (data: filterSchemaType) => void;
}

const defaultQuery: filterSchemaType = {
  search: "",
  user: undefined,
  priority: undefined,
  assigned_to_me: undefined,
};

const TaskListHeader: React.FC<TaskListHeaderProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<filterSchemaType>(defaultQuery);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { mutate: createTaskMutation, isPending } = useCreateTask();

  const { priority, search, user, assigned_to_me } = query;

  const [debounceSearch] = useDebounce(search, 500);
  const [debounceUser] = useDebounce(user, 500);
  const [debouncePriority] = useDebounce(priority, 500);

  useEffect(() => {
    onSearch({
      user: debounceUser,
      search: debounceSearch,
      priority: debouncePriority,
      assigned_to_me: assigned_to_me,
    });
  }, [
    debouncePriority,
    debounceSearch,
    debounceUser,
    assigned_to_me,
    onSearch,
  ]);

  const handleChange = (
    key: keyof filterSchemaType,
    value: string | boolean | undefined
  ) => {
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

  const clearQuery = () => {
    setQuery(defaultQuery);
  };

  const handleCreateSuccess = (data: TaskFormValues) => {
    createTaskMutation(data);
    setIsCreateModalOpen(false);
  };

  // Lógica para el botón de limpiar filtros
  const isFilterActive = useMemo(() => {
    return Object.keys(query).some((key) => {
      const defaultValue = defaultQuery[key as keyof filterSchemaType];
      const currentValue = query[key as keyof filterSchemaType];

      // Compara valores primitivos directamente
      if (currentValue !== defaultValue) {
        return true;
      }
      // Maneja casos donde undefined y '' son equivalentes para el filtro de búsqueda
      if (
        key === "search" &&
        ((currentValue === "" && defaultValue === undefined) ||
          (currentValue === undefined && defaultValue === ""))
      ) {
        return false;
      }
      return false;
    });
  }, [query]);

  return (
    <div className="w-full flex items-center justify-end gap-2">
      <Input
        value={search || ""} // Asegurar que el input no sea undefined
        placeholder="Search"
        className="max-w-sm"
        onChange={(e) => handleChange("search", e.target.value)}
      />
      <TaskListUserFilter
        value={user || (assigned_to_me ? "__assigned_to_me__" : undefined)} // Mostrar el valor correcto en el Select
        onValueChange={(val) => handleChange("user", val)}
      />
      <Select
        value={priority || ""} // Asegurar que el Select no sea undefined
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
      {isFilterActive && (
        <Button size="icon" variant="ghost" onClick={clearQuery}>
          <FilterX />
        </Button>
      )}

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" />{" "}
            <span className="hidden lg:flex">Create Task</span>
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
