import { Clock } from "lucide-react";

import type { Activity } from "../types/types";

import { activityIcon } from "../utils/activityIcons";
import { formatDate } from "../../../CustomerEntryPage/renewsubscriptions/utils/date";

interface Props {
    activity: Activity;
}

export default function ActivityItem({
    activity,
}: Props) {
    const Icon = activityIcon(activity.type);

    const badgeColor = {
        success:
            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",

        info:
            "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",

        warning:
            "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",

        error:
            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",

        active:
            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",

        failed:
            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",

        pending:
            "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    }[activity.status];

    return (
        <div className="flex gap-3 sm:gap-4 items-start">
            <div
                className={`h-9 w-9 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center shrink-0 ${badgeColor}`}
            >
                <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
                    <div className="min-w-0">
                        <h4 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                            {activity.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                            {activity.description}
                        </p>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 shrink-0 mt-0.5 sm:mt-0">
                        <Clock size={12} className="shrink-0" />
                        <span>{formatDate(activity.created_at)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
