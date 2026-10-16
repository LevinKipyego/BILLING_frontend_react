import React from "react";

interface Props {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    footer?: React.ReactNode;
    subtitle?: string;
}

export default function SummaryCard({
    title,
    value,
    icon,
    footer,
}: Props) {
    return (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 sm:p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
                        {title}
                    </p>

                    <h3 className="mt-1 sm:mt-2 text-base sm:text-xl font-extrabold text-slate-900 dark:text-white truncate">
                        {value}
                    </h3>

                    {footer && (
                        <div className="mt-2 sm:mt-4">
                            {footer}
                        </div>
                    )}
                </div>

                {icon && (
                    <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-2.5 sm:p-3 text-blue-600 dark:text-blue-400 shrink-0">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}

