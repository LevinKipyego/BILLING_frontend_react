import {
    Calendar,
    CheckCircle2,
    XCircle,
} from "lucide-react";

import type { HotspotSubscription } from "../../components/types/types";

interface Props {

    subscription: HotspotSubscription;

}

export default function SubscriptionHistoryRow({

    subscription,

}: Props) {

    return (

        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition">

            <td className="px-5 py-4">
                <div className="font-semibold">
                    {typeof subscription.plan === 'string'
                        ? subscription.plan
                        : (subscription.plan as any)?.name ?? String(subscription.plan)}
                </div>
            </td>

            <td className="px-5 py-4">

                KES{" "}

                {subscription.transaction
                    ? String(subscription.transaction)
                    : '-'}

            </td>

            <td className="px-5 py-4">

                {

                    new Date(

                        subscription.start_at

                    ).toLocaleDateString()

                }

            </td>

            <td className="px-5 py-4">

                {

                    new Date(

                        subscription.end_at

                    ).toLocaleDateString()

                }

            </td>

            <td className="px-5 py-4">

                {

                    subscription.active

                        ? (

                            <span className="inline-flex items-center gap-1 text-green-600">

                                <CheckCircle2 size={16}/>

                                Active

                            </span>

                        )

                        : (

                            <span className="inline-flex items-center gap-1 text-slate-500">

                                <XCircle size={16}/>

                                Closed

                            </span>

                        )

                }

            </td>

        </tr>

    );

}