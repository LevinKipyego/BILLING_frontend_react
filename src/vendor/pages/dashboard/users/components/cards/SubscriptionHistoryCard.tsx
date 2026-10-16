import {
    Calendar,
    Clock,
    CreditCard,
    Package,
    Sparkles,
    CheckCircle2,
} from "lucide-react";

import ProgressBar from "../ProgressBar";
import StatusBadge from "../StatusBadge";
import InfoRow from "../InfoRow";
import { formatDate } from "../../../CustomerEntryPage/renewsubscriptions/utils/date";
import type { BaseSubscription } from "../types/subscription";

interface Props {
    subscription: BaseSubscription;
}

function formatRemaining(seconds: number): string {
    if (seconds <= 0) {
        return "Expired";
    }

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) {
        return `${days}d ${hours}h`;
    }

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
}

export default function SubscriptionHistoryCard({
    subscription,
}: Props) {
    const {
        id,
        active,
        is_trial,
        plan,
        transaction,
        start_at,
        end_at,
        summary,
    } = subscription;

    return (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition">
            {/* ========================= HEADER ========================= */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3.5 sm:py-5">
                <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                        {plan.name}
                    </h3>
                    <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Subscription #{id}
                    </p>
                </div>

                <StatusBadge
                    status={
                        summary.expired
                            ? "expired"
                            : active
                                ? "active"
                                : "expired"
                    }
                />
            </div>

            {/* ========================= BODY ========================= */}
            <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                {/* Price + Trial */}
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-[10px] sm:text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Amount Paid
                        </p>
                        <p className="mt-0.5 text-xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                            KES {plan.price.toLocaleString()}
                        </p>
                    </div>

                    {is_trial && (
                        <div className="flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                            <Sparkles size={14} className="shrink-0" />
                            Trial
                        </div>
                    )}
                </div>

                {/* Progress */}
                <div>
                    <div className="mb-1.5 flex items-center justify-between text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <span className="text-slate-500 dark:text-slate-400">
                            Subscription Progress
                        </span>
                        <span className="font-semibold">
                            {summary.percentage_remaining.toFixed(1)}%
                        </span>
                    </div>

                    <ProgressBar
                        value={summary.percentage_remaining}
                    />

                    <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        {formatRemaining(
                            summary.remaining_seconds
                        )}{" "}
                        remaining
                    </p>
                </div>

                {/* Information */}
                <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                    <InfoRow
                        icon={<Calendar size={15} className="shrink-0" />}
                        label="Started"
                        value={formatDate(start_at)}
                    />

                    <InfoRow
                        icon={<Clock size={15} className="shrink-0" />}
                        label="Expires"
                        value={new Date(end_at).toLocaleString()}
                    />

                    <InfoRow
                        icon={<CreditCard size={15} className="shrink-0" />}
                        label="Transaction"
                        value={transaction?.transaction_id ?? "-"}
                    />

                    <InfoRow
                        icon={<Package size={15} className="shrink-0" />}
                        label="Plan"
                        value={plan.name}
                    />

                    <InfoRow
                        icon={<CheckCircle2 size={15} className="shrink-0" />}
                        label="Subscription ID"
                        value={`#${id}`}
                    />

                    <InfoRow
                        icon={<Sparkles size={15} className="shrink-0" />}
                        label="Type"
                        value={is_trial ? "Trial" : "Paid"}
                    />
                </div>
            </div>
        </div>
    );
}
