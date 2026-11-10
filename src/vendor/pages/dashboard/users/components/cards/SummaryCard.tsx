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
        <div className="rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-4 shadow-xs hover:shadow-sm transition-all duration-200 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-2.5">
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">
                        {title}
                    </p>

                    <h3 className="mt-0.5 sm:mt-1  text-sm sm:text-base lg:text-lg font-bold text-slate-900 dark:text-white truncate">
                        {value}
                    </h3>

                    {footer && (
                        <div className="mt-1.5 sm:mt-2.5 text-[11px] text-slate-500 dark:text-slate-400">
                            {footer}
                        </div>
                    )}
                </div>

                {icon && (
                    <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-4.5 sm:[&>svg]:h-4.5">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}