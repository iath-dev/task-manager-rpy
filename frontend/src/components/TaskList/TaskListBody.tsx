import React from 'react'

import { Edit, Trash } from 'lucide-react'

import { type Task } from '@/interfaces/tasks'
import type { Priority } from '@/lib/constants'
import { mapDatetimeToInputDate } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { useTaskStore } from '@/store/taskStore'

import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'

interface TaskListBodyProps {
  tasks: Task[]
  onDeleteTask: (taskId: number) => void // Nueva prop para eliminar
}

const PriorityMap: Record<
  Priority,
  'destructive' | 'secondary' | 'outline' | 'default' | 'info' | 'success'
> = {
  high: 'destructive',
  medium: 'info',
  low: 'success',
}

const TaskListBody: React.FC<TaskListBodyProps> = ({ tasks, onDeleteTask }) => {
  const user = useAuthStore(state => state.user)
  const setEditingTask = useTaskStore(state => state.setEditingTask)

  return (
    <ScrollArea className="min-h-36 max-h-72 whitespace-nowrap">
      <ul className="w-full max-h-72 space-y-3.5" data-testid="task-list-body">
        {tasks.map(task => (
          <li
            key={`task-item-${task.id}`}
            data-testid={`task-list-${task.id}`}
            className="flex items-center justify-between"
          >
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
              <div className="flex gap-2 font-mono text-xs text-gray-400 md:truncate max-w-xs">
                {task.due_date && (
                  <span className="tracking-tighter">
                    Due to {mapDatetimeToInputDate(task.due_date)}
                  </span>
                )}
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
                data-testid="task-item-delete"
                onClick={() => onDeleteTask(task.id)}
              >
                <Trash />
              </Button>
              <Button
                variant="outline"
                size="icon"
                data-testid="task-item-edit"
                onClick={() => setEditingTask(task)}
              >
                <Edit />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </ScrollArea>
  )
}

export default TaskListBody
