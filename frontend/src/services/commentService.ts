import type { Comment } from '@/interfaces/comment'

import apiClient from './api'

export async function getTaskComments(task_id: number) {
  const { data } = await apiClient.get<Comment[]>(`/tasks/${task_id}/comments`)
  return data
}

export async function postComments(task_id: number, content: string) {
  const { data } = await apiClient.post<Comment>(`/tasks/${task_id}/comments`, {
    content,
  })
  return data
}
