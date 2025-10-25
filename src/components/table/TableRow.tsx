import { TableColumn } from './types';

type TableRowProps<T> = {
  row: T;
  columns: TableColumn<T>[];
  onRowClick?: (row: T) => void;
  highlightRow?: (row: T) => boolean;
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
  columns,
  onRowClick,
  highlightRow,
}: TableRowProps<T>) {
  return (
    <tr
      className={`hover:bg-brand-green-100 cursor-${
        onRowClick ? 'pointer' : 'auto'
      } ${
        highlightRow && highlightRow(row)
          ? 'bg-brand-purple-50 hover:bg-brand-purple-100 text-brand-purple-600'
          : 'bg-brand-green-50 hover:bg-brand-green-100 text-brand-green-600'
      }`}
      onClick={() => onRowClick?.(row)}
    >
      {columns.map((col, cIdx) => {
        const raw = getValueFromAccessor(row, col.accessor);
        const content = col.render ? col.render(raw, row) : raw;
        return (
          <td
            key={col.key ?? String(cIdx)}
            className={`px-4 py-3 text-sm align-center ${
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
