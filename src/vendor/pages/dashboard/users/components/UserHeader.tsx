import {
    ArrowLeft,
    Calendar,
    Mail,
    Phone,
    RefreshCw,
    Wallet,
    ShoppingBag,
    Radio,
    Clock,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import type { User, Overview } from "./types/types";

import StatCard from "./cards/StatCard";
import StatusBadge from "./StatusBadge";
import InfoRow from "./InfoRow";

interface Props {
    user: User;
    overview: Overview;
    reload: () => Promise<void>;
}

export function UserHeader({
    user,
    overview,
    reload,
}: Props) {

    const navigate = useNavigate();

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    <ArrowLeft size={18} />

                    Back
                </button>

                <button
                    onClick={reload}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    <RefreshCw size={16} />

                    Refresh
                </button>

            </div>

            <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white p-8">

                <div className="flex flex-col md:flex-row md:justify-between gap-8">

                    <div className="flex gap-5">

                        <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-black">

                            {user.full_name.charAt(0).toUpperCase()}

                        </div>

                        <div>

                            <div className="flex items-center gap-3">

                                <h1 className="text-4xl font-black">

                                    {user.full_name}

                                </h1>

                                <StatusBadge status={overview.status} />

                            </div>

                            <div className="mt-6 space-y-3">

                                <InfoRow
                                    icon={<Phone size={16} />}
                                    label="Phone"
                                    value={user.phone}
                                />

                                <InfoRow
                                    icon={<Mail size={16} />}
                                    label="Email"
                                    value={user.email || "-"}
                                />

                                <InfoRow
                                    icon={<Calendar size={16} />}
                                    label="Customer Since"
                                    value={overview.customer_since}
                                />

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">

                <StatCard
                    title="Lifetime Spend"
                    value={`KES ${overview.total_spent.toLocaleString()}`}
                    icon={<Wallet size={28} />}
                />

                <StatCard
                    title="Purchases"
                    value={overview.total_purchases}
                    icon={<ShoppingBag size={28} />}
                />

                <StatCard
                    title="Services"
                    value={overview.active_services}
                    icon={<Radio size={28} />}
                />

                <StatCard
                    title="Customer Since"
                    value={overview.customer_since}
                    icon={<Calendar size={28} />}
                />

                <StatCard
                    title="Last Seen"
                    value={overview.last_seen ?? "Never"}
                    icon={<Clock size={28} />}
                />

            </div>

        </div>

    );

}