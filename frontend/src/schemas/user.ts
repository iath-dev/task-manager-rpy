import { z } from 'zod'

import { ROLES } from '@/lib/constants'

export const baseUserSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email format'),
  role: z.enum(ROLES).optional(),
  is_active: z.boolean().optional(),
})

export type BaseUserValues = z.infer<typeof baseUserSchema>

export const createUserSchema = baseUserSchema.extend({
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export type CreateUserValues = z.infer<typeof createUserSchema>

export const updateUserSchema = baseUserSchema

export type UpdateUserValues = z.infer<typeof updateUserSchema>
