import React from "react";
import dayjs from "dayjs";

import { PriorityEnum, type Task } from "@/interfaces/tasks";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Edit, Trash } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface TaskListBodyProps {
  tasks: Task[];
  onEditTask: (task: Task) => void; // Nueva prop para editar
  onDeleteTask: (taskId: number) => void; // Nueva prop para eliminar
}

const PriorityMap: Record<
  PriorityEnum,
  "destructive" | "secondary" | "outline" | "default" | "info" | "success"
> = {
  [PriorityEnum.High]: "destructive",
  [PriorityEnum.Medium]: "info",
  [PriorityEnum.Low]: "success",
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
                <h4 className="text-gl font-medium font-sans first-letter:uppercase">
                  {task.title}
                </h4>
                <Badge variant={PriorityMap[task.priority]}>
                  {task.priority.toUpperCase()}
                </Badge>
                {user?.email == task.assigned_to?.email && (
                  <Badge variant="outline">Assigned to you</Badge>
                )}
              </div>
              <div className="flex gap-3 font-mono text-xs text-gray-400">
                {task.due_date && (
                  <span className="tracking-tighter">
                    Due to {dayjs(task.due_date).format("YYYY-MM-DD")}
                  </span>
                )}
                <span className="tracking-tighter">
                  Create by {task.created_by.email}
                </span>
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
