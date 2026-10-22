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
        <section className="space-y-3 sm:space-y-5">
            <div>
                <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                    Account Summary
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    Customer statistics and lifetime usage.
                </p>
            </div>

            <div className="grid gap-3 sm:gap-5 grid-cols-2 xl:grid-cols-4">
                <SummaryCard
                    title="Lifetime Spend"
                    value={`KES ${Number(
                        overview.lifetime_spend
                    ).toLocaleString()}`}
                    icon={<Wallet size={22} />}
                />

                <SummaryCard
                    title="Payments"
                    value={overview.total_payments}
                    icon={<CreditCard size={22} />}
                />

                <SummaryCard
                    title="Active Services"
                    value={overview.active_services}
                    icon={<Package size={22} />}
                />

                <SummaryCard
                    title="Average Purchase"
                    value={`KES ${Number(
                        overview.average_purchase
                    ).toLocaleString()}`}
                    icon={<BarChart3 size={22} />}
                />

                <SummaryCard
                    title="Hotspot Purchases"
                    value={overview.hotspot_purchases}
                    icon={<Wifi size={22} />}
                />

                <SummaryCard
                    title="PPPoE Purchases"
                    value={overview.pppoe_purchases}
                    icon={<Network size={22} />}
                />

                <SummaryCard
                    title="Total Sessions"
                    value={overview.total_sessions}
                    icon={<Activity size={22} />}
                />

                <SummaryCard
                    title="Wallet Balance"
                    value={`KES ${Number(
                        overview.wallet_balance
                    ).toLocaleString()}`}
                    icon={<Banknote size={22} />}
                />


                <SummaryCard
                    title="Installation Fee"
                    value={`KES ${Number(
                        overview.installation_fee
                    ).toLocaleString()}`}
                    icon={<Banknote size={22} />}
                />
            </div>
        </section>
    );
}

