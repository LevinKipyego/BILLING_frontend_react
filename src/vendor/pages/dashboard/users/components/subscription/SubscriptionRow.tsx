import { Calendar } from "lucide-react";

import type { BaseSubscription } from "../types/subscription";

import SubscriptionStatusBadge from "./SubscriptionStatusBadge";
import { formatDate } from "../../../CustomerEntryPage/renewsubscriptions/utils/date";

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
            className="cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
        >
            <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap font-semibold text-slate-900 dark:text-white">
                {subscription.plan.name}
            </td>

            <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap font-bold text-green-600 dark:text-green-400">
                KES{" "}
                {(subscription.transaction?.amount ?? subscription.plan.price).toLocaleString()}
            </td>

            <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="shrink-0 text-slate-400" />
                    <span>{formatDate(subscription.start_at)}</span>
                </div>
            </td>

            <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap text-slate-500 dark:text-slate-400">
                {formatDate(subscription.end_at)}
            </td>

            <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap">
                <SubscriptionStatusBadge
                    active={subscription.active}
                    expired={subscription.summary.expired}
                />
            </td>
        </tr>
    );
}

