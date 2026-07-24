import React from "react";
import type { LucideIcon } from "lucide-react";

interface InfoRowProps {
    icon?: LucideIcon;
    label: string;
    value?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
}

export default function InfoRow({
    icon: Icon,
    label,
    value,
    children,
    className = "",
}: InfoRowProps) {
    return (
        <div className={`flex items-start gap-3 min-w-0 ${className}`}>
            {Icon && (
                <div className="mt-0.5 flex h-8 w-8 sm:h-8.5 sm:w-8.5 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50">
                    <Icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
            )}

            <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {label}
                </p>

                {children ?? (
                    <div className="mt-0.5 break-words text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-200">
                        {value ?? "-"}
                    </div>
                )}
            </div>
        </div>
    );
}