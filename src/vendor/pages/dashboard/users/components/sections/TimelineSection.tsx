import ActivityItem from "../item/ActivityItem";

import type { UserProfile } from "../types/types";

interface Props {

    profile: UserProfile;

}

export default function TimelineSection({

    profile,

}: Props) {

    return (

        <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">

            <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-5">

                <h2 className="text-lg font-bold">

                    Activity Timeline

                </h2>

                <p className="text-sm text-slate-500 mt-1">

                    Customer activity across payments, hotspot, PPPoE and sessions.

                </p>

            </div>

            <div className="p-6" >

                {

                    profile.activity.length === 0

                        ? (

                            <div className="text-center py-12 text-slate-500">

                                No activity found.

                            </div>

                        )

                        : (

                            <div className="space-y-8">

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