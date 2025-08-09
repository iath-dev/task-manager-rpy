import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { taskFormSchema, type TaskFormValues } from "@/schemas/task";
import { useAuthStore } from "@/store/authStore";
import TaskListUserFilter from "../TaskList/TaskListUserFilter";

interface TaskFormProps {
  defaultValues?: Partial<TaskFormValues>;
  onSubmit: (values: TaskFormValues) => void;
  isPending: boolean;
  isEditMode?: boolean;
  onMarkAsCompleted?: () => void; // Nueva prop
  isCompleted?: boolean; // Nueva prop
}

const TaskForm: React.FC<TaskFormProps> = ({
  defaultValues,
  onSubmit,
  isPending,
  isEditMode = false,
  onMarkAsCompleted,
  isCompleted = false,
}) => {
  const { user } = useAuthStore();
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      ...defaultValues,
      // Asegurarse de que due_date sea una cadena YYYY-MM-DD para el input type="date"
      due_date: defaultValues?.due_date
        ? defaultValues.due_date.split("T")[0]
        : "",
      // Asegurarse de que assigned_to sea una cadena o undefined
      assigned_to: defaultValues?.assigned_to || undefined,
    },
  });

  // Resetear el formulario cuando defaultValues cambien (para modo edición)
  useEffect(() => {
    form.reset({
      ...defaultValues,
      due_date: defaultValues?.due_date
        ? defaultValues.due_date.split("T")[0]
        : "",
      assigned_to: defaultValues?.assigned_to || undefined,
    });
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Task description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex max-md:flex-col gap-2">
          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {user?.role == "ADMIN" && (
          <FormField
            control={form.control}
            name="assigned_to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned To</FormLabel>
                <FormControl>
                  <TaskListUserFilter
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="flex justify-between items-center w-full">
          {isEditMode && !isCompleted && onMarkAsCompleted && (
            <Button
              type="button"
              variant="outline"
              onClick={onMarkAsCompleted}
              disabled={isPending}
            >
              Mark as Completed
            </Button>
          )}
          <Button type="submit" disabled={isPending} className="ml-auto">
            {isPending ? "Saving..." : isEditMode ? "Update Task" : "Create Task"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TaskForm;
