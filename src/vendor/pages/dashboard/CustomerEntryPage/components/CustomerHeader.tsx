import { type FC } from "react";
import { Plus } from "lucide-react";

interface Props {
  onCreatePPPoE: () => void;
  onCreateHotspot?: () => void;
}

const CustomerHeader: FC<Props> = ({ onCreatePPPoE, onCreateHotspot }) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Headlines */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Customers
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage subscribers, active sessions, and network services.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5">
        {onCreateHotspot && (
          <button
            onClick={onCreateHotspot}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <Plus size={16} />
            New Hotspot
          </button>
        )}

        <button
          onClick={onCreatePPPoE}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-500 bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 active:scale-[0.98]"
        >
          <Plus size={16} />
          New PPPoE
        </button>
      </div>
    </div>
  );
};

export default CustomerHeader;