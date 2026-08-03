import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({
  currentPage, // 0-indexed
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  if (totalElements === 0) return null;

  const startElement = currentPage * pageSize + 1;
  const endElement = Math.min((currentPage + 1) * pageSize, totalElements);

  // Generate page numbers array (e.g., 1, 2, 3...)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    // Adjust start page if we are near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 px-5 border-t border-slate-100 bg-white rounded-b-xl font-sans">
      {/* Entries Info & Page Size */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>entries</span>
        </div>
        <span>
          Showing <span className="text-slate-800 font-bold">{startElement}</span> to{' '}
          <span className="text-slate-800 font-bold">{endElement}</span> of{' '}
          <span className="text-slate-800 font-bold">{totalElements}</span> entries
        </span>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-end gap-1.5">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
          title="Previous page"
        >
          <FiChevronLeft size={16} />
        </button>

        {/* Page numbers */}
        {pages[0] > 0 && (
          <>
            <button
              onClick={() => onPageChange(0)}
              className={`min-w-[34px] h-[34px] rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                currentPage === 0
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              1
            </button>
            {pages[0] > 1 && <span className="text-slate-400 px-1 text-xs">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`min-w-[34px] h-[34px] rounded-lg text-xs font-bold transition-all border cursor-pointer ${
              currentPage === page
                ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-600/20'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {page + 1}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages - 1 && (
          <>
            {pages[pages.length - 1] < totalPages - 2 && <span className="text-slate-400 px-1 text-xs">...</span>}
            <button
              onClick={() => onPageChange(totalPages - 1)}
              className={`min-w-[34px] h-[34px] rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                currentPage === totalPages - 1
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
          title="Next page"
        >
          <FiChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
