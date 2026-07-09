import {
    Calendar,
    Clock,
    CreditCard,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

import ProgressBar from "../../components/ProgressBar";
import StatusBadge from "../../components/StatusBadge";
import InfoRow from "../../components/InfoRow";

interface SubscriptionSummary {
    percentage_remaining: number;
    remaining_seconds: number;
    expired: boolean;
}

interface Plan {
    name: string;
    price: number;
}

interface Subscription {
    id: number;
    active: boolean;
    start_at: string;
    end_at: string;
    plan: Plan;
    summary: SubscriptionSummary;

    router_name?: string;
    purchase_amount?: number;
    transaction_id?: string;
}

interface Props {
    title?: string;
    subscription: Subscription | null;
}

function formatRemaining(seconds: number) {

    if (seconds <= 0)
        return "Expired";

    const days = Math.floor(seconds / 86400);

    const hours = Math.floor((seconds % 86400) / 3600);

    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0)
        return `${days}d ${hours}h`;

    if (hours > 0)
        return `${hours}h ${minutes}m`;

    return `${minutes} minutes`;
}

export default function CurrentSubscriptionCard({

    title = "Current Subscription",

    subscription,

}: Props) {

    if (!subscription) {

        return (

            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center">

                <AlertCircle
                    size={40}
                    className="mx-auto text-slate-400"
                />

                <h3 className="mt-4 text-lg font-semibold">

                    No Active Subscription

                </h3>

                <p className="mt-2 text-sm text-slate-500">

                    This customer does not currently have an active subscription.

                </p>

            </div>

        );

    }

    return (

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6 py-5">

                <div>

                    <h2 className="text-xl font-bold">

                        {title}

                    </h2>

                    <p className="mt-1 text-sm text-slate-500">

                        Active customer package

                    </p>

                </div>

                <StatusBadge

                    status={

                        subscription.summary.expired

                            ? "expired"

                            : subscription.active

                            ? "active"

                            : "pending"

                    }

                />

            </div>

            <div className="p-6 space-y-6">

                {/* Plan */}

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-sm text-slate-500">

                            Package

                        </p>

                        <h3 className="mt-1 text-2xl font-bold">

                            {subscription.plan.name}

                        </h3>

                    </div>

                    <div className="text-right">

                        <p className="text-sm text-slate-500">

                            Price

                        </p>

                        <p className="mt-1 text-2xl font-bold text-blue-600">

                            KES{" "}

                            {(
                                subscription.purchase_amount ??
                                subscription.plan.price
                            ).toLocaleString()}

                        </p>

                    </div>

                </div>

                {/* Progress */}

                <div>

                    <div className="flex justify-between mb-2 text-sm">

                        <span>

                            Time Remaining

                        </span>

                        <span className="font-semibold">

                            {subscription.summary.percentage_remaining.toFixed(1)}%

                        </span>

                    </div>

                    <ProgressBar

                        value={subscription.summary.percentage_remaining}

                    />

                    <div className="mt-2 text-sm text-slate-500">

                        {formatRemaining(

                            subscription.summary.remaining_seconds

                        )}

                        {" "}remaining

                    </div>

                </div>

                {/* Information */}

                <div className="grid md:grid-cols-2 gap-4">

                    <InfoRow

                        icon={<Calendar size={16}/>}

                        label="Purchased"

                        value={

                            new Date(

                                subscription.start_at

                            ).toLocaleString()

                        }

                    />

                    <InfoRow

                        icon={<Clock size={16}/>}

                        label="Expires"

                        value={

                            new Date(

                                subscription.end_at

                            ).toLocaleString()

                        }

                    />

                    <InfoRow

                        icon={<CreditCard size={16}/>}

                        label="Transaction"

                        value={

                            subscription.transaction_id ??

                            "-"

                        }

                    />

                    <InfoRow

                        icon={<CheckCircle2 size={16}/>}

                        label="Subscription ID"

                        value={`#${subscription.id}`}

                    />

                </div>

            </div>

        </div>

    );

}