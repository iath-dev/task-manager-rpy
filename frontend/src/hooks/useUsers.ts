import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { UseUsersParams } from '@/interfaces/user'
import { createUser, getUsers, updateUser } from '@/services/userService'
import type { CreateUserValues, UpdateUserValues } from '@/schemas/user'

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: UseUsersParams) => [...userKeys.lists(), params] as const,
}

export const useUsers = ({ page, pageSize, filter }: UseUsersParams) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: userKeys.list({ page, pageSize, filter }),
    queryFn: () => getUsers(page, pageSize, filter),
  })

  return {
    users: data?.items,
    totalPages: data?.total_pages,
    isLoading,
    isError,
    error,
  }
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      userData,
    }: {
      id: number
      userData: UpdateUserValues
    }) => updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User updated successfully!')
    },
    onError: error => {
      console.error('Error updating user:', error)
      toast.error('Failed to update user. Please try again.')
    },
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userData: CreateUserValues) => createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User created successfully.')
    },
    onError: error => {
      console.error('Error creating task:', error)
      toast.error('Failed to create user. Please try again.')
    },
  })
}
