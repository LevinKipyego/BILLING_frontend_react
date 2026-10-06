// src/components/payouts/PayoutHistory.tsx

import { useEffect, useState } from "react";

import { getPayoutHistory } from "../../api/payoutApi";

import type { PayoutRecord } from "../../types/vendorPayout";

import {
  PayoutSurface,
  SurfaceHeader,
} from "./PayOutSurface";

import {
  formatKES,
  formatShortDate,
  payoutStatusLabel,
} from "../../utils/payoutFormat";

export default function PayoutHistory() {
  const [records, setRecords] = useState<PayoutRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getPayoutHistory();

        if (!mounted) return;

        setRecords(response?.results ?? []);
      } catch (err) {
        console.error("Failed to load payout history:", err);

        if (!mounted) return;

        setRecords([]);
        setError("Unable to load payout history.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadHistory();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PayoutSurface>
      <SurfaceHeader
        title="Payout history"
        description="Recent vendor withdrawals."
      />

      {/* Loading */}
      {loading ? (
        <div className="p-4 text-[11px] text-slate-400 dark:text-slate-500 bg-white dark:bg-gray-900">
          Loading payout history...
        </div>
      ) : error ? (
        /* Error */
        <div className="border-t border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/50 p-4 text-[11px] text-red-600 dark:text-red-400 font-medium">
          {error}
        </div>
      ) : records.length === 0 ? (
        /* Empty */
        <div className="p-6 text-center text-[11px] text-slate-400 dark:text-slate-500 font-medium bg-white dark:bg-gray-900">
          No payouts yet.
        </div>
      ) : (
        <>
          {/* =========================
              Desktop Table View
          ========================== */}
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg p-4 sm:p-5 shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-gray-800 text-slate-500 dark:text-slate-400 font-medium">
                  <th className="py-2 px-2.5">Date</th>
                  <th className="py-2 px-2.5">Amount</th>
                  <th className="py-2 px-2.5">Phone</th>
                  <th className="py-2 px-2.5">Status</th>
                  <th className="py-2 px-2.5 text-right">Receipt</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-gray-800/60 text-slate-700 dark:text-slate-300">
                {records.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="py-2.5 px-2.5 text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formatShortDate(record.createdAt)}
                    </td>

                    <td className="py-2.5 px-2.5 text-[12px] font-semibold text-slate-900 dark:text-slate-100 font-mono whitespace-nowrap">
                      {formatKES(record.amount)}
                    </td>

                    <td className="py-2.5 px-2.5 font-mono text-[11px] text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {record.phoneNumber}
                    </td>

                    <td className="py-2.5 px-2.5 whitespace-nowrap">
                      <StatusBadge status={record.status} />
                    </td>

                    <td className="py-2.5 px-2.5 font-mono text-[11px] text-slate-400 dark:text-slate-500 text-right whitespace-nowrap">
                      {record.mpesaReceiptNumber ?? "—"}
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
            {records.map((record) => (
              <div
                key={record.id}
                className="p-3.5 space-y-2.5 bg-white dark:bg-gray-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[13px] font-bold text-slate-900 dark:text-slate-100 font-mono">
                      {formatKES(record.amount)}
                    </span>
                    <p className="mt-0.5 font-mono text-[10px] text-slate-400 dark:text-slate-500">
                      {record.phoneNumber}
                    </p>
                  </div>

                  <StatusBadge status={record.status} />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/40 px-3 py-2 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[9px]">Date:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{formatShortDate(record.createdAt)}</span>
                  </div>

                  <div className="h-3 w-[1px] bg-slate-200 dark:bg-gray-700" />

                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[9px]">Receipt:</span>
                    <span className="font-mono font-medium text-slate-500 dark:text-slate-400">{record.mpesaReceiptNumber ?? "None"}</span>
                  </div>
                </div>

                {record.responseDescription && (
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">
                    {record.responseDescription}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </PayoutSurface>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const classes =
    status === "SUCCESS"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : status === "FAILED"
      ? "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400"
      : status === "PROCESSING" ||
        status === "SUBMITTED"
      ? "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400"
      : "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400";

  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded px-2 py-0.5",
        "text-[10px] font-medium border",
        classes,
      ].join(" ")}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {payoutStatusLabel(status)}
    </span>
  );
}