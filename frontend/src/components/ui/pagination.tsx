import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";
import { PAGE_SIZE_OPTIONS } from "@/lib/constants";

interface PaginationProps {
  page: number;
  pageSize: string;
  totalPages: number;
  pageSizeOptions?: string[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (page: string) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  pageSize,
  totalPages,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  onPageChange,
  onPageSizeChange,
}) => (
  <div className="flex w-full items-center justify-between">
    <div className="flex gap-2 items-center">
      <p className="text-xs">Element per page</p>
      <Select value={pageSize} onValueChange={onPageSizeChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Items per page</SelectLabel>
            {pageSizeOptions.flatMap((perPage) => (
              <SelectItem key={`page-size-${perPage}`} value={perPage}>
                {perPage}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <p className="text-xs">
        Page {page} of {totalPages}
      </p>
    </div>
    <div className="flex gap-2 items-center">
      <Button
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft />
        <span className="hidden md:inline">Prev</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <span className="hidden md:inline">Next</span>
        <ChevronRight />
      </Button>
    </div>
  </div>
);

export default Pagination;
