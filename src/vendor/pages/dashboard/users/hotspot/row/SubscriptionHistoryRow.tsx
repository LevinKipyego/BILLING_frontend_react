import {
    CheckCircle2,
    XCircle,
} from "lucide-react";

import type { HotspotSubscription } from "../../components/types/types";
import { formatDate } from "../../../CustomerEntryPage/renewsubscriptions/utils/date";

interface Props {
    subscription: HotspotSubscription;
}

export default function SubscriptionHistoryRow({
    subscription,
}: Props) {
    return (
        <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
            <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap">
                <div className="font-semibold text-slate-900 dark:text-white">
                    {typeof subscription.plan === 'string'
                        ? subscription.plan
                        : (subscription.plan as any)?.name ?? String(subscription.plan)}
                </div>
            </td>

            <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap font-bold text-green-600 dark:text-green-400">
                KES{" "}
                {subscription.transaction
                    ? Number(subscription.transaction.amount).toLocaleString()
                    : '-'}
            </td>

            <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap text-slate-500 dark:text-slate-400">
                {formatDate(subscription.start_at)}
            </td>

            <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap text-slate-500 dark:text-slate-400">
                {formatDate(subscription.end_at)}
            </td>

            <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap">
                {subscription.active ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900/50 rounded-full px-2.5 py-0.5">
                        <CheckCircle2 size={14} className="shrink-0" />
                        Active
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-full px-2.5 py-0.5">
                        <XCircle size={14} className="shrink-0" />
                        Closed
                    </span>
                )}
            </td>
        </tr>
    );
}

