import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  RowSelectionState,
} from '@tanstack/react-table';

export function useDataTable<T>(
  data: T[],
  columns: ColumnDef<T>[],
  initialState?: {
    sorting?: SortingState;
    columnFilters?: ColumnFiltersState;
    rowSelection?: RowSelectionState;
    globalFilter?: string;
  }
) {
  const [sorting, setSorting] = useState<SortingState>(
    initialState?.sorting || []
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    initialState?.columnFilters || []
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    initialState?.rowSelection || {}
  );
  const [globalFilter, setGlobalFilter] = useState(
    initialState?.globalFilter || ''
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return {
    table,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    rowSelection,
    setRowSelection,
    globalFilter,
    setGlobalFilter,
  };
}