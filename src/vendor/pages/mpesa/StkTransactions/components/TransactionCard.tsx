import React from 'react';
import { formatDate } from '../../../dashboard/CustomerPage/renewsubscriptions/utils/date';
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
}

interface TransactionCardProps {
  tx: Transaction;
  /** Optional custom StatusBadge component. Falls back to default if not provided. */
  StatusBadge?: React.ComponentType<{ status: string }>;
  onSelect?: (tx: Transaction) => void;
}

/** Default badge rendered if no external StatusBadge component is passed */
const DefaultStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const normalized = (status || '').toLowerCase();
  let colorClasses = 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';

  if (normalized === 'success' || normalized === 'completed') {
    colorClasses = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300';
  } else if (normalized === 'failed' || normalized === 'error') {
    colorClasses = 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300';
  } else if (normalized === 'pending') {
    colorClasses = 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300';
  }

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${colorClasses}`}>
      {status || 'Unknown'}
    </span>
  );
};

export const TransactionCard: React.FC<TransactionCardProps> = ({
  tx,
  StatusBadge = DefaultStatusBadge,
  onSelect,
}) => {
  const isFailed =
    tx.status?.toLowerCase() === 'failed' ||
    (tx.result_code !== undefined &&
      tx.result_code !== null &&
      String(tx.result_code) !== '0');

  const isSuccess =
    tx.status?.toLowerCase() === 'success' ||
    String(tx.result_code) === '0';

  const gatewayMessage =
    tx.result_description ||
    tx.result_desc ||
    (isSuccess
      ? 'Transaction completed successfully.'
      : 'Transaction failed or cancelled by subscriber.');

  return (
    <div
      onClick={() => onSelect?.(tx)}
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm relative overflow-hidden transition-all border-l-4 ${
        isSuccess
          ? 'border-l-emerald-500'
          : isFailed
          ? 'border-l-amber-500'
          : 'border-l-blue-500'
      } ${onSelect ? 'cursor-pointer hover:shadow-md' : ''}`}
    >
      {/* Top Header */}
      <div className="flex justify-between items-start mb-4">
        <StatusBadge status={tx.status} />
        <div className="text-right">
          <span className="text-[11px] text-gray-400 font-medium block uppercase tracking-wider">
            Amount
          </span>
          <p className="text-base font-extrabold text-gray-900 dark:text-white">
            KES {Number(tx.amount || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Primary Transaction Info */}
      <div className="space-y-2.5 text-xs">
        <div className="flex justify-between items-center py-1 border-b border-gray-50 dark:border-gray-700/50">
          <span className="font-medium text-gray-500 dark:text-gray-400">Subscriber</span>
          <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[160px]">
            {tx.username || tx.client_phone}
          </span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-gray-50 dark:border-gray-700/50">
          <span className="font-medium text-gray-500 dark:text-gray-400">Phone</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {tx.client_phone}
          </span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-gray-50 dark:border-gray-700/50">
          <span className="font-medium text-gray-500 dark:text-gray-400">M-Pesa Receipt</span>
          <span
            className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
              tx.mpesa_receipt
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
            }`}
          >
            {tx.mpesa_receipt || 'PENDING'}
          </span>
        </div>

        <div className="flex justify-between items-center py-1">
          <span className="font-medium text-gray-500 dark:text-gray-400">Service</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
            {tx.service_type || 'HOTSPOT'}
          </span>
        </div>
      </div>

      {/* Gateway Diagnostic Analytics */}
      {tx.result_code !== undefined && tx.result_code !== null && (
        <div
          className={`mt-4 p-3 rounded-lg border text-xs ${
            isSuccess
              ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-800/40 dark:text-emerald-300'
              : 'bg-amber-50/60 border-amber-200/60 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800/40 dark:text-amber-300'
          }`}
        >
          <div className="flex items-center justify-between font-bold mb-1">
            <span className="flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isSuccess ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              Gateway Diagnostics
            </span>
            <span className="font-mono text-[11px] px-1.5 py-0.5 bg-white/60 dark:bg-black/20 rounded">
              Code: {tx.result_code}
            </span>
          </div>
          <p className="text-[11px] leading-tight font-medium opacity-90">
            {gatewayMessage}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-[10px] text-gray-400">
        <span>
          {formatDate(tx.created_at)}
        </span>
        {tx.transaction_uuid && (
          <span
            className="font-mono text-[9px] truncate max-w-[120px]"
            title={tx.transaction_uuid}
          >
            {tx.transaction_uuid.slice(0, 8)}...
          </span>
        )}
      </div>
    </div>
  );
};

export default TransactionCard;