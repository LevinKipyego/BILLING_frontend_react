import ActivityTimeline from "./components/ActivityTimeline";
import ActivityFilter from "./components/ActivityFilter";

import type { UserProfile } from "../components/types/types";

interface Props {

    profile: UserProfile;

}

export default function ActivityTab({

    profile,

}: Props) {

    return (

        <div className="space-y-6">

            <ActivityFilter />

            <ActivityTimeline

                activities={profile.activities}

            />

        </div>

    );

}