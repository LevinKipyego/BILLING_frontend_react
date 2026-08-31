import type { ComponentType } from "react";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

interface StatCardProps {
  title: string;
  value?: string | number;
  icon: ComponentType<{ className?: string }>;
  trend: string;
  loading: boolean;
}

export function StatCard({ title, value, icon: Icon, trend, loading }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 font-sans rounded-md border border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-colors">
      <div className="flex justify-between items-start">
        <div className="p-2 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300">
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-sans text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 px-1.5 py-0.5 rounded">
            {trend}
          </span>
          <ArrowUpRightIcon className="w-3 h-3 text-slate-400" />
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </p>
        {loading ? (
          <div className="h-7 w-20 bg-slate-100 dark:bg-slate-800 animate-pulse rounded mt-1" />
        ) : (
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5 tracking-tight">
            {value ?? "—"}
          </p>
        )}
      </div>
    </div>
  );
}