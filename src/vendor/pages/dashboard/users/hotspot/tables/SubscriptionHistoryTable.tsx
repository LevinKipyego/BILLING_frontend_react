import type { HotspotSubscription } from "../../components/types/types";
import SubscriptionHistoryRow from "../row/SubscriptionHistoryRow";

interface Props {
    subscriptions: HotspotSubscription[];
}

export default function SubscriptionHistoryTable({
    subscriptions,
}: Props) {
    if (subscriptions.length === 0) {
        return (
            <div className="py-8 sm:py-12 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                No hotspot purchases found.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-800/40">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        <th className="px-4 sm:px-5 py-3 whitespace-nowrap">
                            Plan
                        </th>

                        <th className="px-4 sm:px-5 py-3 whitespace-nowrap">
                            Amount
                        </th>

                        <th className="px-4 sm:px-5 py-3 whitespace-nowrap">
                            Purchased
                        </th>

                        <th className="px-4 sm:px-5 py-3 whitespace-nowrap">
                            Expires
                        </th>

                        <th className="px-4 sm:px-5 py-3 whitespace-nowrap">
                            Status
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                    {subscriptions.map(subscription => (
                        <SubscriptionHistoryRow
                            key={subscription.id}
                            subscription={subscription}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

