import React, { useMemo, useState } from 'react';
import TableHeader from './TableHeader';
import { TableColumn, SortByType } from './types';
import TableRow, { getValueFromAccessor } from './TableRow';
import TablePaginationFooter from './TablePaginationFooter';

type TableProps<T> = {
  title?: string;
  data: T[];
  columns: TableColumn<T>[];
  pageSize?: number; // default: 10
  className?: string;
  rowKey?: keyof T | ((row: T) => string | number); // how to identify rows
  onRowClick?: (row: T) => void;
  emptyState?: React.ReactNode;
};

export default function Table<T extends Record<string, any>>({
  title,
  data,
  columns,
  pageSize = 10,
  className = '',
  rowKey,
  onRowClick,
  emptyState = <div className="text-center text-brand-green-800">No data</div>,
}: TableProps<T>) {
  const [sortBy, setSortBy] = useState<SortByType>({
    columnIndex: null,
    direction: 'asc',
  });

  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    if (sortBy.columnIndex === null) return [...data];
    const col = columns[sortBy.columnIndex];
    if (!col) return [...data];
    const accessor = col.accessor;
    const dir = sortBy.direction === 'asc' ? 1 : -1;
    return [...data].sort((a, b) => {
      const va = getValueFromAccessor(a, accessor);
      const vb = getValueFromAccessor(b, accessor);
      // basic comparisons (numbers, strings, dates)
      if (va == null && vb == null) return 0;
      if (va == null) return -1 * dir;
      if (vb == null) return 1 * dir;
      if (typeof va === 'number' && typeof vb === 'number')
        return (va - vb) * dir;
      const sa = String(va).toLowerCase();
      const sb = String(vb).toLowerCase();
      if (sa < sb) return -1 * dir;
      if (sa > sb) return 1 * dir;
      return 0;
    });
  }, [data, sortBy, columns]);

  const pageData = useMemo(() => {
    const start = page * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  return (
    <div className={'w-full ' + className}>
      <h3 v-if={title} className="text-2xl font-bold text-brand-green-700 mb-2">
        {title}
      </h3>
      <div className="overflow-x-auto block">
        <table className="divide-y bg-brand-green-50 divide-brand-green-400 border border-brand-green-400 border-collapse table-auto min-w-full">
          <TableHeader
            columns={columns}
            sortBy={sortBy}
            setSortBy={setSortBy}
            setPage={setPage}
          />
          <tbody className="bg-brand-green-50 divide-y divide-brand-green-200 text-brand-green-600">
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>{emptyState}</td>
              </tr>
            ) : (
              pageData.map((row, rowIndex) => (
                <TableRow
                  row={row}
                  rowIndex={rowIndex}
                  page={page}
                  columns={columns}
                  pageSize={pageSize}
                  rowKey={rowKey}
                  onRowClick={onRowClick}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePaginationFooter
        sorted={sorted}
        page={page}
        pageSize={pageSize}
        setPage={setPage}
      />
    </div>
  );
}
