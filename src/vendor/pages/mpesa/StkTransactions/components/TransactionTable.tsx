import React from 'react';
import { formatDate } from '../../../dashboard/CustomerEntryPage/renewsubscriptions/utils/date';
export interface Transaction {
  id: string | number;
  transaction_uuid?: string;
  amount: number | string;
  status: string;
  username?: string;
  client_phone: string;
  mpesa_receipt?: string | null;
  service_type?: string;
  created_at?: string | Date;
  result_code?: number | string | null;
  result_description?: string | null;
  result_desc?: string | null;
  plan_name?: string;
  vendor_name?: string;
  mikrotik_name?: string;
  payment_mode?: string;
  query_count?: number;
}

interface TransactionTableProps {
  paginatedData: Transaction[];
  error?: boolean | string | null;
  /** Optional custom StatusBadge component. Falls back to default if not provided. */
  StatusBadge?: React.ComponentType<{ status: string }>;
  /** Optional custom CalendarIcon component. */
  CalendarIcon?: React.ComponentType<{ className?: string }>;
  onRowClick?: (tx: Transaction) => void;
}

/** Default SVG Calendar Icon */
const DefaultCalendarIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

/** Default Status Badge */
const DefaultStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const normalized = (status || '').toLowerCase();
  let colorClasses = 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';

  if (normalized === 'success' || normalized === 'completed') {
    colorClasses = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50';
  } else if (normalized === 'failed' || normalized === 'error') {
    colorClasses = 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/50';
  } else if (normalized === 'pending') {
    colorClasses = 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800/50';
  }

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${colorClasses}`}>
      {status || 'Unknown'}
    </span>
  );
};

export const TransactionTable: React.FC<TransactionTableProps> = ({
  paginatedData,
  error,
  StatusBadge = DefaultStatusBadge,
  CalendarIcon = DefaultCalendarIcon,
  onRowClick,
}) => {
  return (
    <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 shadow-sm">
      <table className="w-full text-left border-collapse">
        {/* Table Header */}
        <thead className="bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <tr className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <th className="p-4 pl-5">Date & Time</th>
            <th className="p-4">Subscriber</th>
            <th className="p-4">Amount & Plan</th>
            <th className="p-4">Status</th>
            <th className="p-4">Receipt</th>
            <th className="p-4">Gateway Diagnostics</th>
            <th className="p-4 pr-5">Infrastructure</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-xs">
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-10 text-center text-gray-500 dark:text-gray-400 font-medium">
                {error ? "Unable to load transactions." : "No transactions match your query criteria."}
              </td>
            </tr>
          ) : (
            paginatedData.map((tx) => {
              

              const isSuccess =
                tx.status?.toLowerCase() === 'success' ||
                String(tx.result_code) === '0';

              const responseMessage =
                tx.result_description ||
                tx.result_desc ||
                (isSuccess
                  ? 'Transaction completed successfully.'
                  : 'Transaction failed or cancelled.');

              const createdDate = tx.created_at ? new Date(tx.created_at) : null;

              return (
                <tr
                  key={tx.id}
                  onClick={() => onRowClick?.(tx)}
                  className={`hover:bg-gray-50/80 dark:hover:bg-gray-700/40 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                >
                  {/* Date & Time */}
                  <td className="p-4 pl-5 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <CalendarIcon className="w-4 h-4 text-blue-500 shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          {formatDate(createdDate) }
                        </span>
                        <span className="text-[10px] text-gray-400 font-normal">
                          {createdDate ? createdDate.toLocaleTimeString() : ''}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Subscriber & Phone */}
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 dark:text-white truncate max-w-[140px]" title={tx.username}>
                        {tx.username || tx.client_phone}
                      </span>
                      <span className="text-[11px] text-gray-500 font-mono">
                        {tx.client_phone}
                      </span>
                    </div>
                  </td>

                  {/* Amount & Plan */}
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-extrabold text-gray-900 dark:text-white">
                        KES {Number(tx.amount || 0).toLocaleString()}
                      </span>
                      {tx.plan_name && (
                        <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
                          Plan: {tx.plan_name}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="p-4 whitespace-nowrap">
                    <StatusBadge status={tx.status} />
                  </td>

                  {/* M-Pesa Receipt */}
                  <td className="p-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-md font-mono font-bold text-[11px] border ${
                        tx.mpesa_receipt
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-100 dark:border-blue-900/50'
                          : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {tx.mpesa_receipt || 'WAITING'}
                    </span>
                  </td>

                  {/* Gateway Diagnostics Column (Result Code & Description) */}
                  <td className="p-4 max-w-[280px]">
                    {tx.result_code !== undefined && tx.result_code !== null ? (
                      <div
                        className={`p-2 rounded-md border flex flex-col gap-0.5 ${
                          isSuccess
                            ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-300'
                            : 'bg-amber-50/60 border-amber-200/60 text-amber-900 dark:bg-amber-950/30 dark:border-amber-900/40 dark:text-amber-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          
                        </div>
                        <p className="text-[11px] italic leading-tight font-medium line-clamp-2" title={responseMessage}>
                          {responseMessage}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-[11px]">No response payload</span>
                    )}
                  </td>

                  {/* Infrastructure / Router Details */}
                  <td className="p-4 pr-5 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-700 dark:text-gray-300">
                        {tx.mikrotik_name || 'MikroTik'}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                          {tx.service_type || 'HOTSPOT'}
                        </span>
                        {tx.payment_mode && (
                          <span className="text-[9px] text-gray-400 uppercase font-medium">
                            • {tx.payment_mode}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;