import React, { useCallback, useState } from 'react'

import dayjs from 'dayjs'
import { Edit3 } from 'lucide-react'

import { useUpdateUser } from '@/hooks/useUsers'
import type { User } from '@/interfaces/user'
import { cn } from '@/lib/utils'
import type { UpdateUserValues } from '@/schemas/user'

import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { ScrollArea } from '../ui/scroll-area'

import UserForm from './UserForm'

interface UserListProps {
  users: User[]
}

const UserListContent: React.FC<UserListProps> = ({ users }) => {
  const [editUser, setEditUser] = useState<User | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const { mutate: updateTaskMutation, isPending } = useUpdateUser()

  const handleEditTask = useCallback((task: User) => {
    setEditUser(task)
    setIsEditModalOpen(true)
  }, [])

  const handleCloseEditModal = useCallback(() => {
    setEditUser(null)
    setIsEditModalOpen(false)
  }, [])

  const handleEditSubmit = useCallback(
    (values: UpdateUserValues) => {
      updateTaskMutation(
        {
          id: editUser?.id as number,
          userData: values,
        },
        {
          onSuccess: () => {
            setIsEditModalOpen(false)
            setEditUser(null)
          },
        },
      )
    },
    [editUser, updateTaskMutation],
  )

  return (
    <>
      <ScrollArea className="min-h-36 max-h-72 whitespace-nowrap">
        <ul
          className="mt-4 space-y-3.5 max-h-72 overflow-y-auto"
          data-testid="users-list"
        >
          {users.map(user => (
            <li
              key={user.id}
              className="flex justify-between items-center"
              data-testid={`users-list-${user.email}`}
            >
              <div className="flex flex-col gap-1">
                <div className="flex gap-2 items-center">
                  <h2
                    className={cn(
                      { 'text-muted-foreground': !user.is_active },
                      'text-lg font-medium font-sans first-letter:uppercase',
                    )}
                  >
                    {user.full_name}
                  </h2>
                  <Badge variant="outline" className="text-xs">
                    {user.role}
                  </Badge>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-xs text-muted-foreground font-mono tracking-tighter">
                    Last access {dayjs(user.last_access).format('YYYY-MM-DD')}
                  </span>
                  {!user.is_active && (
                    <span className="text-xs text-red-500 font-mono tracking-tighter">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
              <div>
                <Button
                  size="icon"
                  variant="ghost"
                  data-testid="users-list-edit"
                  onClick={() => handleEditTask(user)}
                >
                  <Edit3 />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>
      <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle data-testid="user-form-dialog-title">
              Edit Task
            </DialogTitle>
          </DialogHeader>
          <UserForm
            defaultValues={{
              email: editUser?.email || '',
              password: '',
              full_name: editUser?.full_name || '',
              role: editUser?.role ?? 'COMMON',
              is_active: editUser?.is_active ?? true,
            }}
            isEditMode
            isPending={isPending}
            onSubmit={handleEditSubmit}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default UserListContent
