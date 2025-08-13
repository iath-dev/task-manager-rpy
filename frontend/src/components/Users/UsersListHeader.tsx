import React, { useCallback, useEffect, useState } from 'react'

import { useDebounce } from 'use-debounce'
import { PlusCircle } from 'lucide-react'

import {
  type SortOptions,
  type UserFilterValues,
  SORT_OPTIONS,
} from '@/services/userService'
import { useCreateUser } from '@/hooks/useUsers'
import type { CreateUserValues, UpdateUserValues } from '@/schemas/user'
import { ROLES } from '@/lib/constants'

import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Button } from '../ui/button'

import UserForm from './UserForm'

interface UsersListHeaderProps {
  onFilterChange: (filter: UserFilterValues) => void
}

const SortOptions: Record<SortOptions, string> = {
  full_name_asc: 'Full Name (A-Z)',
  full_name_desc: 'Full Name (Z-A)',
  email_asc: 'Email (A-Z)',
  email_desc: 'Email (Z-A)',
}

const UsersListHeader: React.FC<UsersListHeaderProps> = ({
  onFilterChange,
}) => {
  const [filter, setFilter] = useState<UserFilterValues>({
    search: '',
    role: undefined,
    sortBy: undefined,
  })

  const { search, role, sortBy } = filter

  const [debounceSearch] = useDebounce(search, 500)

  const { mutate: createUserMutation, isPending } = useCreateUser()

  const onFilterValueChange = (
    key: keyof UserFilterValues,
    value: string | undefined,
  ) => {
    setFilter(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleCreateSuccess = useCallback(
    (values: CreateUserValues | UpdateUserValues) => {
      // Only create user if password is present (i.e., it's a create, not update)
      if ('password' in values) {
        createUserMutation(values)
      }
    },
    [createUserMutation],
  )

  useEffect(() => {
    onFilterChange({ search: debounceSearch, role, sortBy })
  }, [debounceSearch, sortBy, role, onFilterChange])

  return (
    <section
      className="flex flex-col md:flex-row items-center justify-end gap-2"
      data-testid="user-list-header"
    >
      <Input
        value={search}
        placeholder="Search by name"
        className="w-full md:max-w-sm"
        onChange={({ target }) => onFilterValueChange('search', target.value)}
      />
      <div className="flex items-center gap-2 max-md:w-full">
        <Select
          value={role}
          onValueChange={(val: string) =>
            onFilterValueChange('role', val === role ? undefined : val)
          }
        >
          <SelectTrigger className="w-full md:max-w-xs">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Roles</SelectLabel>
              {ROLES.flatMap(role => (
                <SelectItem key={`role-${role}`} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={sortBy}
          onValueChange={(val: string) =>
            onFilterValueChange('sortBy', val === sortBy ? undefined : val)
          }
        >
          <SelectTrigger className="w-full md:max-w-xs">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {SORT_OPTIONS.flatMap(option => (
                <SelectItem key={`sort-${option}`} value={option}>
                  {SortOptions[option]}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              data-testid="user-list-header-add"
            >
              <PlusCircle />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create User</DialogTitle>
            </DialogHeader>
            <UserForm onSubmit={handleCreateSuccess} isPending={isPending} />
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}

export default UsersListHeader
