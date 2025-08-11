import React from "react";

import { Edit, Trash } from "lucide-react";

import { type Task } from "@/interfaces/tasks";
import type { Priority } from "@/lib/constants";
import { mapDatetimeToInputDate } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";


interface TaskListBodyProps {
  tasks: Task[];
  onEditTask: (task: Task) => void; // Nueva prop para editar
  onDeleteTask: (taskId: number) => void; // Nueva prop para eliminar
}

const PriorityMap: Record<
  Priority,
  "destructive" | "secondary" | "outline" | "default" | "info" | "success"
> = {
  high: "destructive",
  medium: "info",
  low: "success",
};

const TaskListBody: React.FC<TaskListBodyProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
}) => {
  const user = useAuthStore((state) => state.user);

  return (
    <ScrollArea className="min-h-36 max-h-72 whitespace-nowrap">
      <ul className="w-full max-h-72 space-y-3.5">
        {tasks.map((task) => (
          <li key={`task-item-${task.id}`} className="flex justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex gap-3">
                <h4 className="text-lg font-medium font-sans first-letter:uppercase">
                  {task.title}
                </h4>
                <Badge variant={PriorityMap[task.priority]}>
                  {task.priority.toUpperCase()}
                </Badge>
                {user?.email === task.assigned_to?.email && (
                  <Badge variant="outline">Assigned to you</Badge>
                )}
              </div>
              <div className="flex gap-2 font-mono text-xs text-gray-400">
                {task.due_date && (
                  <span className="tracking-tighter">
                    Due to {mapDatetimeToInputDate(task.due_date)}
                  </span>
                )}
                <span className="tracking-tighter">
                  Create by {task.created_by.email}
                </span>
                {task.completed && (
                  <span className="tracking-tighter text-emerald-500">
                    Completed
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteTask(task.id)}
              >
                <Trash />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEditTask(task)}
              >
                <Edit />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
};

export default TaskListBody;
