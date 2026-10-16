import ActivityIcon from "./ActivityIcon";

import StatusBadge from "../../components/StatusBadge";

import type { Activity } from "../../components/types/types";

interface Props {
    activity: Activity;
}
import { formatDate } from "../../../CustomerEntryPage/renewsubscriptions/utils/date";

export default function ActivityCard({
    activity,
}: Props) {
    return (
        <div className="relative flex gap-2.5 sm:gap-4">
            <div className="flex flex-col items-center shrink-0">
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400">
                    <ActivityIcon
                        type={activity.type}
                    />
                </div>

                <div className="mt-1.5 sm:mt-2 h-full w-px bg-slate-200 dark:border-slate-800" />
            </div>

            <div className="flex-1 min-w-0 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 sm:p-5 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                            {activity.title}
                        </h3>

                        <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                            {activity.description}
                        </p>
                    </div>

                    <div className="shrink-0">
                        <StatusBadge
                            status={activity.status as "success" | "pending" | "failed" | "active" | "online" | "offline" | "expired" | "suspended"}
                        />
                    </div>
                </div>

                <div className="mt-2.5 sm:mt-4 text-[10px] sm:text-xs text-slate-400 dark:text-slate-500">
                    {formatDate(
                        activity.created_at
                    ).toLocaleString()}
                </div>
            </div>
        </div>
    );
}