export type TableColumn<T> = {
  key?: string; // optional unique key for column
  header: React.ReactNode;
  accessor: keyof T | ((row: T) => any);
  render?: (value: any, row: T) => React.ReactNode; // custom cell renderer
  sortable?: boolean;
  width?: string; // Tailwind width classes or inline style string
  align?: 'left' | 'center' | 'right';
};

export type SortByType = {
  columnIndex: number | null;
  direction: 'asc' | 'desc';
};
