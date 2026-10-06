
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
        <div className="border-t border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-4 text-[11px] text-slate-400 dark:text-slate-500">
          Loading payout history...
        </div>
      ) : error ? (
        /* Error */
        <div className="border-t border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/30 px-3.5 py-3 text-[11px] font-medium text-red-600 dark:text-red-400">
          {error}
        </div>
      ) : records.length === 0 ? (
        /* Empty */
        <div className="border-t border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-8 text-center text-[11px] font-medium text-slate-400 dark:text-slate-500">
          No payouts yet.
        </div>
      ) : (
        <>
          {/* =====================================================
              Desktop Table
          ====================================================== */}
          <div className="hidden sm:block border-t border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-gray-800 text-slate-500 dark:text-slate-400">
                    <th className="px-3 py-2.5 font-medium">
                      Date
                    </th>

                    <th className="px-3 py-2.5 font-medium">
                      Amount
                    </th>

                    <th className="px-3 py-2.5 font-medium">
                      Phone
                    </th>

                    <th className="px-3 py-2.5 font-medium">
                      Status
                    </th>

                    <th className="px-3 py-2.5 text-right font-medium">
                      Receipt
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-gray-800/70">
                  {records.map((record) => (
                    <tr
                      key={record.id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-gray-800/40"
                    >
                      <td className="whitespace-nowrap px-3 py-2.5 text-[11px] text-slate-500 dark:text-slate-400">
                        {formatShortDate(record.createdAt)}
                      </td>

                      <td className="whitespace-nowrap px-3 py-2.5">
                        <span className="font-mono text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                          {formatKES(record.amount)}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-3 py-2.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                        {record.phoneNumber}
                      </td>

                      <td className="whitespace-nowrap px-3 py-2.5">
                        <StatusBadge status={record.status} />
                      </td>

                      <td className="whitespace-nowrap px-3 py-2.5 text-right font-mono text-[11px] text-slate-400 dark:text-slate-500">
                        {record.mpesaReceiptNumber ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* =====================================================
              Mobile View
          ====================================================== */}
          <div className="sm:hidden border-t border-slate-200 dark:border-gray-800 bg-slate-50/60 dark:bg-gray-950/40">
            <div className="divide-y divide-slate-200 dark:divide-gray-800">
              {records.map((record) => (
                <MobilePayoutRow
                  key={record.id}
                  record={record}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </PayoutSurface>
  );
}

/* =============================================================
   Mobile Payout Row
============================================================= */

function MobilePayoutRow({
  record,
}: {
  record: PayoutRecord;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 px-3.5 py-3.5">
      {/* ---------------------------------------------------------
          Top row
      ---------------------------------------------------------- */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-mono text-[13px] font-semibold leading-5 text-slate-900 dark:text-slate-100">
            {formatKES(record.amount)}
          </div>

          <div className="mt-0.5 truncate font-mono text-[10px] text-slate-400 dark:text-slate-500">
            {record.phoneNumber}
          </div>
        </div>

        <div className="shrink-0">
          <StatusBadge status={record.status} />
        </div>
      </div>

      {/* ---------------------------------------------------------
          Metadata
      ---------------------------------------------------------- */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <MetaItem
          label="Date"
          value={formatShortDate(record.createdAt)}
        />

        <MetaItem
          label="Receipt"
          value={record.mpesaReceiptNumber ?? "—"}
          mono
        />
      </div>

      {/* ---------------------------------------------------------
          Response / description
      ---------------------------------------------------------- */}
      {record.responseDescription && (
        <div className="mt-2.5 flex items-start gap-2 rounded-md border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/40 px-2.5 py-2">
          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300 dark:bg-gray-600" />

          <p className="min-w-0 text-[10px] leading-4 text-slate-500 dark:text-slate-400">
            {record.responseDescription}
          </p>
        </div>
      )}
    </div>
  );
}

/* =============================================================
   Mobile Metadata Item
============================================================= */

function MetaItem({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-md border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/30 px-2.5 py-2">
      <div className="text-[8px] font-semibold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">
        {label}
      </div>

      <div
        className={[
          "mt-0.5 truncate text-[10px] font-medium text-slate-600 dark:text-slate-300",
          mono ? "font-mono" : "",
        ].join(" ")}
        title={value}
      >
        {value}
      </div>
    </div>
  );
}

/* =============================================================
   Status Badge
============================================================= */

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
      : status === "PROCESSING" || status === "SUBMITTED"
      ? "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400"
      : "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400";

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5",
        "rounded-md border px-2 py-1",
        "text-[9px] font-semibold",
        "whitespace-nowrap",
        classes,
      ].join(" ")}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />

      {payoutStatusLabel(status)}
    </span>
  );
}
