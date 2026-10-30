'use client';
import { useState } from 'react';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { ChevronLeftIcon, ChevronRightIcon, EllipsisVerticalIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePagination } from '@/hooks/use-pagination';
import { cn } from '@/lib/utils';
export const columns = [
    {
        accessorKey: 'title',
        header: 'Article Headline',
        cell: ({ row })=><div className='flex flex-col gap-0.5 max-w-[340px]'>
        <span className='text-card-foreground font-medium text-sm line-clamp-1'>
          {row.getValue('title')}
        </span>
        <span className='text-muted-foreground text-xs font-mono truncate'>
          thechronicle.press/{row.original.slug}
        </span>
      </div>
    },
    {
        accessorKey: 'author',
        header: 'Author / Contributor',
        cell: ({ row })=><div className='flex items-center gap-2'>
        <Avatar className='size-8'>
          <AvatarImage src={row.original.avatar} alt={row.original.author} className='grayscale'/>
          <AvatarFallback className='text-xs'>{row.original.avatarFallback}</AvatarFallback>
        </Avatar>
        <div className='flex flex-col text-xs'>
          <span className='text-card-foreground font-medium'>{row.original.author}</span>
          <span className='text-muted-foreground'>{row.original.role}</span>
        </div>
      </div>
    },
    {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row })=><span className='inline-flex items-center rounded border border-foreground/25 bg-muted/70 px-2 py-0.5 text-xs font-medium tracking-wide text-foreground'>
        {row.getValue('category')}
      </span>
    },
    {
        accessorKey: 'reads',
        header: 'Readers',
        cell: ({ row })=>{
            const reads = row.original.reads;
            return <span className='font-mono font-medium text-sm text-foreground'>
          {reads.toLocaleString()}
        </span>;
        }
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row })=>{
            const status = row.getValue('status') || '';
            return <span className={cn('inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider', status === 'published' && 'border border-foreground bg-foreground text-background', status === 'in review' && 'border border-foreground/50 bg-foreground/10 text-foreground', status === 'scheduled' && 'border border-dashed border-foreground/60 text-foreground', status === 'draft' && 'border border-dashed border-foreground/30 text-muted-foreground')}>
          {status}
        </span>;
        }
    },
    {
        id: 'actions',
        header: ()=>'Actions',
        cell: ()=><RowActions/>,
        size: 60,
        enableHiding: false
    }
];
const TransactionDatatable = ({ data })=>{
    const pageSize = 5;
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: pageSize
    });
    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        state: {
            pagination
        }
    });
    const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
        currentPage: table.getState().pagination.pageIndex + 1,
        totalPages: table.getPageCount(),
        paginationItemsToDisplay: 2
    });
    return <div className='w-full'>
      <div className='border-b'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup)=><TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header)=>{
            return <TableHead key={header.id} className='text-muted-foreground h-14 first:pl-4'>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>;
        })}
              </TableRow>)}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? table.getRowModel().rows.map((row)=><TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell)=><TableCell key={cell.id} className='first:pl-4'>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>)}
                </TableRow>) : <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-between gap-3 px-6 py-4 max-sm:flex-col md:max-lg:flex-col'>
        <p className='text-muted-foreground text-sm whitespace-nowrap' aria-live='polite'>
          Showing{' '}
          <span>
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min(Math.max(table.getState().pagination.pageIndex * table.getState().pagination.pageSize + table.getState().pagination.pageSize, 0), table.getRowCount())}
          </span>{' '}
          of <span>{table.getRowCount().toString()} entries</span>
        </p>

        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button className='disabled:pointer-events-none disabled:opacity-50' variant='ghost' onClick={()=>table.previousPage()} disabled={!table.getCanPreviousPage()} aria-label='Go to previous page'>
                  <ChevronLeftIcon aria-hidden='true'/>
                  Previous
                </Button>
              </PaginationItem>

              {showLeftEllipsis && <PaginationItem>
                  <PaginationEllipsis/>
                </PaginationItem>}

              {pages.map((page)=>{
        const isActive = page === table.getState().pagination.pageIndex + 1;
        return <PaginationItem key={page}>
                    <Button size='icon' className={`${!isActive && 'bg-primary/10 text-primary hover:bg-primary/20 focus-visible:ring-primary/20 dark:focus-visible:ring-primary/40'}`} onClick={()=>table.setPageIndex(page - 1)} aria-current={isActive ? 'page' : undefined}>
                      {page}
                    </Button>
                  </PaginationItem>;
    })}

              {showRightEllipsis && <PaginationItem>
                  <PaginationEllipsis/>
                </PaginationItem>}

              <PaginationItem>
                <Button className='disabled:pointer-events-none disabled:opacity-50' variant='ghost' onClick={()=>table.nextPage()} disabled={!table.getCanNextPage()} aria-label='Go to next page'>
                  Next
                  <ChevronRightIcon aria-hidden='true'/>
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>;
};
export default TransactionDatatable;
function RowActions() {
    return <DropdownMenu>
      <DropdownMenuTrigger render={<Button size='icon' variant='ghost' aria-label='Edit item'/>}>
        <EllipsisVerticalIcon className='size-5' aria-hidden='true'/>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Duplicate</span>
          </DropdownMenuItem>
          <DropdownMenuItem variant='destructive'>
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>;
}
