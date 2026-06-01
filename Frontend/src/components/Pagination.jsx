import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalCount, pageSize, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const isFirst    = currentPage <= 1;
  const isLast     = currentPage >= totalPages;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-slate-700 pt-4 mt-4">
      <span className="text-xs text-slate-400">
        Page {currentPage} of {totalPages}
        <span className="ml-2 text-slate-500">({totalCount} total)</span>
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirst}
          className="flex items-center gap-1 rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-300
            hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={13} /> Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLast}
          className="flex items-center gap-1 rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-300
            hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}
