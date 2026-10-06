import { RefreshCw, ShieldCheck } from "lucide-react";

interface HeaderProps {
  loading: boolean;
  onRefresh: () => void;
  lastUpdated?: string;
}

export function DashboardHeader({ loading, onRefresh, lastUpdated }: HeaderProps) {
  return (
    <header className="w-full border-b border-slate-200/80 dark:border-gray-700/80 pb-4 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Left Section: Context Badge + Dynamic Headline */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/50">
              <ShieldCheck className="w-3.5 h-3.5" />
              Network Operations
            </span>
            {lastUpdated && (
              <span className="text-xs text-slate-400 dark:text-slate-500 hidden md:inline-block">
                • Updated {lastUpdated}
              </span>
            )}
          </div>

          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            Telemetry and System Overview
          </h1>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
            Real-time monitoring of global node performance, throughput metrics, and revenue flow.
          </p>
        </div>

        {/* Right Section: Interactive Live Telemetry Status Pill */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-sm">
            
            {/* Status Light & Indicator */}
            <div className="flex items-center gap-2.5 pr-2.5 border-r border-slate-200 dark:border-gray-700">
              <span className="relative flex h-2.5 w-2.5">
                {loading ? (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                ) : (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    loading ? "bg-blue-500" : "bg-emerald-500"
                  }`}
                />
              </span>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none">
                  Telemetry
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                  {loading ? "Syncing..." : "Live Feed"}
                </span>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={loading}
              title="Refresh Telemetry"
              className="p-1 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-gray-700 transition-all disabled:opacity-50 active:scale-95"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin text-blue-600 dark:text-blue-400" : ""}`}
              />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}