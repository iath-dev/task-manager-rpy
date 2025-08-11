import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useComments, usePostComment } from '@/hooks/useComments'
import { useTaskStore } from '@/store/taskStore'
import { commentSchema, type CommentInputs } from '@/schemas/comment'

import { ScrollArea } from '../ui/scroll-area'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const CommentList: React.FC = () => {
  const editingTask = useTaskStore(state => state.editingTask)
  const { data } = useComments(editingTask?.id)

  const { mutate: postCommentMutation, isPending } = usePostComment()

  const form = useForm<CommentInputs>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: '',
    },
  })

  const handlePostComment = (values: CommentInputs) => {
    const { comment } = values

    if (!editingTask) return

    postCommentMutation({
      task_id: editingTask.id,
      content: comment,
    })

    form.reset()
  }

  if (!editingTask) return null

  return (
    <div>
      <h1 className="text-xl mb-4">Comments</h1>
      <ScrollArea>
        <ul className="max-h-36">
          {data.map(comment => (
            <li key={comment.id} className="mb-2 p-2 border rounded">
              <p className="text-sm font-mono tracking-tighter text-muted-foreground">
                {comment.content}
              </p>
              <span className="w-full flex items-center justify-end gap-2">
                <span className="text-xs text-muted-foreground">
                  {new Date(comment.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </span>
                <span className="text-xs text-muted-foreground">
                  by {comment.owner.email}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </ScrollArea>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handlePostComment)}
          className="flex gap-2 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="w-full">
                  <Input placeholder="Place your comment" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="outline" disabled={isPending}>
            {isPending ? 'Posting' : 'Post'}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default CommentList
