import React, { useCallback } from "react";
import { useDeleteTask, useTasks } from "@/hooks/useTasks";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Pagination from "../ui/pagination";
import TaskListHeader from "./TaskListHeader";
import TaskListBody from "./TaskListBody";
import { Skeleton } from "../ui/skeleton";
import type { Task } from "@/interfaces/tasks";
import { useTaskStore } from "@/store/taskStore";
import EditTaskDialog from "./EditTaskDialog";

export const TaskList: React.FC = () => {
  const { page, pageSize, filter, setPage, setPageSize, setEditingTask } =
    useTaskStore();

  const {
    tasks = [],
    totalPages = 1,
    isLoading,
  } = useTasks({
    page,
    pageSize: parseInt(pageSize),
    ...filter,
  });

  const { mutate: deleteTaskMutation } = useDeleteTask();

  const handleChangePage = (newPage: number) => {
    if (newPage <= totalPages && newPage >= 1) {
      setPage(newPage);
    }
  };

  const handleEditTask = useCallback(
    (task: Task) => {
      setEditingTask(task);
    },
    [setEditingTask]
  );

  const handleDeleteTask = useCallback(
    (taskId: number) => {
      if (window.confirm("Are you sure you want to delete this task?")) {
        deleteTaskMutation(taskId);
      }
    },
    [deleteTaskMutation]
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <TaskListHeader />
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
        <Pagination
          page={page}
          pageSize={pageSize}
          totalPages={totalPages || 0}
          onPageChange={handleChangePage}
          onPageSizeChange={setPageSize}
        />
      </CardFooter>

      <EditTaskDialog />
    </Card>
  );
};
