import {
    ArrowRight,
    Calendar,
    CheckCircle2,
    Clock3,
    Package,
    Router,
    Wallet,
} from "lucide-react";

import type {
    CurrentSubscription,
    RenewalState,
} from "./types";

interface Props {

    current: CurrentSubscription;

    renewal: RenewalState;

    projectedExpiry: string;

}

export default function RenewalSummary({

    current,

    renewal,

    projectedExpiry,

}: Props) {

    const currentPlan =
        current.plan?.name ?? "-";

    const newPlan =
        renewal.plan?.name ?? currentPlan;

    const currentRouter =
        current.mikrotik?.identity_name ?? "-";

    const newRouter =
        renewal.mikrotik?.identity_name ??
        currentRouter;

    return (

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/20">

            <div className="border-b border-emerald-200 dark:border-emerald-800 px-6 py-5">

                <h2 className="flex items-center gap-2 text-lg font-bold">

                    <CheckCircle2
                        size={20}
                        className="text-emerald-600"
                    />

                    Renewal Preview

                </h2>

                <p className="mt-1 text-sm text-slate-500">

                    Review the changes that will be applied before renewing.

                </p>

            </div>

            <div className="space-y-5 p-6">

                {/* Plan */}

                <ComparisonRow

                    icon={<Package size={18} />}

                    label="Plan"

                    current={currentPlan}

                    next={newPlan}

                />

                {/* Router */}

                <ComparisonRow

                    icon={<Router size={18} />}

                    label="Router"

                    current={currentRouter}

                    next={newRouter}

                />

                {/* Expiry */}

                <ComparisonRow

                    icon={<Calendar size={18} />}

                    label="Expiry"

                    current={new Date(
                        current.end_at,
                    ).toLocaleDateString()}

                    next={new Date(
                        projectedExpiry,
                    ).toLocaleDateString()}

                />

                {/* Renewal Mode */}

                <SummaryItem

                    icon={<Clock3 size={18} />}

                    label="Renewal Mode"

                    value={renewal.mode}

                />

                {/* Price */}

                <SummaryItem

                    icon={<Wallet size={18} />}

                    label="Price"

                    value={
                        renewal.plan?.price
                            ? `KES ${renewal.plan.price}`
                            : "-"
                    }

                />

            </div>

        </div>

    );

}

interface ComparisonProps {

    icon: React.ReactNode;

    label: string;

    current: string;

    next: string;

}

function ComparisonRow({

    icon,

    label,

    current,

    next,

}: ComparisonProps) {

    const changed = current !== next;

    return (

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">

            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">

                {icon}

                {label}

            </div>

            <div className="flex items-center justify-between">

                <div className="flex-1">

                    <p className="text-xs uppercase text-slate-400">

                        Current

                    </p>

                    <p className="font-medium">

                        {current}

                    </p>

                </div>

                <ArrowRight
                    size={18}
                    className="mx-4 text-slate-400"
                />

                <div className="flex-1 text-right">

                    <p className="text-xs uppercase text-slate-400">

                        After Renewal

                    </p>

                    <p
                        className={
                            changed

                                ? "font-semibold text-emerald-600"

                                : "font-medium"
                        }
                    >

                        {next}

                    </p>

                </div>

            </div>

        </div>

    );

}

interface SummaryItemProps {

    icon: React.ReactNode;

    label: string;

    value: string;

}

function SummaryItem({

    icon,

    label,

    value,

}: SummaryItemProps) {

    return (

        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">

            <div className="flex items-center gap-2">

                {icon}

                <span className="font-medium">

                    {label}

                </span>

            </div>

            <span className="font-semibold">

                {value}

            </span>

        </div>

    );

}