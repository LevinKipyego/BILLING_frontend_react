import {
    CalendarPlus,
    RotateCcw,
    CheckCircle2,
} from "lucide-react";

import type {
    RenewalMode,
} from "../../types/subscription";

interface RenewalModeSelectorProps {
    value: RenewalMode;
    onChange(mode: RenewalMode): void;
    className?: string;
}

const OPTIONS = [
    {
        value: "extend" as const,
        title: "Extend Current Subscription",
        description:
            "Add the new plan duration to the customer's remaining subscription period.",
        icon: CalendarPlus,
    },
    {
        value: "reset" as const,
        title: "Start Fresh Subscription",
        description:
            "End the current subscription and start a new billing cycle immediately.",
        icon: RotateCcw,
    },
];

export default function RenewalModeSelector({
    value,
    onChange,
    className = "",
}: RenewalModeSelectorProps) {
    return (
        <div className={`space-y-3 sm:space-y-4 ${className}`}>
            <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Renewal Mode
                </h3>
                <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Choose how the customer's subscription should be renewed.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const active = value === option.value;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange(option.value)}
                            className={`
                                relative
                                flex
                                items-start
                                gap-3.5 sm:gap-4
                                rounded-2xl
                                border
                                p-3.5 sm:p-4
                                text-left
                                transition-all
                                duration-200
                                outline-none
                                active:scale-[0.99]
                                focus-visible:ring-2
                                focus-visible:ring-blue-500
                                focus-visible:ring-offset-2
                                ${
                                    active
                                        ? "border-blue-600 dark:border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-600/20 dark:ring-blue-500/20 shadow-sm"
                                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                                }
                            `}
                        >
                            <div
                                className={`
                                    flex
                                    h-9 w-9 sm:h-10 sm:w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    transition-colors
                                    ${
                                        active
                                            ? "bg-blue-600 text-white dark:bg-blue-500"
                                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                    }
                                `}
                            >
                                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>

                            <div className="flex-1 min-w-0 pr-6">
                                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                                    {option.title}
                                </div>
                                <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                    {option.description}
                                </div>
                            </div>

                            {active && (
                                <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4">
                                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}