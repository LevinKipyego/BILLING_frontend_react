import {
    ArrowRight,
    CheckCircle2,
} from "lucide-react";

import type {
    SubscriptionChange,
} from "../../types/subscription";

interface RenewalChangeListProps {
    changes: SubscriptionChange[];
    className?: string;
}

export default function RenewalChangeList({
    changes,
    className = "",
}: RenewalChangeListProps) {
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
            {/* Header */}
            <div className="border-b border-slate-100 dark:border-slate-800/80 px-4 py-3.5 sm:px-6 sm:py-4">
                <h3 className="flex items-center gap-2 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Changes</span>
                </h3>
            </div>

            {/* Change Items List */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {changes.length === 0 ? (
                    <div className="px-4 py-6 sm:px-6 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        No subscription changes detected.
                    </div>
                ) : (
                    changes.map((change) => (
                        <div
                            key={change.field}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 px-4 py-3.5 sm:px-6 sm:py-4"
                        >
                            <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 capitalize">
                                {change.field.replace(/_/g, " ")}
                            </span>

                            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                                <span className="max-w-[120px] sm:max-w-[160px] truncate text-slate-500 dark:text-slate-400">
                                    {change.old_value ?? "—"}
                                </span>

                                <ArrowRight
                                    className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500"
                                />

                                <span className="max-w-[120px] sm:max-w-[160px] truncate font-bold text-blue-600 dark:text-blue-400">
                                    {change.new_value ?? "—"}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}