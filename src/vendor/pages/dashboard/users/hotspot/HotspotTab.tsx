import type { FC } from "react";

import type { UserProfile } from "../components/types/types";

import HotspotCredentialCard from "./components/cards/HotspotCredentialCard";
import ConnectionStatusCard from "./components/cards/ConnectionStatusCard";
import CurrentSubscriptionCard from "../components/cards/CurrentSubscriptionCard";
import SubscriptionHistorySection from "./components/section/SubscriptionHistorySection";
//import HotspotQuickActions from "./components/section/HotspotQuickActions";

type HotspotTabProps = {
    profile: UserProfile;
};

const HotspotTab: FC<HotspotTabProps> = ({ profile }) => {

    return (

        <div className="space-y-6">

            {/* Top Row */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <HotspotCredentialCard
                    profile={profile}
                />

                <ConnectionStatusCard
                    connection={profile.hotspot.connection}
                />

            </div>

            {/* Current Subscription */}

            <CurrentSubscriptionCard
                title="Current Hotspot Subscription"
                subscription={profile.hotspot.current_subscription}
            />

            {/* Purchase History */}

            <SubscriptionHistorySection
                profile={profile}
            />

            {/* Quick Actions */}

          

        </div>

    );

};

export default HotspotTab;