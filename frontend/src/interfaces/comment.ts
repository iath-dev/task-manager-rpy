import type { User } from './user'

export interface Comment {
  content: string
  id: number
  task_id: number
  owner: Pick<User, 'email' | 'full_name' | 'id'>
  created_at: Date
}
