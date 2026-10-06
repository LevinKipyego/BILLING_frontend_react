
import type { ComponentType } from "react";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

interface StatCardProps {
  title: string;
  value?: string | number;
  icon: ComponentType<{ className?: string }>;
  trend: string;
  loading: boolean;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  loading,
}: StatCardProps) {
  return (
    <div
      className="
        bg-white dark:bg-gray-900
        p-4 sm:p-5
        rounded-lg
        border border-slate-200 dark:border-gray-700
        shadow-sm
        flex flex-col
        justify-between
        transition-colors
        text-xs sm:text-sm
      "
    >
      {/* ----------------------------------------- */}
      {/* Header                                    */}
      {/* ----------------------------------------- */}
      <div className="flex items-start justify-between gap-3">
        {/* Icon */}
        <div
          className="
            flex items-center justify-center
            h-8 w-8
            rounded-lg
            bg-slate-50 dark:bg-gray-800
            border border-slate-200 dark:border-gray-700
            text-slate-500 dark:text-slate-400
          "
        >
          <Icon className="h-4 w-4" />
        </div>

        {/* Trend */}
        {!loading && (
          <div className="flex items-center gap-1">
            <span
              className="
                inline-flex items-center
                px-1.5 py-0.5
                rounded
                border
                border-emerald-200 dark:border-emerald-900/50
                bg-emerald-50 dark:bg-emerald-950/30
                text-[9px]
                font-medium
                
                text-emerald-600 dark:text-emerald-400
              "
            >
              {trend}
            </span>

            <ArrowUpRightIcon
              className="
                h-3 w-3
                text-slate-400 dark:text-slate-500
              "
            />
          </div>
        )}
      </div>

      {/* ----------------------------------------- */}
      {/* Metric                                    */}
      {/* ----------------------------------------- */}
      <div className="mt-4">
        <p
          className="
            text-[9px] sm:text-[10px]
            font-medium
            uppercase
            tracking-[0.07em]
            text-slate-400 dark:text-slate-500
          "
        >
          {title}
        </p>

        {loading ? (
          <div
            className="
              h-7
              w-20
              mt-1.5
              rounded
              bg-slate-100 dark:bg-gray-800
              animate-pulse
            "
          />
        ) : (
          <p
            className="
              text-xl sm:text-2xl
              font-semibold
              
              tracking-tight
              text-slate-900 dark:text-white
              mt-1
            "
          >
            {value ?? "—"}
          </p>
        )}
      </div>

      {/* ----------------------------------------- */}
      {/* Bottom Accent                             */}
      {/* ----------------------------------------- */}
      <div
        className="
          mt-3
          pt-2.5
          border-t
          border-slate-100 dark:border-gray-800
        "
      >
        <span
          className="
            text-[9px]
            uppercase
            tracking-wider
            text-slate-400 dark:text-slate-500
          "
        >
          Current period
        </span>
      </div>
    </div>
  );
}
