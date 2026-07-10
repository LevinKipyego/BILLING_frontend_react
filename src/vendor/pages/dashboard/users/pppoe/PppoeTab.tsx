import type { FC } from "react";

import CredentialCard from "../components/cards/CredentialCard";
import CurrentSubscriptionCard from "../components/cards/CurrentSubscriptionCard";
import SubscriptionHistorySection from "../components/sections/SubscriptionHistorySection";
import PPPoEQuickActions from "./components/sections/PPPoEQuickActions";

import type { UserProfile } from "../components/types/types";

interface PPPoETabProps {

    profile: UserProfile;

}

const PPPoETab: FC<PPPoETabProps> = ({ profile }) => {

    return (

        <div className="space-y-6">

            {/* Top Cards */}

            <div className="grid gap-6 lg:grid-cols-2">

                <CredentialCard

                    title="PPPoE Credentials"

                    credential={profile.pppoe.credential}

                />

                <CurrentSubscriptionCard

                    title="Current PPPoE Subscription"

                    subscription={profile.pppoe.current_subscription}

                />

            </div>

            {/* Subscription History */}

            <SubscriptionHistorySection

                title="Subscription History"

                subscriptions={profile.pppoe_history}

            />

            {/* Quick Actions */}

            <PPPoEQuickActions

                profile={profile}

            />

        </div>

    );

};

export default PPPoETab;