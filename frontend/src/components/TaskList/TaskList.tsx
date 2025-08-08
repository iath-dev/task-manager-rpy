import React, { useCallback, useState } from "react";
import { useTasks } from "@/hooks/useTasks";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { filterSchemaType } from "@/schemas/query";
import TaskListPagination from "./TaskListPagination";
import TaskListHeader from "./TaskListHeader";
import TaskListBody from "./TaskListBody";
import { Skeleton } from "../ui/skeleton";

interface TaskListProperties {
  defaultPageSize?: "5" | "10" | "15" | "20";
}

export const TaskList: React.FC<TaskListProperties> = ({
  defaultPageSize = "5",
}) => {
  const [pageSize, setPageSize] = useState<string>(defaultPageSize);
  const [page, setPage] = useState(1);
  // Nuevos estados para los filtros
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [priority, setPriority] = useState<string | undefined>(undefined);
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);

  const {
    tasks = [],
    totalPages = 1,
    isLoading,
  } = useTasks({
    page,
    pageSize: parseInt(pageSize),
    search,
    priority,
    user_email: userEmail,
  });

  const handleSearch = useCallback((filters: filterSchemaType) => {
    // Cuando los filtros cambian, reiniciamos la página a 1
    setPage(1);
    setSearch(filters.search);
    setPriority(filters.priority);
    setUserEmail(filters.user); // Asumiendo que filters.user es el email o ID que el backend espera
  }, []);

  const handleChangePage = (newPage: number) => {
    if (newPage <= totalPages && newPage >= 1) {
      setPage(newPage);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <TaskListHeader onSearch={handleSearch} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="w-full min-h-60" />
        ) : (
          <TaskListBody tasks={tasks} />
        )}
      </CardContent>
      <CardFooter>
        <TaskListPagination
          page={page}
          pageSize={pageSize}
          totalPages={totalPages || 0} // Usar totalPages del hook
          onPageChange={handleChangePage}
          onPageSizeChange={setPageSize}
        />
      </CardFooter>
    </Card>
  );
};
