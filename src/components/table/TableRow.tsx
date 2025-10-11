import { TableColumn } from './types';

type TableRowProps<T> = {
  row: T;
  rowIndex: number;
  page: number;
  columns: TableColumn<T>[];
  pageSize: number;
  rowKey?: keyof T | ((row: T) => string | number); // how to identify rows
  onRowClick?: (row: T) => void;
};

export function getValueFromAccessor<T>(
  row: T,
  accessor: TableColumn<T>['accessor']
) {
  if (typeof accessor === 'function') return accessor(row);
  return (row as any)[accessor];
}

export default function TableRow<T>({
  row,
  rowIndex,
  page,
  columns,
  pageSize,
  rowKey,
  onRowClick,
}: TableRowProps<T>) {
  const getRowId = (row: T, idx: number) => {
    if (!rowKey) return idx;
    if (typeof rowKey === 'function') return rowKey(row);
    return (row as any)[rowKey];
  };

  return (
    <tr
      key={String(getRowId(row, page * pageSize + rowIndex))}
      className={`hover:bg-brand-green-100 cursor-${
        onRowClick ? 'pointer' : 'auto'
      }`}
      onClick={() => onRowClick?.(row)}
    >
      {columns.map((col, cIdx) => {
        const raw = getValueFromAccessor(row, col.accessor);
        const content = col.render ? col.render(raw, row) : raw;
        return (
          <td
            key={col.key ?? String(cIdx)}
            className={`px-4 py-3 text-sm align-top ${
              col.align === 'center'
                ? 'text-center'
                : col.align === 'right'
                ? 'text-right'
                : 'text-left'
            }  ${col.width ?? ''}`}
          >
            {content}
          </td>
        );
      })}
    </tr>
  );
}
