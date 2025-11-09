import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";

import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components";
import type { Match } from "@/types";

export const DataTable = ({
  columns,
  data,
}: {
  columns: ColumnDef<Match>[];
  data: Match[];
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  });

  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const availableYears = useMemo(() => {
    const years = data.map((match) => new Date(match.date).getFullYear());
    return ["all", ...Array.from(new Set(years)).sort((a, b) => b - a)];
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <Input
          placeholder="Filter by opponent..."
          value={
            (table.getColumn("opponent")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("opponent")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Select
          value={(table.getColumn("date")?.getFilterValue() as string) ?? "all"}
          onValueChange={(value) =>
            table
              .getColumn("date")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Filter year" />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year === "all" ? "All Time" : year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={
            (table.getColumn("result")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table
              .getColumn("result")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Filter result" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Results</SelectItem>
            <SelectItem value="W">Wins</SelectItem>
            <SelectItem value="D">Draws</SelectItem>
            <SelectItem value="L">Losses</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => table.previousPage()}
              className={
                !table.getCanPreviousPage()
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {getPageNumbers().map((page, idx) => (
            <PaginationItem key={idx}>
              {page === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => table.setPageIndex(page - 1)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => table.nextPage()}
              className={
                !table.getCanNextPage()
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
