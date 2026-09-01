import React from "react";

interface SummaryPanelProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export default function SummaryPanel({
    title = "Summary",
    children,
    className = "",
}: SummaryPanelProps) {
    return (
        <section
            className={`
                border-t
                border-slate-200/80 dark:border-slate-800/80
                bg-slate-50/70 dark:bg-slate-950/40
                px-4 py-4 sm:px-6 sm:py-5
                transition-colors
                ${className}
            `}
        >
            {title && (
                <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {title}
                </h3>
            )}

            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {children}
            </div>
        </section>
    );
}