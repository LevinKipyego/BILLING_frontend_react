// src/components/payouts/PayOutSurface.tsx

import type {
  ReactNode,
  ButtonHTMLAttributes,
} from "react";

interface SurfaceProps {
  children: ReactNode;
  className?: string;
}

export function PayoutSurface({
  children,
  className = "",
}: SurfaceProps) {
  return (
    <section
      className={[
        "w-full",
        "rounded-lg",
        "border border-slate-200 dark:border-gray-700",
        "bg-white dark:bg-gray-900",
        "shadow-sm",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}

export function SurfaceHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-gray-800 px-4 sm:px-5 py-3.5">
      <div className="min-w-0">
        <h2 className="truncate text-sm sm:text-base font-medium text-slate-900 dark:text-white">
          {title}
        </h2>

        {description && (
          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

export function SurfaceRow({
  label,
  value,
  action,
}: {
  label: string;
  value: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-[48px] items-center justify-between gap-3 border-b border-slate-100 dark:border-gray-800 px-4 sm:px-5 py-2.5 last:border-b-0">
      <div className="min-w-0">
        <p className="text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">
          {label}
        </p>

        <div className="mt-0.5 truncate text-[12px] font-medium text-slate-800 dark:text-slate-200">
          {value}
        </div>
      </div>

      {action}
    </div>
  );
}

export function OutlineButton({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={[
        "inline-flex h-8 items-center justify-center",
        "rounded-lg border border-slate-200 dark:border-gray-700",
        "bg-white dark:bg-gray-900 px-3",
        "text-[11px] font-medium text-slate-700 dark:text-slate-200",
        "transition-colors",
        "hover:border-slate-300 dark:hover:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-800/40",
        "active:bg-slate-100 dark:active:bg-gray-800",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={[
        "inline-flex h-9 items-center justify-center",
        "rounded-lg border border-slate-900 dark:border-slate-100",
        "bg-slate-900 dark:bg-slate-100 px-3",
        "text-[11px] font-semibold text-white dark:text-slate-900",
        "transition-colors",
        "hover:bg-slate-800 dark:hover:bg-white",
        "active:bg-slate-950 dark:active:bg-slate-200",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}