import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Edit, Trash } from "lucide-react";
import { PriorityEnum, type TaskResponse } from "@/interfaces/tasks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";

interface TaskListBodyProps {
  tasks: TaskResponse[];
}

const PriorityMap: Record<
  PriorityEnum,
  "destructive" | "secondary" | "outline" | "default" | "info" | "success"
> = {
  [PriorityEnum.High]: "destructive",
  [PriorityEnum.Medium]: "info",
  [PriorityEnum.Low]: "success",
};

const TaskListBody: React.FC<TaskListBodyProps> = ({ tasks }) => {
  return (
    <ScrollArea className="min-h-36 max-h-72 whitespace-nowrap">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assigned to</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task, i) => (
            <TableRow key={`task-item-${i}`}>
              <TableCell>
                <span className="font-medium">{task.title}</span>
              </TableCell>
              <TableCell>
                <Badge variant={PriorityMap[task.priority]}>
                  {task.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {task.assigned_to?.email ?? "unassigned"}
                </Badge>
              </TableCell>
              <TableCell>
                <div>
                  <Button variant="ghost" size="icon">
                    <Trash />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Edit />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default TaskListBody;
