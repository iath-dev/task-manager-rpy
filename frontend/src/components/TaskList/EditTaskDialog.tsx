import React, { useCallback, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import TaskForm from "../TaskForm/TaskForm";
import { useTaskStore } from "@/store/taskStore";
import type { TaskFormValues } from "@/schemas/task";
import type { Task } from "@/interfaces/tasks";
import { useUpdateTask } from "@/hooks/useTasks";

const EditTaskDialog: React.FC = () => {
  const { editingTask, setEditingTask } = useTaskStore();

  const { mutate: updateTaskMutation, isPending: isUpdating } = useUpdateTask();

  const open = useMemo(() => !!editingTask, [editingTask]);

  const handleEditSubmit = useCallback(
    (values: TaskFormValues) => {
      if (editingTask) {
        updateTaskMutation(
          { id: editingTask.id, taskData: values as Partial<Task> },
          {
            onSuccess: () => {
              setEditingTask(null); // Limpiar la tarea en edición
            },
          }
        );
      }
    },
    [editingTask, setEditingTask, updateTaskMutation]
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
            setEditingTask(null);
          },
        }
      );
    }
  }, [editingTask, setEditingTask, updateTaskMutation]);

  const handleCloseEditModal = useCallback(() => {
    setEditingTask(null);
  }, [setEditingTask]);

  return (
    <Dialog open={open} onOpenChange={handleCloseEditModal}>
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
  );
};

export default EditTaskDialog;
