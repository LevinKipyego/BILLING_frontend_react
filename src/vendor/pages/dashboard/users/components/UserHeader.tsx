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
            {/* Action Top Bar */}
            <div className="flex items-center justify-between gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>

                <button
                    onClick={reload}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm active:scale-[0.98] transition-all"
                >
                    <RefreshCw size={14} />
                    Refresh
                </button>
            </div>

            {/* Profile Hero Card - Retains absolute crisp white theme context styling across shifts */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 md:p-8 text-white shadow-xl shadow-blue-500/5">
                <div className="flex flex-col sm:flex-row items-start gap-5">
                    {/* User Profile Avatar Bubble */}
                    <div className="h-16 w-16 md:h-20 md:w-20 shrink-0 rounded-full bg-white/15 backdrop-blur-sm border border-white/10 flex items-center justify-center text-2xl md:text-3xl font-black select-none text-white">
                        {user.full_name?.charAt(0).toUpperCase() || "?"}
                    </div>

                    <div className="space-y-4 w-full">
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Mobile First responsive typography scaling */}
                            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">
                                {user.full_name}
                            </h1>
                            <StatusBadge status={overview.status} />
                        </div>

                        {/* Inline Data Layout Context */}
                        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 pt-2 border-t border-white/10 text-white/90">
                            <InfoRow
                                icon={<Phone size={14} className="opacity-80 text-white" />}
                                label="Phone"
                                value={user.phone}
                            />
                            <InfoRow
                                icon={<Mail size={14} className="opacity-80 text-white" />}
                                label="Email"
                                value={user.email || "-"}
                            />
                            
                        </div>
                        <div>
                            <InfoRow
                                icon={<Calendar size={14} className="opacity-80 text-white" />}
                                label="Customer Since"
                                value={overview.customer_since}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Accounting & State Matrix Cards */}
            <div className="grid gap-4 grid-cols-2 xl:grid-cols-5 text-sm md:text-base">
                {/* Desktop layout balance handler forcing 2 columns down on tiny phone viewports */}
                <div className="col-span-2 sm:col-span-1">
                    <StatCard
                        title="Lifetime Spend"
                        value={`KES ${(overview?.lifetime_spend || 0).toLocaleString()}`}
                        icon={<Wallet size={24} className="text-blue-500" />}
                    />
                </div>

                <StatCard
                    title="Purchases"
                    value={overview.total_payments}
                    icon={<ShoppingBag size={24} className="text-indigo-500" />}
                />

                <StatCard
                    title="Services"
                    value={overview.active_services}
                    icon={<Radio size={24} className="text-purple-500" />}
                />

                <div className="col-span-2 sm:col-span-1 " >
                    <StatCard
                        title="Customer Since"
                        value={overview.customer_since}
                        icon={<Calendar size={24} className="text-pink-500" />}
                    />
                </div>
                <div className="col-span-2 sm:col-span-1">
                    <StatCard
                        title="Last Seen"
                        value={overview.last_seen ?? "uknown"}
                        icon={<Clock size={24} className="text-amber-500" />}
                    />
                </div>
            </div>
        </div>
    );
}