import ActivityIcon from "./ActivityIcon";

import StatusBadge from "../../components/StatusBadge";

import type { Activity } from "../../components/types/types";

interface Props {

    activity: Activity;

}

export default function ActivityCard({

    activity,

}: Props) {

    return (

        <div className="relative flex gap-4">

            <div className="flex flex-col items-center">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-slate-800">

                    <ActivityIcon

                        type={activity.type}

                    />

                </div>

                <div className="mt-2 h-full w-px bg-slate-200 dark:bg-slate-700" />

            </div>

            <div className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">

                <div className="flex items-start justify-between">

                    <div>

                        <h3 className="font-semibold">

                            {activity.title}

                        </h3>

                        <p className="mt-1 text-sm text-slate-500">

                            {activity.description}

                        </p>

                    </div>

                    <StatusBadge

                        status={activity.status as "success" | "pending" | "failed" | "active" | "online" | "offline" | "expired" | "suspended"}

                    />

                </div>

                <div className="mt-4 text-xs text-slate-400">

                    {new Date(

                        activity.created_at

                    ).toLocaleString()}

                </div>

            </div>

        </div>

    );

}