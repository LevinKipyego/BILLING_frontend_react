import CurrentServicesSection from "../sections/CurrentServicesSection";
import SummarySection from "../sections/SummarySection";
import RecentPaymentsSection from "../sections/RecentPaymentsSection";
import DevicesSection from "../sections/DevicesSection";
import QuickActionsSection from "../sections/QuickActionsSection";

import type { UserProfile } from "../types/types";
import TimelineSection from "../sections/TimelineSection";

interface Props {
    profile: UserProfile;
    reload: () => Promise<void>;
}

export default function OverviewTab({
    profile,
    reload,
}: Props) {

    return (

        <div className="space-y-8">

            <CurrentServicesSection
                profile={profile}
            />

            <SummarySection
                profile={profile}
            />

            <div className="grid xl:grid-cols-2 gap-6">

                <RecentPaymentsSection
                    profile={profile}
                />

                <DevicesSection
                    profile={profile}
                />

            </div>

            <TimelineSection profile={profile} />

            <QuickActionsSection profile={profile} />

        </div>

    );

}