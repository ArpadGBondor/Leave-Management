type TablePaginationFooterProps<T> = {
  sorted: T[];
  page: number;
  pageSize: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export default function TablePaginationFooter<T>({
  sorted,
  page,
  pageSize,
  setPage,
}: TablePaginationFooterProps<T>) {
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

  return (
    <div className="mt-2 flex flex-col justify-start items-center md:flex-row md:items-center md:justify-between gap-2 md:gap-4 text-brand-green-700">
      <div className="text-sm ">
        Showing <strong>{Math.min(sorted.length, page * pageSize + 1)}</strong>{' '}
        - <strong>{Math.min(sorted.length, (page + 1) * pageSize)}</strong> of{' '}
        <strong>{sorted.length}</strong>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="px-2 py-1 text-sm font-bold rounded cursor-pointer hover:underline disabled:opacity-50 disabled:cursor-auto disabled:hover:no-underline "
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          Prev
        </button>
        <div className="text-sm">Page</div>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={page + 1}
          onChange={(e) => {
            const v = Number(e.target.value || 1) - 1;
            if (Number.isFinite(v))
              setPage(Math.max(0, Math.min(totalPages - 1, v)));
          }}
          className="w-12 px-2 py-1 border border-brand-green-400 bg-brand-green-50 hover:bg-brand-green-100 rounded text-sm"
        />
        <div className="text-sm">of {totalPages}</div>
        <button
          className="px-2 py-1 text-sm font-bold rounded cursor-pointer hover:underline disabled:opacity-50 disabled:cursor-auto disabled:hover:no-underline"
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
