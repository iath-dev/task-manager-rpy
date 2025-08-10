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
import UserEmailSelect from "../Users/UserEmailSelect";
import { mapDatetimeToInputDate } from "@/lib/utils";
import { useAuth } from "../../hooks/useAuth";
import { PRIORITIES } from "@/lib/constants";

interface TaskFormProps {
  defaultValues?: Partial<TaskFormValues>;
  onSubmit: (values: TaskFormValues) => void;
  isPending: boolean;
  isEditMode?: boolean;
  onMarkAsCompleted?: () => void;
  isCompleted?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  defaultValues,
  onSubmit,
  isPending,
  isEditMode = false,
  onMarkAsCompleted,
  isCompleted = false,
}) => {
  const { isAdmin } = useAuth();
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      ...defaultValues,
      due_date: mapDatetimeToInputDate(defaultValues?.due_date),
      assigned_to: defaultValues?.assigned_to || undefined,
    },
  });

  useEffect(() => {
    form.reset({
      ...defaultValues,
      due_date: mapDatetimeToInputDate(defaultValues?.due_date),
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
              <FormItem className="w-full">
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
              <FormItem className="w-full">
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PRIORITIES.map((option) => (
                      <SelectItem key={option} value={option}>
                        <span className="first-letter:uppercase">{option}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {isAdmin && (
          <FormField
            control={form.control}
            name="assigned_to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned To</FormLabel>
                <FormControl>
                  <UserEmailSelect
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
            {isPending
              ? "Saving..."
              : isEditMode
              ? "Update Task"
              : "Create Task"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TaskForm;
