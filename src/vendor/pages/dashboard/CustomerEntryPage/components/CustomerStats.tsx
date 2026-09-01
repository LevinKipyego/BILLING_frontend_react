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
        <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
                title="Total Customers"
                value={stats.total}
                icon={<Users size={20} />}
                color="blue"
            />

            <StatCard
                title="Hotspot Users"
                value={stats.hotspot}
                icon={<Wifi size={20} />}
                color="amber"
            />

            <StatCard
                title="PPPoE Subscribers"
                value={stats.pppoe}
                icon={<Router size={20} />}
                color="indigo"
            />

            <StatCard
                title="Active Accounts"
                value={stats.active}
                icon={<CheckCircle2 size={20} />}
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
            bg: "bg-blue-50 dark:bg-blue-950/40",
            text: "text-blue-600 dark:text-blue-400",
            border: "group-hover:border-blue-200 dark:group-hover:border-blue-900/50",
        },
        amber: {
            bg: "bg-amber-50 dark:bg-amber-950/40",
            text: "text-amber-600 dark:text-amber-400",
            border: "group-hover:border-amber-200 dark:group-hover:border-amber-900/50",
        },
        indigo: {
            bg: "bg-indigo-50 dark:bg-indigo-950/40",
            text: "text-indigo-600 dark:text-indigo-400",
            border: "group-hover:border-indigo-200 dark:group-hover:border-indigo-900/50",
        },
        emerald: {
            bg: "bg-emerald-50 dark:bg-emerald-950/40",
            text: "text-emerald-600 dark:text-emerald-400",
            border: "group-hover:border-emerald-200 dark:group-hover:border-emerald-900/50",
        },
    };

    return (
        <div 
            className={`group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 ${styles[color].border}`}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {title}
                    </p>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        {value?.toLocaleString() ?? 0}
                    </h2>
                </div>

                {/* Soft Rounded Icon Container */}
                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${styles[color].bg} ${styles[color].text}`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}