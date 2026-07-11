import ActivityCard from "./ActivityCard";

import EmptyActivity from "./EmptyActivity";

import type { Activity } from "../../components/types/types";

interface Props {

    activities: Activity[];

}

export default function ActivityTimeline({

    activities,

}: Props) {

    if (!activities.length) {

        return <EmptyActivity />;

    }

    return (

        <div className="space-y-6">

            {activities.map((activity) => (

                <ActivityCard

                    key={activity.id}

                    activity={activity}

                />

            ))}

        </div>

    );

}