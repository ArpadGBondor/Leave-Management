import { TableColumn, SortByType } from './types';

function handleSort<T>(
  index: number,
  columns: TableColumn<T>[],
  setSortBy: React.Dispatch<React.SetStateAction<SortByType>>,
  setPage: React.Dispatch<React.SetStateAction<number>>
) {
  const col = columns[index];
  if (!col.sortable) return;
  setPage(0);
  setSortBy((s: SortByType): SortByType => {
    if (s.columnIndex !== index)
      return { columnIndex: index, direction: 'asc' };
    return {
      columnIndex: index,
      direction: s.direction === 'asc' ? 'desc' : 'asc',
    };
  });
}

type TableHeaderProps<T> = {
  columns: TableColumn<T>[];
  sortBy: SortByType;
  setSortBy: React.Dispatch<React.SetStateAction<SortByType>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export default function TableHeader<T>({
  columns,
  sortBy,
  setSortBy,
  setPage,
}: TableHeaderProps<T>) {
  return (
    <thead className="bg-brand-green-200 text-brand-green-900">
      <tr>
        {columns.map((col, i) => (
          <th
            key={col.key ?? String(i)}
            scope="col"
            className={`px-4 py-2 text-left text-sm font-medium text-brand-green-700 select-none ${
              col.align === 'center'
                ? 'text-center'
                : col.align === 'right'
                ? 'text-right'
                : 'text-left'
            } ${col.width ?? ''}`}
            onClick={() => handleSort(i, columns, setSortBy, setPage)}
          >
            <div className="flex items-center gap-2">
              <span>{col.header}</span>
              {col.sortable && (
                <span className="text-xs text-brand-green-600">
                  {sortBy.columnIndex === i
                    ? sortBy.direction === 'asc'
                      ? '▲'
                      : '▼'
                    : '↕'}
                </span>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}
