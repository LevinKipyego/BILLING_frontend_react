import { Search, Filter } from "lucide-react";

import {
    ACTIVITY_TYPES,
    ACTIVITY_PERIODS,
    ACTIVITY_STATUSES,
} from "./activityConstants";

interface Props {
    search: string;
    type: string;
    period: string;
    status: string;
    onSearchChange: (value: string) => void;
    onTypeChange: (value: string) => void;
    onPeriodChange: (value: string) => void;
    onStatusChange: (value: string) => void;
}

export default function ActivityFilter({
    search,
    type,
    period,
    status,
    onSearchChange,
    onTypeChange,
    onPeriodChange,
    onStatusChange,
}: Props) {
    return (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 sm:p-5 shadow-sm">
            <div className="mb-3 sm:mb-5 flex items-center gap-2">
                <Filter
                    size={16}
                    className="text-slate-500 dark:text-slate-400 shrink-0 sm:w-4 sm:h-4"
                />
                <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                    Filter Activity
                </h3>
            </div>

            <div className="grid gap-2.5 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {/* Search */}
                <div className="relative">
                    <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 shrink-0"
                    />
                    <input
                        type="text"
                        placeholder="Search activity..."
                        value={search}
                        onChange={(e) =>
                            onSearchChange(
                                e.target.value
                            )
                        }
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent py-2 sm:py-2.5 pl-9 sm:pl-10 pr-3.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none transition-all"
                    />
                </div>

                {/* Activity Type */}
                <select
                    value={type}
                    onChange={(e) =>
                        onTypeChange(
                            e.target.value
                        )
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none transition-all dark:bg-slate-900"
                >
                    {ACTIVITY_TYPES.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Period */}
                <select
                    value={period}
                    onChange={(e) =>
                        onPeriodChange(
                            e.target.value
                        )
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none transition-all dark:bg-slate-900"
                >
                    {ACTIVITY_PERIODS.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Status */}
                <select
                    value={status}
                    onChange={(e) =>
                        onStatusChange(
                            e.target.value
                        )
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none transition-all dark:bg-slate-900"
                >
                    {ACTIVITY_STATUSES.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
