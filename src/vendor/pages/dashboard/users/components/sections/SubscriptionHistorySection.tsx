import SubscriptionHistoryCard from "../../components/cards/SubscriptionHistoryCard";

import type { BaseSubscription } from "../../components/types/subscription";

interface Props {

    title?: string;

    subscriptions: BaseSubscription[];

}

export default function SubscriptionHistorySection({

    title = "Subscription History",

    subscriptions,

}: Props) {

    return (

        <div className="space-y-4">

            <div>

                <h2 className="text-xl font-bold">

                    {title}

                </h2>

                <p className="text-sm text-slate-500">

                    Previous and current subscriptions

                </p>

            </div>

            {subscriptions.length === 0 ? (

                <div className="rounded-xl border border-dashed p-8 text-center text-slate-500">

                    No subscription history available.

                </div>

            ) : (

                <div className="space-y-4">

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