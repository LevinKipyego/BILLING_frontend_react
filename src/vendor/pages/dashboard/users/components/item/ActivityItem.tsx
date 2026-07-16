import { Clock } from "lucide-react";

import type { Activity } from "../types/types";

import { activityIcon } from "../utils/activityIcons";

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

        <div className="flex gap-4">

            <div
                className={`h-11 w-11 rounded-xl flex items-center justify-center ${badgeColor}`}
            >

                <Icon size={18} />

            </div>

            <div className="flex-1">

                <div className="flex justify-between items-start gap-4">

                    <div>

                        <h4 className="font-semibold">

                            {activity.title}

                        </h4>

                        <p className="text-sm text-slate-500 mt-1">

                            {activity.description}

                        </p>

                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-400">

                        <Clock size={14} />

                        {new Date(activity.created_at).toLocaleString()}

                    </div>

                </div>

            </div>

        </div>

    );

}