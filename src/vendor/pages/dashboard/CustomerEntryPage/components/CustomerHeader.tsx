import { type FC } from "react";
import { Plus } from "lucide-react";

interface Props {
  onCreatePPPoE: () => void;
  onCreateHotspot?: () => void;
}

const CustomerHeader: FC<Props> = ({ onCreatePPPoE, onCreateHotspot }) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Headlines */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Customers
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage subscribers, active sessions, and network services.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {onCreateHotspot && (
          <button
            onClick={onCreateHotspot}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-gray-800"
          >
            <Plus size={15} />
            New Hotspot
          </button>
        )}

        <button
          onClick={onCreatePPPoE}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none"
        >
          <Plus size={15} />
          New PPPoE
        </button>
      </div>
    </div>
  );
};

export default CustomerHeader;