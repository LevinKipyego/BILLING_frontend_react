// src/components/CustomerStats.tsx

import React from "react";
import {
    Users,
    Wifi,
    Router,
    CheckCircle2,
} from "lucide-react";

import type { CustomerStats as CustomerStatsType } from "../types/types";

interface Props {
    stats: CustomerStatsType;
}

export default function CustomerStats({
    stats,
}: Props) {
    return (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
                title="Total Customers"
                value={stats.total}
                icon={<Users size={18} />}
                color="blue"
            />

            <StatCard
                title="Hotspot Users"
                value={stats.hotspot}
                icon={<Wifi size={18} />}
                color="amber"
            />

            <StatCard
                title="PPPoE Subscribers"
                value={stats.pppoe}
                icon={<Router size={18} />}
                color="indigo"
            />

            <StatCard
                title="Active Accounts"
                value={stats.active}
                icon={<CheckCircle2 size={18} />}
                color="emerald"
            />
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: "blue" | "amber" | "indigo" | "emerald";
}

function StatCard({
    title,
    value,
    icon,
    color,
}: StatCardProps) {
    const styles = {
        blue: {
            bg: "bg-blue-500/10 border-blue-500/20",
            text: "text-blue-600 dark:text-blue-400",
        },
        amber: {
            bg: "bg-amber-500/10 border-amber-500/20",
            text: "text-amber-600 dark:text-amber-400",
        },
        indigo: {
            bg: "bg-indigo-500/10 border-indigo-500/20",
            text: "text-indigo-600 dark:text-indigo-400",
        },
        emerald: {
            bg: "bg-emerald-500/10 border-emerald-500/20",
            text: "text-emerald-600 dark:text-emerald-400",
        },
    };

    return (
        <div className="bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700 transition-all duration-200 hover:shadow">
            <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                    <p className="text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">
                        {title}
                    </p>
                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white  tracking-tight">
                        {value?.toLocaleString() ?? 0}
                    </h2>
                </div>

                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${styles[color].bg} ${styles[color].text}`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}