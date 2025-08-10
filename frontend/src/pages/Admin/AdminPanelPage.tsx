import { useCallback, useState } from "react";

import ListPagination from "@/components/ListPagination/ListPagination";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useUsers } from "@/hooks/useUsers";
import UserListContent from "@/components/Users/UsersListBody";
import UsersListHeader from "@/components/Users/UsersListHeader";
import type { UserFilterValues } from "@/services/userService";

export default function AdminPanelPage() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<string>("");
  const [role, setRole] = useState<UserFilterValues["role"]>(undefined);
  const [sortBy, setSortBy] = useState<UserFilterValues["sortBy"]>(undefined);

  const filter: UserFilterValues = {
    search,
    role,
    sortBy,
  };
  const [pageSize, setPageSize] = useState<string>("5");

  const { users = [], totalPages = 1 } = useUsers({
    page: page,
    pageSize: pageSize ? parseInt(pageSize) : 5,
    filter: filter,
  });

  const handleChangePage = (newPage: number) => {
    if (newPage <= totalPages && newPage >= 1) {
      setPage(newPage);
    }
  };

  const handleFilter = useCallback((filterValues: UserFilterValues) => {
    setPage(1);
    setSearch(filterValues.search);
    setRole(filterValues.role);
    setSortBy(filterValues.sortBy);
  }, []);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <Card>
        <CardHeader>
          <UsersListHeader onFilterChange={handleFilter} />
        </CardHeader>
        <CardContent>
          <UserListContent users={users} />
        </CardContent>
        <CardFooter className="flex justify-end">
          <ListPagination
            page={page}
            totalPages={totalPages || 1}
            pageSize={pageSize}
            onPageChange={handleChangePage}
            onPageSizeChange={setPageSize}
          />
        </CardFooter>
      </Card>
    </section>
  );
}
