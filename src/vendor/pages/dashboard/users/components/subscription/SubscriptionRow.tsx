import { Calendar } from "lucide-react";

import type { BaseSubscription } from "../types/subscription";

import SubscriptionStatusBadge from "./SubscriptionStatusBadge";

interface Props {

    subscription: BaseSubscription;

    onClick?: (subscription: BaseSubscription) => void;

}

export default function SubscriptionRow({

    subscription,

    onClick,

}: Props) {

    return (

        <tr
            onClick={() => onClick?.(subscription)}
            className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
            <td className="px-5 py-4 font-semibold">
                {subscription.plan.name}
            </td>

            <td className="px-5 py-4">
                KES{" "}
                {(subscription.transaction?.amount ?? subscription.plan.price).toLocaleString()}
            </td>

            <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                    <Calendar size={15} />
                    {new Date(subscription.start_at).toLocaleDateString()}
                </div>
            </td>

            <td className="px-5 py-4">
                {new Date(subscription.end_at).toLocaleDateString()}
            </td>

            <td className="px-5 py-4">
                <SubscriptionStatusBadge
                    active={subscription.active}
                    expired={subscription.summary.expired}
                />
            </td>
        </tr>

    );

}