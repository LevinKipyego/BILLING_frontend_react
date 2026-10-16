import ActivityItem from "../item/ActivityItem";

import type { UserProfile } from "../types/types";

interface Props {
    profile: UserProfile;
}

export default function TimelineSection({
    profile,
}: Props) {
    return (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3.5 sm:py-5">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Activity Timeline
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    Customer activity across payments, hotspot, PPPoE and sessions.
                </p>
            </div>

            <div className="p-4 sm:p-6">
                {
                    profile.activity.length === 0
                        ? (
                            <div className="text-center py-8 sm:py-12 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                No activity found.
                            </div>
                        )
                        : (
                            <div className="space-y-4 sm:space-y-8">
                                {
                                    profile.activity.map(activity => (
                                        <ActivityItem
                                            key={activity.id}
                                            activity={activity}
                                        />
                                    ))
                                }
                            </div>
                        )
                }
            </div>
        </section>
    );
}
