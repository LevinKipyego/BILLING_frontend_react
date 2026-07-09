import type { HotspotSubscription } from "../../components/types/types";

import SubscriptionHistoryRow from "../row/SubscriptionHistoryRow";

interface Props {

    subscriptions: HotspotSubscription[];

}

export default function SubscriptionHistoryTable({

    subscriptions,

}: Props) {

    if (subscriptions.length === 0)

        return (

            <div className="py-12 text-center text-slate-500">

                No hotspot purchases found.

            </div>

        );

    return (

        <table className="w-full">

            <thead>

                <tr className="border-b">

                    <th className="px-5 py-4 text-left">

                        Plan

                    </th>

                    <th className="px-5 py-4 text-left">

                        Amount

                    </th>

                    <th className="px-5 py-4 text-left">

                        Purchased

                    </th>

                    <th className="px-5 py-4 text-left">

                        Expires

                    </th>

                    <th className="px-5 py-4 text-left">

                        Status

                    </th>

                </tr>

            </thead>

            <tbody>

                {

                    subscriptions.map(subscription => (

                        <SubscriptionHistoryRow

                            key={subscription.id}

                            subscription={subscription}

                        />

                    ))

                }

            </tbody>

        </table>

    );

}