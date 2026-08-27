import { LuChevronsLeft, LuChevronLeft, LuChevronRight, LuChevronsRight } from "react-icons/lu";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

/**
 * Custom pagination for react-data-table-component.
 * Props: currentPage, rowCount, rowsPerPage, onChangePage, onChangeRowsPerPage
 * Optional: paginationRowsPerPageOptions (array)
 */
export default function CustomPagination({
  currentPage,
  rowCount,
  rowsPerPage,
  onChangePage,
  onChangeRowsPerPage,
  paginationRowsPerPageOptions = ROWS_PER_PAGE_OPTIONS,
}) {
  const totalPages = Math.max(1, Math.ceil(rowCount / rowsPerPage));
  const start = rowCount === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const end = Math.min(currentPage * rowsPerPage, rowCount);

  const handleRowsPerPageChange = (e) => {
    const value = Number(e.target.value);
    onChangeRowsPerPage(value, currentPage);
  };

  const btnClass =
    "flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-45 disabled:cursor-not-allowed";
  const selectClass =
    "rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400";

  return (
    <div className="flex flex-wrap items-center justify-between px-4 py-3 text-sm text-slate-600">
      <div className="flex items-center gap-2">
        <label htmlFor="rdt-rows-per-page" className="whitespace-nowrap">
          Rows per page:
        </label>
        <select
          id="rdt-rows-per-page"
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          className={selectClass}
          aria-label="Rows per page"
        >
          {paginationRowsPerPageOptions.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
      <span className="whitespace-nowrap">
        {start}-{end} of {rowCount}
      </span>
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          className={btnClass}
          onClick={() => onChangePage(1)}
          disabled={currentPage <= 1}
          aria-label="First page"
        >
          <LuChevronsLeft size={16} />
        </button>
        <button
          type="button"
          className={btnClass}
          onClick={() => onChangePage(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          <LuChevronLeft size={16} />
        </button>
        <button
          type="button"
          className={btnClass}
          onClick={() => onChangePage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          <LuChevronRight size={16} />
        </button>
        <button
          type="button"
          className={btnClass}
          onClick={() => onChangePage(totalPages)}
          disabled={currentPage >= totalPages}
          aria-label="Last page"
        >
          <LuChevronsRight size={16} />
        </button>
      </div>
      </div>
    </div>
  );
}
