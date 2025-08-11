import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getTaskComments, postComments } from '@/services/commentService'

export const usePostComment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ task_id, content }: { task_id: number; content: string }) =>
      postComments(task_id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
      toast.success('Comment posted.')
    },
    onError: error => {
      console.error('Error creating task:', error)
      toast.error('Failed to post the comment. Please try again.')
    },
  })
}

export const useComments = (task_id?: number) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['comments', task_id],
    enabled: !!task_id, // Only fetch if available is true
    initialData: [],
    queryFn: () => getTaskComments(task_id!),
  })

  return {
    data,
    isLoading,
    isError,
    error,
  }
}
