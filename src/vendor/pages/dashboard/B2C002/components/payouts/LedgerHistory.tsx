// src/components/payouts/LedgerHistory.tsx

import { useEffect, useState } from "react";

import { getVendorLedger } from "../../api/payoutApi";

import type { LedgerEntry } from "../../types/vendorPayout";

import {
  PayoutSurface,
  SurfaceHeader,
} from "./PayOutSurface";

import {
  formatKES,
  formatShortDate,
} from "../../utils/payoutFormat";

export default function LedgerHistory() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadLedger = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getVendorLedger();

        if (!mounted) return;

        setEntries(response?.results ?? []);
      } catch (err) {
        console.error("Failed to load vendor ledger:", err);

        if (!mounted) return;

        setEntries([]);
        setError("Unable to load transaction ledger.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadLedger();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PayoutSurface>
      <SurfaceHeader
        title="Transaction ledger"
        description="Gross collections, platform fees and net amounts."
      />

      {/* Loading */}
      {loading ? (
        <div className="p-4 text-[11px] text-slate-400 dark:text-slate-500 bg-white dark:bg-gray-900">
          Loading ledger...
        </div>
      ) : error ? (
        /* Error */
        <div className="border-t border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/50 p-4 text-[11px] text-red-600 dark:text-red-400 font-medium">
          {error}
        </div>
      ) : entries.length === 0 ? (
        /* Empty */
        <div className="p-6 text-center text-[11px] text-slate-400 dark:text-slate-500 font-medium bg-white dark:bg-gray-900">
          No ledger entries.
        </div>
      ) : (
        <>
          {/* =========================
              Desktop Table View
          ========================== */}
          <div className="hidden overflow-x-auto sm:block bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg p-4 sm:p-5 shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-gray-800 text-slate-500 dark:text-slate-400 font-medium">
                  <th className="py-2 px-2.5">Receipt</th>
                  <th className="py-2 px-2.5">Gross</th>
                  <th className="py-2 px-2.5">Fee</th>
                  <th className="py-2 px-2.5">Net</th>
                  <th className="py-2 px-2.5 text-right">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-gray-800/60 text-slate-700 dark:text-slate-300">
                {entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="py-2.5 px-2.5 font-mono text-[11px] text-slate-900 dark:text-slate-200 whitespace-nowrap font-medium">
                      {entry.mpesaReceiptNumber ?? "—"}
                    </td>

                    <td className="py-2.5 px-2.5 text-[11px] text-slate-600 dark:text-slate-300 font-mono whitespace-nowrap">
                      {formatKES(entry.grossAmount)}
                    </td>

                    <td className="py-2.5 px-2.5 text-[11px] text-slate-400 dark:text-slate-500 font-mono whitespace-nowrap">
                      {formatKES(entry.platformFee)}
                    </td>

                    <td className="py-2.5 px-2.5 text-[12px] font-semibold text-slate-900 dark:text-slate-100 font-mono whitespace-nowrap">
                      {formatKES(entry.netAmount)}
                    </td>

                    <td className="py-2.5 px-2.5 text-[11px] text-slate-500 dark:text-slate-400 text-right whitespace-nowrap">
                      {formatShortDate(entry.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* =========================
              Mobile Card View
          ========================== */}
          <div className="divide-y divide-slate-100 dark:divide-gray-800 sm:hidden bg-white dark:bg-gray-900 rounded-b-lg">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="p-3.5 space-y-2.5 bg-white dark:bg-gray-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-[11px] font-semibold text-slate-900 dark:text-slate-100">
                      {entry.mpesaReceiptNumber ?? "No receipt"}
                    </span>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                      {formatShortDate(entry.createdAt)}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[13px] font-bold text-slate-900 dark:text-slate-100 font-mono">
                      {formatKES(entry.netAmount)}
                    </span>
                    <span className="block text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-medium">
                      Net Amount
                    </span>
                  </div>
                </div>

                {/* Sub metrics pill */}
                <div className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/40 px-3 py-2 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[9px]">Gross:</span>
                    <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{formatKES(entry.grossAmount)}</span>
                  </div>

                  <div className="h-3 w-[1px] bg-slate-200 dark:bg-gray-700" />

                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[9px]">Fee:</span>
                    <span className="font-mono font-medium text-slate-500 dark:text-slate-400">{formatKES(entry.platformFee)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </PayoutSurface>
  );
}