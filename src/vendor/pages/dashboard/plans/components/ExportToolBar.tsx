import {
  MagnifyingGlassIcon,
  Square2StackIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";

interface ExportToolbarProps {
  search: string;
  onSearch: (value: string) => void;

  onCopyAll: () => void;

  onExportHtml: () => void;
  onExportTxt: () => void;
  onExportJson: () => void;
  onExportRsc: () => void;

  copied: boolean;
}

export default function ExportToolbar({
  search,
  onSearch,
  onCopyAll,
  onExportHtml,
  onExportTxt,
  onExportJson,
  onExportRsc,
  copied,
}: ExportToolbarProps) {
  const buttonClass =
    "flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition";

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search plans..."
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-4 py-3 text-sm outline-none focus:border-blue-500"
        />
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <button
          onClick={onCopyAll}
          className={`${buttonClass} bg-blue-600 text-white border-blue-600 hover:bg-blue-700`}
        >
          <Square2StackIcon className="w-5 h-5" />
          {copied ? "Copied" : "Copy All"}
        </button>

        <button
          onClick={onExportHtml}
          className={buttonClass}
        >
          <CodeBracketIcon className="w-5 h-5" />
          HTML
        </button>

        <button
          onClick={onExportTxt}
          className={buttonClass}
        >
          <DocumentTextIcon className="w-5 h-5" />
          TXT
        </button>

        <button
          onClick={onExportJson}
          className={buttonClass}
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          JSON
        </button>

        <button
          onClick={onExportRsc}
          className={buttonClass}
        >
          <CpuChipIcon className="w-5 h-5" />
          RSC
        </button>
      </div>
    </div>
  );
}