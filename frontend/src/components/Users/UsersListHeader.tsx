import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useDebounce } from "use-debounce";
import type { UserFilterValues, SortOptionsType } from "@/services/userService";

interface UsersListHeaderProps {
  onFilterChange: (filter: UserFilterValues) => void;
}

const SortOptions: Record<SortOptionsType, string> = {
  full_name_asc: "Full Name (A-Z)",
  full_name_desc: "Full Name (Z-A)",
  email_asc: "Email (A-Z)",
  email_desc: "Email (Z-A)",
};

const UsersListHeader: React.FC<UsersListHeaderProps> = ({
  onFilterChange,
}) => {
  const [filter, setFilter] = useState<UserFilterValues>({
    search: "",
    role: undefined,
    sortBy: undefined,
  });

  const [debounceFilter] = useDebounce(filter, 500);

  const { search, role, sortBy } = debounceFilter;

  const onFilterValueChange = (key: keyof UserFilterValues, value: string) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    onFilterChange(debounceFilter);
  }, [debounceFilter, onFilterChange]);

  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Input
        value={search}
        placeholder="Search by name"
        className="w-full col-span-2"
        onChange={({ target }) => onFilterValueChange("search", target.value)}
      />
      <Select
        value={role}
        onValueChange={(val: string) => onFilterValueChange("role", val)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Roles</SelectLabel>
            {["ADMIN", "COMMON"].flatMap((role) => (
              <SelectItem key={`role-${role}`} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        value={sortBy}
        onValueChange={(val: string) => onFilterValueChange("sortBy", val)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Object.keys(SortOptions).flatMap((option) => (
              <SelectItem key={`sort-${option}`} value={option}>
                {SortOptions[option as SortOptionsType]}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </section>
  );
};

export default UsersListHeader;
