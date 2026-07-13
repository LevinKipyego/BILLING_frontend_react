import type {
    PPPoEAccount,
    ConnectionStatus,
} from "../../../components/types/types";

import CredentialCard from "../../../components/cards/CredentialCard";
import ConnectionStatusCard from "../../../components/cards/ConnectionStatusCard";
import CurrentSubscriptionCard from "../../../components/cards/CurrentSubscriptionCard";

interface Props {
    account: PPPoEAccount;
    index: number;
}

export default function PPPoEAccountCard({
    account,
    index,
}: Props) {

    return (

        <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 space-y-6">

            <div className="border-b border-slate-200 dark:border-slate-700 pb-4">

                <h2 className="text-lg font-semibold">

                    {account.credential?.username ??
                        `PPPoE Account ${index + 1}`}

                </h2>

                <p className="text-sm text-slate-500">

                    {account.credential?.username}

                </p>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <CredentialCard
                    title="PPPoE Credential"
                    credential={account.credential}
                />

                <ConnectionStatusCard
                    connection={
                        account.connection as ConnectionStatus
                    }
                />

            </div>

            <CurrentSubscriptionCard
                title="Current PPPoE Subscription"
                subscription={account.current_subscription}
            />

        </section>

    );

}