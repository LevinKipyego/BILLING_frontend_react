import type { FC } from "react";

import type { UserProfile } from "../components/types/types";

import SubscriptionHistorySection from "./components/section/SubscriptionHistorySection";
import HotspotQuickActions from "./components/section/HotspotQuickActions";
import HotspotAccountCard from "./components/cards/HotspotAccountCard";

type HotspotTabProps = {
    profile: UserProfile;
};

const HotspotTab: FC<HotspotTabProps> = ({
    profile,
}) => {

    return (

        <div className="space-y-6">

            {profile.hotspot.accounts.length === 0 ? (

                <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center">

                    <h3 className="text-lg font-semibold">

                        No Hotspot Accounts

                    </h3>

                    <p className="text-slate-500 mt-2">

                        This customer has no hotspot credentials.

                    </p>

                </div>

            ) : (

                profile.hotspot.accounts.map((account, index) => (

                    <HotspotAccountCard
                        key={
                            account.credential?.id ??
                            account.credential?.username ??
                            index
                        }
                        account={account}
                        index={index}
                    />

                ))

            )}

            <SubscriptionHistorySection
                profile={profile}
            />

            <HotspotQuickActions
                accounts={profile.hotspot.accounts}
            />

        </div>

    );

};

export default HotspotTab;