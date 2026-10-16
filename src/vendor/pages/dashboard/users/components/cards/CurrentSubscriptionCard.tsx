import {
    AlertCircle,
    Calendar,
    CheckCircle2,
    Clock,
    CreditCard,
} from "lucide-react";

import ProgressBar from "../ProgressBar";
import StatusBadge from "../StatusBadge";
import InfoRow from "../InfoRow";
import { formatDate } from "../../../CustomerEntryPage/renewsubscriptions/utils/date";
import type { BaseSubscription } from "../types/subscription";

interface Props {
    title?: string;
    subscription: BaseSubscription | null;
}

function formatRemaining(seconds: number) {
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

export default function CurrentSubscriptionCard({
    title = "Current Subscription",
    subscription,
}: Props) {
    if (!subscription) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 text-center">
                <AlertCircle
                    size={32}
                    className="mx-auto text-slate-400 sm:w-10 sm:h-10"
                />
                <h3 className="mt-3 text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                    No Active Subscription
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    This customer does not currently have an active subscription.
                </p>
            </div>
        );
    }

    const {
        id,
        active,
        start_at,
        end_at,
        plan,
        transaction,
        summary,
        is_trial,
    } = subscription;

    return (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3.5 sm:py-5">
                <div>
                    <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                        {title}
                    </h2>
                    <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Current service package
                    </p>
                </div>

                <StatusBadge
                    status={
                        summary.expired
                            ? "expired"
                            : active
                                ? "active"
                                : "offline"
                    }
                />
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Plan */}
                <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            Package
                        </p>
                        <h3 className="mt-0.5 text-lg sm:text-2xl font-bold text-slate-900 dark:text-white truncate">
                            {plan.name}
                        </h3>
                    </div>

                    <div className="text-right shrink-0">
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            Price
                        </p>
                        <p className="mt-0.5 text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                            KES {plan.price.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Progress */}
                <div>
                    <div className="mb-1.5 flex justify-between text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <span>
                            Remaining Time
                        </span>
                        <span className="font-semibold">
                            {summary.percentage_remaining.toFixed(1)}%
                        </span>
                    </div>

                    <ProgressBar
                        value={summary.percentage_remaining}
                    />

                    <div className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        {formatRemaining(
                            summary.remaining_seconds
                        )} remaining
                    </div>
                </div>

                {/* Details */}
                <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                    <InfoRow
                        icon={<Calendar size={15} className="shrink-0" />}
                        label="Started"
                        value={
                            formatDate(
                                start_at
                            )
                        }
                    />

                    <InfoRow
                        icon={<Clock size={15} className="shrink-0" />}
                        label="Expires"
                        value={
                            formatDate(
                                end_at
                            )
                        }
                    />

                    <InfoRow
                        icon={<CreditCard size={15} className="shrink-0" />}
                        label="Transaction"
                        value={
                            transaction?.transaction_id ?? "-"
                        }
                    />

                    <InfoRow
                        icon={<CheckCircle2 size={15} className="shrink-0" />}
                        label="Subscription ID"
                        value={`#${id}`}
                    />

                    <InfoRow
                        icon={<CheckCircle2 size={15} className="shrink-0" />}
                        label="Type"
                        value={
                            is_trial
                                ? "Trial"
                                : "Paid"
                        }
                    />
                </div>
            </div>
        </div>
    );
}
