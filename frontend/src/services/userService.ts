import type { PaginatedResponse } from '@/interfaces/pagination'
import type { User } from '@/interfaces/user'
import type { Role } from '@/lib/constants'
import type { CreateUserValues, UpdateUserValues } from '@/schemas/user'

import apiClient from './api'

export interface UserFilterValues {
  search: string
  role?: Role
  sortBy?: SortOptions
}

export const SORT_OPTIONS = [
  'full_name_asc',
  'full_name_desc',
  'email_asc',
  'email_desc',
] as const

export type SortOptions = (typeof SORT_OPTIONS)[number]

export async function getUsersEmails() {
  const res = await apiClient.get<string[]>('/users/emails')
  return res
}

export async function getUsers(
  page = 1,
  pageSize = 10,
  filter: UserFilterValues,
) {
  const res = await apiClient.get<PaginatedResponse<User>>('/users', {
    params: {
      page,
      page_size: pageSize,
      full_name: filter.search,
      role: filter.role,
      sort_by: filter.sortBy,
    },
  })
  return res.data
}

export const updateUser = async (
  uid: number,
  payload: UpdateUserValues,
): Promise<User> => {
  const { data } = await apiClient.put(`/users/${uid}`, payload)
  return data
}

export const createUser = async (payload: CreateUserValues): Promise<User> => {
  const { data } = await apiClient.post('/users', payload)
  return data
}
