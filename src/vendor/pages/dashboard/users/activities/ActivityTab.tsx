import { useMemo, useState } from "react";

import ActivityTimeline from "./components/ActivityTimeline";
import ActivityFilter from "./components/ActivityFilter";

import type {
    Activity,
    UserProfile,
} from "../components/types/types";

interface Props {
    profile: UserProfile;
}

export default function ActivityTab({
    profile,
}: Props) {
    const [search, setSearch] = useState("");

    const [type, setType] = useState("");

    const [period, setPeriod] = useState("");

    const [status, setStatus] = useState("");

    const filteredActivities = useMemo(() => {
        return profile.activities.filter((activity: Activity) => {
            const query = search.toLowerCase();

            // ---------------------------------------
            // Search
            // ---------------------------------------

            const matchesSearch =
                search === "" ||
                activity.title
                    .toLowerCase()
                    .includes(query) ||
                activity.description
                    .toLowerCase()
                    .includes(query) ||
                activity.type
                    .toLowerCase()
                    .includes(query);

            // ---------------------------------------
            // Type
            // ---------------------------------------

            const matchesType =
                type === "" ||
                activity.type === type;

            // ---------------------------------------
            // Status
            // ---------------------------------------

            const matchesStatus =
                status === "" ||
                activity.status === status;

            // ---------------------------------------
            // Period
            // ---------------------------------------

            let matchesPeriod = true;

            if (period !== "") {
                const created = new Date(
                    activity.created_at
                );

                const now = new Date();

                const diffDays =
                    (now.getTime() - created.getTime()) /
                    (1000 * 60 * 60 * 24);

                if (period === "today") {
                    matchesPeriod =
                        created.toDateString() ===
                        now.toDateString();
                } else {
                    matchesPeriod =
                        diffDays <= Number(period);
                }
            }

            return (
                matchesSearch &&
                matchesType &&
                matchesStatus &&
                matchesPeriod
            );
        });
    }, [
        profile.activities,
        search,
        type,
        period,
        status,
    ]);

    return (
        <div className="space-y-4 sm:space-y-6">
            <ActivityFilter
                search={search}
                type={type}
                period={period}
                status={status}
                onSearchChange={setSearch}
                onTypeChange={setType}
                onPeriodChange={setPeriod}
                onStatusChange={setStatus}
            />

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                        Activity Timeline
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Showing{" "}
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {filteredActivities.length}
                        </span>
                        {" "}of{" "}
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {profile.activities.length}
                        </span>
                        {" "}activities
                    </p>
                </div>
            </div>

            <ActivityTimeline
                activities={filteredActivities}
            />
        </div>
    );
}
