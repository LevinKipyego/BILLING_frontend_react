import type { HotspotAccount, ConnectionStatus } from "../../../components/types/types";

import CredentialCard from "../../../components/cards/CredentialCard";
import ConnectionStatusCard from "../../../components/cards/ConnectionStatusCard";
import CurrentSubscriptionCard from "../../../components/cards/CurrentSubscriptionCard";

interface Props {
    account: HotspotAccount;
    index: number;
}

export default function HotspotAccountCard({
    account,
    index,
}: Props) {
    return (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-sm">
            {/* Header */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3.5 sm:pb-4">
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                    Hotspot Account {index + 1}
                </h2>

                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                    {account.credential?.username ?? "No Username"}
                </p>
            </div>

            {/* Credential + Connection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <CredentialCard
                    title="Credential"
                    credential={account.credential}
                />

                <ConnectionStatusCard
                    connection={
                        account.connection as ConnectionStatus
                    }
                />
            </div>

            {/* Subscription */}
            <CurrentSubscriptionCard
                title="Current Subscription"
                subscription={account.current_subscription}
            />
        </section>
    );
}

