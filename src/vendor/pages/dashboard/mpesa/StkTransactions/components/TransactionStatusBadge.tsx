import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function TransactionStatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  if (s === "success")
    return (
      <span className="inline-flex items-center gap-1.5 bg-emerald-100/60 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase border border-emerald-200 dark:border-emerald-500/20">
        <CheckCircleIcon className="w-3.5 h-3.5" /> Success
      </span>
    );
  if (s === "failed")
    return (
      <span className="inline-flex items-center gap-1.5 bg-rose-100/60 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase border border-rose-200 dark:border-rose-500/20">
        <XCircleIcon className="w-3.5 h-3.5" /> Failed
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 bg-amber-100/60 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase border border-amber-200 dark:border-amber-500/20">
      <ClockIcon className="w-3.5 h-3.5" /> Pending
    </span>
  );
}