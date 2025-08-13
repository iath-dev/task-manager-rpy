import React from 'react'

import { useQuery } from '@tanstack/react-query'

import { useAuth } from '@/hooks/useAuth'
import { getUsersEmails } from '@/services/userService'

import { Button } from '../ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

interface UserEmailSelectProps {
  value: string | undefined
  onValueChange: (value: string | undefined) => void
}

const UserEmailSelect: React.FC<UserEmailSelectProps> = ({
  value,
  onValueChange,
}) => {
  const { isAdmin } = useAuth()
  const { data } = useQuery({
    enabled: isAdmin,
    queryKey: ['emails'],
    queryFn: () => getUsersEmails(),
  })

  const handleValueChange = (newValue: string) => {
    onValueChange(newValue === value ? undefined : newValue)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          data-testid="users-email-popover-button"
        >
          {value ? data?.data.find(u => u === value) : 'Filter by user'}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command data-testid="users-email-command">
          <CommandInput placeholder="Filter by user" />
          <CommandList>
            <CommandEmpty>No user find</CommandEmpty>
            <CommandGroup>
              {data?.data.map(email => (
                <CommandItem
                  key={`user-item-${email}`}
                  data-testid={`user-item-${email}`}
                  value={email}
                  onSelect={handleValueChange}
                >
                  {email}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default UserEmailSelect
