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
        <div className="space-y-4 sm:space-y-6">
            {profile.hotspot.accounts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 text-center shadow-sm">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                        No Hotspot Accounts
                    </h3>

                    <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
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