import React, { useState } from "react";
import axios from "axios";
import { BaseUrl } from "../../BaseUrl";

export default function PortalRouterControl(): React.JSX.Element {
  const [executing, setExecuting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");

  const triggerRemoteReboot = async () => {
    try {
      setExecuting(true);
      setFeedback("Sending secure system API request to edge NAS...");

      // Backend route proxies command securely via RouterOS API/SSH connection pool
      await axios.post(`${BaseUrl}/api/network/remote-reboot/`);
      
      setFeedback("Signal received by home ONT. Your router is recycling. Link up expected in 90 seconds.");
    } catch (err: any) {
      setFeedback(err?.response?.data?.error || "NAS link communication error. Gateway busy.");
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="font-['Figtree',sans-serif] space-y-6 max-w-3xl transition-colors duration-200">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">Hardware Self-Care Diagnostics</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Execute direct physical interface commands down to your connected home terminal equipment.</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 sm:p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1 max-w-md">
          <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-100">Force Reboot Home Router</h3>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium leading-relaxed">
            Clears stuck network memory queues, local route paths, and handles stale allocation leaks without pulling power adaptors manually.
          </p>
        </div>

        <button
          onClick={triggerRemoteReboot}
          disabled={executing}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition disabled:opacity-50 flex-shrink-0 active:scale-[0.98]"
        >
          {executing ? (
            <>
              <svg className="animate-spin h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Recycling Link...
            </>
          ) : (
            "Reboot Router"
          )}
        </button>
      </div>

      {feedback && (
        <div className="bg-zinc-50 dark:bg-zinc-950/50 text-zinc-600 dark:text-zinc-400 text-xs font-semibold p-4 border border-zinc-100 dark:border-zinc-900 rounded-xl transition-all animate-fade-in max-w-3xl">
          {feedback}
        </div>
      )}
    </div>
  );
}