import React, { useCallback, useMemo } from 'react'

import { useUpdateTask } from '@/hooks/useTasks'
import type { Task } from '@/interfaces/tasks'
import type { TaskFormValues } from '@/schemas/task'
import { useTaskStore } from '@/store/taskStore'
import { useMediaQuery } from '@/hooks/useMediaQuery'

import TaskForm from '../TaskForm/TaskForm'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '../ui/drawer'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'

const EditTaskDialog: React.FC = () => {
  const { editingTask, setEditingTask } = useTaskStore()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const { mutate: updateTaskMutation, isPending: isUpdating } = useUpdateTask()

  const open = useMemo(() => !!editingTask, [editingTask])

  const handleEditSubmit = useCallback(
    (values: TaskFormValues) => {
      if (editingTask) {
        updateTaskMutation(
          { id: editingTask.id, taskData: values as Partial<Task> },
          {
            onSuccess: () => {
              setEditingTask(null) // Limpiar la tarea en edición
            },
          },
        )
      }
    },
    [editingTask, setEditingTask, updateTaskMutation],
  )

  const handleMarkAsCompleted = useCallback(() => {
    if (
      editingTask &&
      window.confirm('Are you sure you want to mark this task as completed?')
    ) {
      updateTaskMutation(
        { id: editingTask.id, taskData: { completed: true } },
        {
          onSuccess: () => {
            setEditingTask(null)
          },
        },
      )
    }
  }, [editingTask, setEditingTask, updateTaskMutation])

  const handleCloseEditModal = useCallback(() => {
    setEditingTask(null)
  }, [setEditingTask])

  if (!isDesktop) {
    return (
      <Drawer open={open} onOpenChange={handleCloseEditModal}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader className="text-left">
              <DrawerTitle>Edit Task</DrawerTitle>
            </DrawerHeader>
            <ScrollArea className="max-h-[calc(100vh-25rem)] p-4">
              {editingTask && (
                <div className="overflow-y-auto">
                  <TaskForm
                    defaultValues={{
                      title: editingTask.title,
                      description: editingTask.description || '',
                      due_date: editingTask.due_date
                        ? new Date(editingTask.due_date)
                            .toISOString()
                            .split('T')[0]
                        : '',
                      priority: editingTask.priority || undefined,
                      assigned_to: editingTask.assigned_to?.email || undefined,
                    }}
                    onSubmit={handleEditSubmit}
                    isPending={isUpdating}
                    isEditMode={true}
                    onMarkAsCompleted={handleMarkAsCompleted}
                    isCompleted={editingTask.completed}
                  />
                </div>
              )}
            </ScrollArea>
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

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
              description: editingTask.description || '',
              due_date: editingTask.due_date
                ? new Date(editingTask.due_date).toISOString().split('T')[0]
                : '',
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
  )
}

export default EditTaskDialog
