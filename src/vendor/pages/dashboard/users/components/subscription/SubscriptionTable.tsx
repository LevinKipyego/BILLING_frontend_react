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

        <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">

            <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-5">

                <h2 className="text-xl font-bold">

                    {title}

                </h2>

                <p className="mt-1 text-sm text-slate-500">

                    Subscription history

                </p>

            </div>

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead>

                        <tr className="border-b border-slate-200 dark:border-slate-700">

                            <th className="px-5 py-4 text-left">Plan</th>

                            <th className="px-5 py-4 text-left">Amount</th>

                            <th className="px-5 py-4 text-left">Purchased</th>

                            <th className="px-5 py-4 text-left">Expires</th>

                            <th className="px-5 py-4 text-left">Status</th>

                        </tr>

                    </thead>

                    <tbody>

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