import type { Role } from '@/lib/constants'
import type { UserFilterValues } from '@/services/userService'

export interface User {
  email: string
  full_name: string
  id: number
  role: Role
  last_access: string
  is_active: boolean
}

export interface UseUsersParams {
  page: number
  pageSize: number
  filter: UserFilterValues
}
