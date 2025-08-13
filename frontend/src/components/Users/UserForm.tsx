import React, { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
  createUserSchema,
  updateUserSchema,
  type CreateUserValues,
  type UpdateUserValues,
} from '@/schemas/user'
import { cn } from '@/lib/utils'

import { Button } from '../ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Switch } from '../ui/switch'
import { ROLES } from '@/lib/constants'

export interface UserFormProps {
  defaultValues?: CreateUserValues | UpdateUserValues
  isPending?: boolean
  isEditMode?: boolean
  onSubmit: (values: CreateUserValues | UpdateUserValues) => void
}

const UserForm: React.FC<UserFormProps> = ({
  defaultValues,
  isPending,
  isEditMode = false,
  onSubmit,
}) => {
  const schema = isEditMode ? updateUserSchema : createUserSchema

  const form = useForm<UpdateUserValues | CreateUserValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      ...defaultValues,
    },
  })

  useEffect(() => {
    form.reset({
      ...defaultValues,
    })
  }, [defaultValues, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Task title"
                    className="w-full max-w-md"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Task title"
                    className="w-full max-w-md"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!isEditMode && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Task title"
                      className="w-full max-w-md"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <div
            className={cn('grid gap-2', {
              'grid-cols-1': !isEditMode,
              'grid-cols-2': isEditMode,
            })}
          >
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem data-testid="user-form-select">
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        data-testid="role-select"
                        className="w-full"
                      >
                        <SelectValue
                          defaultValue={'COMMON'}
                          placeholder="Select an role"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ROLES.flatMap(role => (
                        <SelectItem
                          key={`role-option-${role}`}
                          data-testid={`role-option-${role}`}
                          value={role}
                        >
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isEditMode && (
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className="ml-auto"
          data-testid="user-form-submit"
        >
          {isPending ? 'Saving...' : 'Save changes'}
        </Button>
      </form>
    </Form>
  )
}

export default UserForm
