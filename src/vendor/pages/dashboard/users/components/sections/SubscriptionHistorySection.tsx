import SubscriptionHistoryCard from "../cards/SubscriptionHistoryCard";

import type { BaseSubscription } from "../types/subscription";

interface Props {
    title?: string;
    subscriptions: BaseSubscription[];
}

export default function SubscriptionHistorySection({
    title = "Subscription History",
    subscriptions,
}: Props) {
    return (
        <div className="space-y-3 sm:space-y-4">
            <div>
                <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                    {title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    Previous and current subscriptions
                </p>
            </div>

            {subscriptions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-800 p-6 sm:p-8 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    No subscription history available.
                </div>
            ) : (
                <div className="space-y-3 sm:space-y-4">
                    {subscriptions.map((subscription) => (
                        <SubscriptionHistoryCard
                            key={subscription.id}
                            subscription={subscription}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

