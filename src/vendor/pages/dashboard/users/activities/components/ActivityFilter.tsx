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

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">

            <div className="mb-5 flex items-center gap-2">

                <Filter

                    size={18}

                    className="text-slate-500"

                />

                <h3 className="font-semibold">

                    Filter Activity

                </h3>

            </div>

            <div className="grid gap-4 lg:grid-cols-4">

                {/* Search */}

                <div className="relative">

                    <Search

                        size={18}

                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"

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

                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent py-2.5 pl-10 pr-4 focus:border-blue-500 focus:outline-none"

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

                    className="rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5"

                >

                    {ACTIVITY_TYPES.map((option) => (

                        <option

                            key={option.value}

                            value={option.value}

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

                    className="rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5"

                >

                    {ACTIVITY_PERIODS.map((option) => (

                        <option

                            key={option.value}

                            value={option.value}

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

                    className="rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5"

                >

                    {ACTIVITY_STATUSES.map((option) => (

                        <option

                            key={option.value}

                            value={option.value}

                        >

                            {option.label}

                        </option>

                    ))}

                </select>

            </div>

        </div>

    );

}