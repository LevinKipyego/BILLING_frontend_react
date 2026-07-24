import React from "react";

interface CardProps {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export default function Card({
    title,
    subtitle,
    actions,
    children,
    className = "",
}: CardProps) {
    return (
        <section
            className={`
                rounded-2xl
                border
                border-slate-200 dark:border-slate-800
                bg-white dark:bg-slate-900
                shadow-sm
                transition-colors
                ${className}
            `}
        >
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 px-4 py-3.5 sm:px-5 sm:py-4">
                <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                        {title}
                    </h3>

                    {subtitle && (
                        <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            {subtitle}
                        </p>
                    )}
                </div>

                {actions && (
                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                        {actions}
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="p-4 sm:p-5">
                {children}
            </div>
        </section>
    );
}