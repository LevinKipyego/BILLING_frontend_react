import {
    Calendar,
    CheckCircle2,
    Clock3,
    Router,
    UserCircle2,
    Wifi,
    XCircle,
} from "lucide-react";

import type {
    Customer,
    Plan,
    Mikrotik,
} from "../types/types";

import type {
    CurrentSubscription,
} from "./types";

interface Props {

    customer: Customer;

    subscription: CurrentSubscription;

}

export default function SubscriptionOverviewCard({

    customer,

    subscription,

}: Props) {

    const plan = subscription.plan as Plan | null;

    const router = subscription.mikrotik as Mikrotik | null;

    return (

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">

            <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-5">

                <h2 className="text-lg font-bold">

                    Current Subscription

                </h2>

                <p className="mt-1 text-sm text-slate-500">

                    Review the customer's existing subscription before renewing.

                </p>

            </div>

            <div className="grid gap-6 p-6 lg:grid-cols-2">

                {/* Customer */}

                <div className="space-y-4">

                    <div className="flex items-center gap-4">

                        <div className="rounded-full bg-slate-100 p-3 dark:bg-slate-800">

                            <UserCircle2
                                size={40}
                                className="text-slate-500"
                            />

                        </div>

                        <div>

                            <h3 className="text-lg font-semibold">

                                {customer.full_name}

                            </h3>

                            <p className="text-sm text-slate-500">

                                {customer.phone}

                            </p>

                            <div className="mt-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">

                                {customer.service_type}

                            </div>

                        </div>

                    </div>

                    <div className="grid grid-cols-2 gap-4">

                        <InfoItem

                            icon={<Wifi size={16} />}

                            label="Plan"

                            value={plan?.name ?? "-"}

                        />

                        <InfoItem

                            icon={<Router size={16} />}

                            label="Router"

                            value={router?.identity_name ?? "-"}

                        />

                    </div>

                </div>

                {/* Subscription */}

                <div className="grid gap-4">

                    <InfoItem

                        icon={<Calendar size={16} />}

                        label="Started"

                        value={
                            new Date(
                                subscription.start_at,
                            ).toLocaleString()
                        }

                    />

                    <InfoItem

                        icon={<Clock3 size={16} />}

                        label="Expires"

                        value={
                            new Date(
                                subscription.end_at,
                            ).toLocaleString()
                        }

                    />

                    <InfoItem

                        icon={
                            subscription.active

                                ? (
                                    <CheckCircle2
                                        size={16}
                                        className="text-green-500"
                                    />
                                )

                                : (
                                    <XCircle
                                        size={16}
                                        className="text-red-500"
                                    />
                                )

                        }

                        label="Status"

                        value={
                            subscription.active

                                ? "Active"

                                : "Inactive"
                        }

                    />

                </div>

            </div>

        </div>

    );

}

interface ItemProps {

    icon: React.ReactNode;

    label: string;

    value: string;

}

function InfoItem({

    icon,

    label,

    value,

}: ItemProps) {

    return (

        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">

            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">

                {icon}

                {label}

            </div>

            <div className="font-medium">

                {value}

            </div>

        </div>

    );

}