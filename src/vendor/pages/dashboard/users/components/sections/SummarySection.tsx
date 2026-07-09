import {
    Wallet,
    CreditCard,
    Wifi,
    Network,
    Activity,
    BarChart3,
    Banknote,
    Package,
} from "lucide-react";

import SummaryCard from "../cards/SummaryCard";

import type { UserProfile } from "../types/types";

interface Props {
    profile: UserProfile;
}

export default function SummarySection({
    profile,
}: Props) {

    const overview = profile.overview;

    return (

        <section className="space-y-5">

            <div>

                <h2 className="text-xl font-bold text-slate-900 dark:text-white">

                    Account Summary

                </h2>

                <p className="text-sm text-slate-500">

                    Customer statistics and lifetime usage.

                </p>

            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

                <SummaryCard
                    title="Lifetime Spend"
                    value={`KES ${Number(
                        overview.lifetime_spend
                    ).toLocaleString()}`}
                    icon={<Wallet size={26} />}
                />

                <SummaryCard
                    title="Payments"
                    value={overview.total_payments}
                    icon={<CreditCard size={26} />}
                />

                <SummaryCard
                    title="Active Services"
                    value={overview.active_services}
                    icon={<Package size={26} />}
                />

                <SummaryCard
                    title="Average Purchase"
                    value={`KES ${Number(
                        overview.average_purchase
                    ).toLocaleString()}`}
                    icon={<BarChart3 size={26} />}
                />

                <SummaryCard
                    title="Hotspot Purchases"
                    value={overview.hotspot_purchases}
                    icon={<Wifi size={26} />}
                />

                <SummaryCard
                    title="PPPoE Purchases"
                    value={overview.pppoe_purchases}
                    icon={<Network size={26} />}
                />

                <SummaryCard
                    title="Total Sessions"
                    value={overview.total_sessions}
                    icon={<Activity size={26} />}
                />

                <SummaryCard
                    title="Current Balance"
                    value={`KES ${Number(
                        overview.current_balance
                    ).toLocaleString()}`}
                    icon={<Banknote size={26} />}
                />

            </div>

        </section>

    );

}