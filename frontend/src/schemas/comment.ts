import { z } from 'zod'

export const commentSchema = z.object({
  comment: z
    .string()
    .min(1, 'Comment is required')
    .max(2000, 'Comment cannot be longer than 500 characters'),
})

export type CommentInputs = z.infer<typeof commentSchema>
