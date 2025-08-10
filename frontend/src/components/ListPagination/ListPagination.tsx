import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface ListPagination {
  page: number;
  pageSize: string;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (page: string) => void;
}

const ListPagination: React.FC<ListPagination> = ({
  page,
  pageSize,
  totalPages,
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
            {[5, 10, 15].flatMap((perPage) => (
              <SelectItem key={`page-size-${perPage}`} value={`${perPage}`}>
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

export default ListPagination;
