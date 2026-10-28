
import {
  MagnifyingGlassIcon,
  CubeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface PlanFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  totalCount: number;
}

export default function PlanFilter({
  searchTerm,
  setSearchTerm,
  totalCount,
}: PlanFilterProps) {
  return (
    <section className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-gray-800 sm:p-4">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <MagnifyingGlassIcon
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            aria-label="Search packages"
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:bg-slate-900"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Package count */}
        <div className="flex min-h-11 shrink-0 items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50/70 px-3.5 dark:border-blue-500/20 dark:bg-blue-500/5 sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-blue-600 dark:bg-slate-800 dark:text-blue-400">
              <CubeIcon className="h-[18px] w-[18px]" />
            </div>

            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Total packages
            </span>
          </div>

          <span className="min-w-8 text-right text-base font-bold tabular-nums text-blue-700 dark:text-blue-300">
            {totalCount.toLocaleString()}
          </span>
        </div>
      </div>
    </section>
  );
}
