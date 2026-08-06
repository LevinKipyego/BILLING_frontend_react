import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface PlanPaginationProps {
  currentPage: number;
  totalPages: number;
  totalFilteredCount: number;
  itemsPerPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function PlanPagination({
  currentPage,
  totalPages,
  totalFilteredCount,
  itemsPerPage,
  setCurrentPage
}: PlanPaginationProps) {
  const startCount = totalFilteredCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endCount = Math.min(totalFilteredCount, currentPage * itemsPerPage);

  return (
    <div className="p-4 border border-slate-150 dark:border-slate-700 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 mx-1">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center sm:text-left">
        Showing {startCount}-{endCount} of {totalFilteredCount} plans
      </p>
      
      <div className="flex items-center gap-1.5 max-w-full justify-center">
        <button
          title="Previous Page"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-20 hover:bg-slate-50 dark:hover:bg-gray-900 transition-all shrink-0"
        >
          <ChevronLeftIcon className="w-4 h-4 stroke-[2.5]" />
        </button>

        <div className="flex flex-wrap items-center gap-1 justify-center max-w-full">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`w-7 h-7 rounded-lg text-[10px] font-black transition-all shrink-0 ${
                currentPage === i 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              {i}
            </button>
          ))}
        </div>

        <button
          title="Next Page"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-20 hover:bg-slate-50 dark:hover:bg-gray-900 transition-all shrink-0"
        >
          <ChevronRightIcon className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}