import {
  MagnifyingGlassIcon,
  CubeIcon,
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
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Search */}
        <div className="relative w-full lg:max-w-md">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search package name, price or bandwidth..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              h-12
              w-full
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              pl-12
              pr-4
              text-sm
              text-slate-700
              placeholder:text-slate-400
              outline-none
              transition
              focus:border-blue-500
              focus:bg-white
              focus:ring-4
              focus:ring-blue-500/10
              dark:border-slate-700
              dark:bg-slate-900
              dark:text-white
              dark:placeholder:text-slate-500
            "
          />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between gap-4 lg:justify-end">

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900">

            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <CubeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">
                Total Packages
              </p>

              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {totalCount}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}