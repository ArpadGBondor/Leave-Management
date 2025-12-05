import React, { useMemo, useState } from 'react';
import TableHeader from './TableHeader';
import { TableColumn, SortByType } from './types';
import TableRow, { getValueFromAccessor } from './TableRow';
import TablePaginationFooter from './TablePaginationFooter';
import Fuse from 'fuse.js';
import TextInput from '../inputs/TextInput';
import Button from '../buttons/Button';

type TableProps<T> = {
  title?: string;
  data: T[];
  columns: TableColumn<T>[];
  pageSize?: number; // default: 10
  className?: string;
  rowKey?: keyof T | ((row: T) => string | number); // how to identify rows
  onRowClick?: (row: T) => void;
  highlightRow?: (row: T) => boolean;
  emptyState?: React.ReactNode;
  defaultSort?: SortByType;
};

export default function Table<T extends Record<string, any>>({
  title,
  data,
  columns,
  pageSize = 10,
  className = '',
  rowKey,
  onRowClick,
  highlightRow,
  emptyState = <div className="text-center text-brand-green-800">No data</div>,
  defaultSort,
}: TableProps<T>) {
  const [sortBy, setSortBy] = useState<SortByType>(
    defaultSort || {
      columnIndex: null,
      direction: 'asc',
    }
  );

  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const searchableColumns = columns.filter((col) => col.searchable);

  // Fuse.js instance - search each word separately
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    if (searchableColumns.length === 0) return data;

    const fuse = new Fuse(data, {
      keys: searchableColumns.map((col): string => col.searchable as string),
      threshold: 0.5, // Adjust fuzziness
      ignoreLocation: true,
    });

    // Split search term into words and search individually
    const words = searchTerm.trim().split(/\s+/);

    // Collect results for each word
    const resultsPerWord = words.map((word) =>
      fuse.search(word).map((result) => result.item)
    );

    // Merge results (OR logic: keep all items that appear in any word results)
    const mergedResults = Array.from(
      resultsPerWord.flat().reduce((set, item) => {
        set.add(item);
        return set;
      }, new Set<T>())
    );

    return mergedResults;
  }, [data, searchTerm, columns]);

  const sorted = useMemo(() => {
    if (sortBy.columnIndex === null) return [...filteredData];
    const col = columns[sortBy.columnIndex];
    if (!col) return [...filteredData];
    const accessor = col.accessor;
    const dir = sortBy.direction === 'asc' ? 1 : -1;
    return [...filteredData].sort((a, b) => {
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
  }, [filteredData, sortBy, columns]);

  const pageData = useMemo(() => {
    const start = page * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  const getRowId = (row: T, idx: number) => {
    if (!rowKey) return idx;
    if (typeof rowKey === 'function') return rowKey(row);
    return (row as any)[rowKey];
  };

  return (
    <div className={`w-full space-y-4 ${className}`}>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {title && (
          <h3 className="text-2xl font-bold text-brand-green-700">{title}</h3>
        )}
        {searchableColumns.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-stretch md:justify-end">
            <div className="md:max-w-64 flex-1">
              <TextInput
                id={'search'}
                label={''}
                name={'search'}
                value={searchTerm}
                placeholder="Enter search keyword"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Button
                label={'Clear search'}
                onClick={() => setSearchTerm('')}
                variant="danger"
              />
            </div>
          </div>
        )}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto">
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
                <td colSpan={columns.length}>
                  {searchTerm ? (
                    <div className="text-center text-brand-green-800">
                      No search results
                    </div>
                  ) : (
                    emptyState
                  )}
                </td>
              </tr>
            ) : (
              pageData.map((row, rowIndex) => (
                <TableRow
                  key={String(getRowId(row, page * pageSize + rowIndex))}
                  row={row}
                  columns={columns}
                  onRowClick={onRowClick}
                  highlightRow={highlightRow}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      {/* MOBILE CARD VIEW */}
      <div className=" grid md:hidden grid-cols-1 sm:grid-cols-2 gap-2">
        {pageData.length === 0 ? (
          searchTerm ? (
            <div className="text-center text-brand-green-800">
              No search results
            </div>
          ) : (
            emptyState
          )
        ) : (
          pageData.map((row, rowIndex) => (
            <button
              key={String(getRowId(row, page * pageSize + rowIndex))}
              onClick={() => onRowClick?.(row)}
              className={`w-full text-left p-4 rounded-xl border ${
                highlightRow && highlightRow(row)
                  ? 'bg-brand-purple-50 hover:bg-brand-purple-100 text-brand-purple-600'
                  : 'bg-brand-green-50 hover:bg-brand-green-100 text-brand-green-600'
              } cursor-${onRowClick ? 'pointer' : 'auto'} shadow-sm`}
            >
              <div className="">
                {columns.map((col, i) => {
                  const value = getValueFromAccessor(row, col.accessor);
                  const rendered = col.render ? col.render(value, row) : value;

                  return (
                    <div
                      key={col.key ?? i}
                      className={`py-1 w-full grid grid-cols-2 gap-2 items-center ${
                        i > 0 ? 'border-t border-brand-green-300' : ''
                      }`}
                    >
                      <div className="text-sm text-brand-green-600 font-semibold">
                        {col.header}
                      </div>

                      <div className="text-sm text-brand-green-600 text-right place-self-end">
                        {rendered}
                      </div>
                    </div>
                  );
                })}
              </div>
            </button>
          ))
        )}
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
