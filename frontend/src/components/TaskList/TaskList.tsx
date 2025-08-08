import React, { useCallback, useState } from "react";

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
import { mockTasks, mockUsers } from "@/mocks/data";

interface TaskListProperties {
  defaultPageSize?: "5" | "10" | "15" | "20";
}

export const TaskList: React.FC<TaskListProperties> = ({
  defaultPageSize = "10",
}) => {
  const [pageSize, setPageSize] = useState<string>(defaultPageSize);
  const [page, setPage] = useState(0);

  const handleSearch = useCallback((query: filterSchemaType) => {
    console.log(query);
  }, []);

  const handleChangePage = (newPage: number) => {
    if (newPage <= 10 && newPage >= 0) {
      setPage(newPage);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <TaskListHeader users={mockUsers} onSearch={handleSearch} />
      </CardHeader>
      <CardContent>
        <TaskListBody tasks={mockTasks} />
      </CardContent>
      <CardFooter>
        <TaskListPagination
          page={page}
          pageSize={pageSize}
          totalPages={10}
          onPageChange={handleChangePage}
          onPageSizeChange={setPageSize}
        />
      </CardFooter>
    </Card>
  );
};
