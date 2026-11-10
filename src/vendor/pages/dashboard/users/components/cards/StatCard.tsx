import React from "react";

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: React.ReactNode;
    color?: string;
}

export default function StatCard({
    title,
    value,
    subtitle,
    icon,
    color = "text-blue-600 dark:text-blue-400",
}: StatCardProps) {
    return (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-2.5 sm:p-3.5 shadow-xs hover:shadow-sm transition-all duration-200 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">
                        {title}
                    </p>
                    <h2 className="mt-0.5  text-xs sm:text-sm lg:text-base font-bold text-slate-900 dark:text-white truncate">
                        {value}
                    </h2>
                    {subtitle && (
                        <p className="mt-0.5 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {subtitle}
                        </p>
                    )}
                </div>

                {icon && (
                    <div className={`${color} shrink-0 p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60`}>
                        <div className="flex h-4 w-4 sm:h-4.5 sm:w-4.5 items-center justify-center [&>svg]:w-3.5 [&>svg]:h-3.5 sm:[&>svg]:w-4 sm:[&>svg]:h-4">
                            {icon}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}