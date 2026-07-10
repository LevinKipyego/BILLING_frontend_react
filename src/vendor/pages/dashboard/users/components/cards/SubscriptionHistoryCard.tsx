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

import type { BaseSubscription } from "../../components/types/subscription";

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

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition">

            {/* ========================= HEADER ========================= */}

            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6 py-5">

                <div>

                    <h3 className="text-lg font-bold">

                        {plan.name}

                    </h3>

                    <p className="mt-1 text-sm text-slate-500">

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

            <div className="space-y-6 p-6">

                {/* Price + Trial */}

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-xs uppercase tracking-wide text-slate-500">

                            Amount Paid

                        </p>

                        <p className="mt-1 text-3xl font-bold text-blue-600">

                            KES {plan.price.toLocaleString()}

                        </p>

                    </div>

                    {is_trial && (

                        <div className="flex items-center gap-2 rounded-full bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">

                            <Sparkles size={16} />

                            Trial

                        </div>

                    )}

                </div>

                {/* Progress */}

                <div>

                    <div className="mb-2 flex items-center justify-between">

                        <span className="text-sm text-slate-500">

                            Subscription Progress

                        </span>

                        <span className="text-sm font-semibold">

                            {summary.percentage_remaining.toFixed(1)}%

                        </span>

                    </div>

                    <ProgressBar

                        value={summary.percentage_remaining}

                    />

                    <p className="mt-2 text-sm text-slate-500">

                        {formatRemaining(

                            summary.remaining_seconds

                        )}

                        {" "}remaining

                    </p>

                </div>

                {/* Information */}

                <div className="grid gap-4 md:grid-cols-2">

                    <InfoRow

                        icon={<Calendar size={16}/>}

                        label="Started"

                        value={

                            new Date(

                                start_at

                            ).toLocaleString()

                        }

                    />

                    <InfoRow

                        icon={<Clock size={16}/>}

                        label="Expires"

                        value={

                            new Date(

                                end_at

                            ).toLocaleString()

                        }

                    />

                    <InfoRow

                        icon={<CreditCard size={16}/>}

                        label="Transaction"

                        value={

                            transaction?.transaction_id ??

                            "-"

                        }

                    />

                    <InfoRow

                        icon={<Package size={16}/>}

                        label="Plan"

                        value={

                            plan.name

                        }

                    />

                    <InfoRow

                        icon={<CheckCircle2 size={16}/>}

                        label="Subscription ID"

                        value={`#${id}`}

                    />

                    <InfoRow

                        icon={<Sparkles size={16}/>}

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