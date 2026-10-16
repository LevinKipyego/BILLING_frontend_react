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
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 sm:p-4 md:p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start gap-2">
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
                        {title}
                    </p>
                    <h2 className="mt-1 sm:mt-1.5 text-xs sm:text-base md:text-lg font-bold sm:font-black text-slate-900 dark:text-white truncate">
                        {value}
                    </h2>
                    {subtitle && (
                        <p className="mt-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                            {subtitle}
                        </p>
                    )}
                </div>

                {icon && (
                    <div className={`${color} shrink-0 p-1 sm:p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60`}>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                            {icon}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}