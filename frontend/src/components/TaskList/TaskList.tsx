import React, { useCallback, useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useUpdateTask, useDeleteTask } from "@/hooks/useTaskMutations";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { filterSchemaType } from "@/schemas/query";
import ListPagination from "../ListPagination/ListPagination";
import TaskListHeader from "./TaskListHeader";
import TaskListBody from "./TaskListBody";
import { Skeleton } from "../ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TaskForm from "../TaskForm/TaskForm";
import type { Task } from "@/interfaces/tasks";
import type { TaskFormValues } from "@/schemas/task";

interface TaskListProperties {
  defaultPageSize?: "5" | "10" | "15" | "20";
}

export const TaskList: React.FC<TaskListProperties> = ({
  defaultPageSize = "5",
}) => {
  const [pageSize, setPageSize] = useState<string>(defaultPageSize);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [priority, setPriority] = useState<string | undefined>(undefined);
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<keyof Task | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>(
    undefined
  );

  const [editingTask, setEditingTask] = useState<Task | null>(null); // Estado para la tarea en edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Estado para controlar el modal de edición

  const {
    tasks = [],
    totalPages = 1,
    isLoading,
  } = useTasks({
    page,
    pageSize: parseInt(pageSize),
    search,
    priority,
    user: userEmail,
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  const { mutate: updateTaskMutation, isPending: isUpdating } = useUpdateTask();
  const { mutate: deleteTaskMutation } = useDeleteTask();

  const handleSearch = useCallback((filters: filterSchemaType) => {
    setPage(1);
    setSearch(filters.search);
    setPriority(filters.priority);
    setUserEmail(filters.user);
    setSortBy(filters.sort_by);
    setSortOrder(filters.sort_order);
  }, []);

  const handleChangePage = (newPage: number) => {
    if (newPage <= totalPages && newPage >= 1) {
      setPage(newPage);
    }
  };

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  }, []);

  const handleEditSubmit = useCallback(
    (values: TaskFormValues) => {
      if (editingTask) {
        updateTaskMutation(
          { id: editingTask.id, taskData: values as Partial<Task> },
          {
            onSuccess: () => {
              setIsEditModalOpen(false);
              setEditingTask(null); // Limpiar la tarea en edición
            },
          }
        );
      }
    },
    [editingTask, updateTaskMutation]
  );

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingTask(null); // Asegurarse de limpiar la tarea en edición al cerrar
  }, []);

  const handleDeleteTask = useCallback(
    (taskId: number) => {
      if (window.confirm("Are you sure you want to delete this task?")) {
        deleteTaskMutation(taskId);
      }
    },
    [deleteTaskMutation]
  );

  const handleMarkAsCompleted = useCallback(() => {
    if (
      editingTask &&
      window.confirm("Are you sure you want to mark this task as completed?")
    ) {
      updateTaskMutation(
        { id: editingTask.id, taskData: { completed: true } },
        {
          onSuccess: () => {
            setIsEditModalOpen(false);
            setEditingTask(null);
          },
        }
      );
    }
  }, [editingTask, updateTaskMutation]);

  return (
    <Card className="w-full">
      <CardHeader>
        <TaskListHeader onSearch={handleSearch} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="w-full min-h-60" />
        ) : (
          <TaskListBody
            tasks={tasks}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </CardContent>
      <CardFooter>
        <ListPagination
          page={page}
          pageSize={pageSize}
          totalPages={totalPages || 0}
          onPageChange={handleChangePage}
          onPageSizeChange={setPageSize}
        />
      </CardFooter>

      {/* Diálogo de Edición Global */}
      <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <TaskForm
              defaultValues={{
                title: editingTask.title,
                description: editingTask.description || "",
                due_date: editingTask.due_date
                  ? new Date(editingTask.due_date).toISOString().split("T")[0]
                  : "",
                priority: editingTask.priority || undefined,
                assigned_to: editingTask.assigned_to?.email || undefined,
              }}
              onSubmit={handleEditSubmit}
              isPending={isUpdating}
              isEditMode={true}
              onMarkAsCompleted={handleMarkAsCompleted}
              isCompleted={editingTask.completed}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
