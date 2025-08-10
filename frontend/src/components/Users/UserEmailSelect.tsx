import React from "react";
import { getUsersEmails } from "@/services/userService";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

// TODO: [COMPONENT_STRUCTURE][NAMING] This component is named `TaskListUserFilter` but is used in two different contexts:
// 1. As a filter in the `TaskListHeader`.
// 2. As a user selector in the `TaskForm`.
// This dual responsibility can be confusing. Consider the following refactor:
// - Rename this component to something more generic, like `UserSelect`.
// - Move it to a more shared location, such as `src/components/Users/` or `src/components/shared/`,
//   to reflect its reusable nature.
// This will make its purpose clearer and improve the project's component structure.

interface UserEmailSelectProps {
  value: string | undefined;
  onValueChange: (value: string | undefined) => void;
}

const UserEmailSelect: React.FC<UserEmailSelectProps> = ({
  value,
  onValueChange,
}) => {
  const { isAdmin } = useAuth();
  const { data } = useQuery({
    enabled: isAdmin,
    queryKey: ["emails"],
    queryFn: () => getUsersEmails(),
  });

  const handleValueChange = (newValue: string) => {
    onValueChange(newValue === value ? undefined : newValue);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox">
          {value ? data?.data.find((u) => u === value) : "Filter by user"}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder="Filter by user" />
          <CommandList>
            <CommandEmpty>No user find</CommandEmpty>
            <CommandGroup>
              {data?.data.map((email) => (
                <CommandItem
                  key={`user-item-${email}`}
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
  );
};

export default UserEmailSelect;
