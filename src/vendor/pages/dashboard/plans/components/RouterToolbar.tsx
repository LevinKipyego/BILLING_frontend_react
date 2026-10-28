import {
  MagnifyingGlassIcon,
  Square2StackIcon,
  DocumentArrowDownIcon,
  ServerStackIcon,
} from "@heroicons/react/24/outline";

interface RouterToolbarProps {
  search: string;
  onSearch: (value: string) => void;

  copied: boolean;

  onCopyAll: () => void;
  onExportRsc: () => void;
  onExportTxt: () => void;
}

export default function RouterToolbar({
  search,
  onSearch,
  copied,
  onCopyAll,
  onExportRsc,
  onExportTxt,
}: RouterToolbarProps) {
  const button =
    "flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition";

  return (
    <div className="space-y-4">
      {/* Search */}

      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search MikroTik profiles..."
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-3 pl-10 pr-4 outline-none focus:border-blue-500"
        />
      </div>

      {/* Buttons */}

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <button
          onClick={onCopyAll}
          className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 transition"
        >
          <div className="flex items-center justify-center gap-2">
            <Square2StackIcon className="h-5 w-5" />

            {copied ? "Copied" : "Copy All Scripts"}
          </div>
        </button>

        <button
          onClick={onExportRsc}
          className={button}
        >
          <ServerStackIcon className="h-5 w-5" />

          Export .RSC
        </button>

        <button
          onClick={onExportTxt}
          className={button}
        >
          <DocumentArrowDownIcon className="h-5 w-5" />

          Export TXT
        </button>
      </div>
    </div>
  );
}