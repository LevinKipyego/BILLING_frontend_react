import type { BaseSubscription } from "../types/subscription";
import SubscriptionRow from "./SubscriptionRow";

interface Props {
    title: string;
    subscriptions: BaseSubscription[];
    onRowClick?: (subscription: BaseSubscription) => void;
}

export default function SubscriptionTable({
    title,
    subscriptions,
    onRowClick,
}: Props) {
    return (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3.5 sm:py-5">
                <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                    {title}
                </h2>
                <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Subscription history
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full divide-y divide-slate-200 dark:divide-slate-800">
                    <thead className="bg-slate-50 dark:bg-slate-800/40">
                        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <th className="px-4 sm:px-5 py-3 whitespace-nowrap">Plan</th>
                            <th className="px-4 sm:px-5 py-3 whitespace-nowrap">Amount</th>
                            <th className="px-4 sm:px-5 py-3 whitespace-nowrap">Purchased</th>
                            <th className="px-4 sm:px-5 py-3 whitespace-nowrap">Expires</th>
                            <th className="px-4 sm:px-5 py-3 whitespace-nowrap">Status</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                        {subscriptions.map(subscription => (
                            <SubscriptionRow
                                key={subscription.id}
                                subscription={subscription}
                                onClick={onRowClick}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

