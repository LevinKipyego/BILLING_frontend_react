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

        <div className="space-y-6">

            {profile.pppoe.accounts.length === 0 ? (

                <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center">

                    <h3 className="text-lg font-semibold">
                        No PPPoE Accounts
                    </h3>

                    <p className="mt-2 text-slate-500">
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