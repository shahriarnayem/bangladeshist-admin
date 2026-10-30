'use client';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
// Component Imports
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// Util Imports
import { cn } from '@/lib/utils';
import { userTableColumns } from './user-table-columns';
export function UserTable({ paginatedUsers, totalPages, sorting, onSortingChange }) {
    const sortingState = sorting ? [
        sorting
    ] : [];
    const handleSortingChange = (updater)=>{
        const nextSorting = typeof updater === 'function' ? updater(sortingState) : updater;
        if (nextSorting.length === 0) {
            onSortingChange(null);
            return;
        }
        onSortingChange({
            id: nextSorting[0].id,
            desc: nextSorting[0].desc
        });
    };
    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data: paginatedUsers,
        columns: userTableColumns,
        manualPagination: true,
        manualFiltering: true,
        manualSorting: true,
        pageCount: totalPages,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row)=>row.id,
        enableRowSelection: false,
        enableSortingRemoval: false,
        state: {
            sorting: sortingState
        },
        onSortingChange: handleSortingChange
    });
    return <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup)=><TableRow key={headerGroup.id} className='h-14 border-t'>
            {headerGroup.headers.map((header)=><TableHead key={header.id} style={{
                width: `${header.getSize()}px`
            }} className='text-muted-foreground first:pl-4 last:px-4 last:text-center'>
                {header.isPlaceholder ? null : header.column.getCanSort() ? <div className={cn(header.column.getCanSort() && 'flex h-full cursor-pointer items-center justify-between gap-2 select-none')} onClick={header.column.getToggleSortingHandler()} onKeyDown={(event)=>{
                if (header.column.getCanSort() && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault();
                    header.column.getToggleSortingHandler()?.(event);
                }
            }} tabIndex={header.column.getCanSort() ? 0 : undefined}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {({
                asc: <ChevronUpIcon className='size-4 shrink-0 opacity-60' aria-hidden='true'/>,
                desc: <ChevronDownIcon className='size-4 shrink-0 opacity-60' aria-hidden='true'/>
            })[header.column.getIsSorted()] ?? null}
                  </div> : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>)}
          </TableRow>)}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? table.getRowModel().rows.map((row)=><TableRow key={row.id}>
              {row.getVisibleCells().map((cell)=><TableCell key={cell.id} className='h-14 first:w-12.5 first:pl-4 last:w-29 last:px-4'>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>)}
            </TableRow>) : <TableRow>
            <TableCell colSpan={userTableColumns.length} className='h-24 text-center'>
              No results.
            </TableCell>
          </TableRow>}
      </TableBody>
    </Table>;
}
