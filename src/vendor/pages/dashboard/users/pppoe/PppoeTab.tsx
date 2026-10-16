import type { FC } from "react";

import type { UserProfile } from "../components/types/types";

import PPPoEAccountCard from "./components/cards/PPPoEAccountCard";
import SubscriptionHistorySection from "../components/sections/SubscriptionHistorySection";
import PPPoEQuickActions from "./components/sections/PPPoEQuickActions";

interface PPPoETabProps {
    profile: UserProfile;
}

const PPPoETab: FC<PPPoETabProps> = ({
    profile,
}) => {
    return (
        <div className="space-y-4 sm:space-y-6">
            {profile.pppoe.accounts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 text-center shadow-sm">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                        No PPPoE Accounts
                    </h3>

                    <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        This customer has no PPPoE credentials.
                    </p>
                </div>
            ) : (
                profile.pppoe.accounts.map((account, index) => (
                    <PPPoEAccountCard
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
                title="Subscription History"
                subscriptions={profile.pppoe_history}
            />

            <PPPoEQuickActions
                accounts={profile.pppoe.accounts}
            />
        </div>
    );
};

export default PPPoETab;