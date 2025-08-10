import React from "react";
import { Select } from "../ui/select";
import { getUsersEmails } from "@/services/userService";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
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

const TaskListUserFilter: React.FC<React.ComponentProps<typeof Select>> = ({
  value,
  onValueChange,
}) => {
  const { user: authUser } = useAuthStore();
  const { data } = useQuery({
    enabled: authUser?.role === "ADMIN",
    queryKey: ["emails"],
    queryFn: () => getUsersEmails(),
  });

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
                  onSelect={onValueChange}
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

  // return (
  //   <Select {...props}>
  //     <SelectTrigger>
  //       <SelectValue placeholder="Filter by user" />
  //     </SelectTrigger>
  //     <SelectContent>
  //       <SelectGroup>
  //         <SelectLabel>Users</SelectLabel>
  //         {authUser && (
  //           <SelectItem value="__assigned_to_me__">Assigned to me</SelectItem>
  //         )}
  //         <SelectSeparator />
  //         {data?.data.flatMap((email) => (
  //           <SelectItem key={`user-item-${email}`} value={email}>
  //             {email}
  //           </SelectItem>
  //         ))}
  //       </SelectGroup>
  //     </SelectContent>
  //   </Select>
  // );
};

export default TaskListUserFilter;
