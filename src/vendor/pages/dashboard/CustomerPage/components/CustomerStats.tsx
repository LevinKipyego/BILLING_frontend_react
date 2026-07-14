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

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard

                title="Total Customers"

                value={stats.total}

                icon={<Users size={22} />}

                color="blue"

            />

            <StatCard

                title="Hotspot"

                value={stats.hotspot}

                icon={<Wifi size={22} />}

                color="amber"

            />

            <StatCard

                title="PPPoE"

                value={stats.pppoe}

                icon={<Router size={22} />}

                color="indigo"

            />

            <StatCard

                title="Active"

                value={stats.active}

                icon={<CheckCircle2 size={22} />}

                color="green"

            />

        </div>

    );

}

interface StatCardProps {

    title: string;

    value: number;

    icon: React.ReactNode;

    color:
        | "blue"
        | "amber"
        | "indigo"
        | "green";

}

function StatCard({

    title,

    value,

    icon,

    color,

}: StatCardProps) {

    const colors = {

        blue: {

            bg: "bg-blue-100 dark:bg-blue-900/30",

            text: "text-blue-600 dark:text-blue-400",

        },

        amber: {

            bg: "bg-amber-100 dark:bg-amber-900/30",

            text: "text-amber-600 dark:text-amber-400",

        },

        indigo: {

            bg: "bg-indigo-100 dark:bg-indigo-900/30",

            text: "text-indigo-600 dark:text-indigo-400",

        },

        green: {

            bg: "bg-green-100 dark:bg-green-900/30",

            text: "text-green-600 dark:text-green-400",

        },

    };

    return (

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm font-medium text-slate-500">

                        {title}

                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">

                        {value.toLocaleString()}

                    </h2>

                </div>

                <div
                    className={`rounded-xl p-3 ${colors[color].bg}`}
                >

                    <div
                        className={colors[color].text}
                    >

                        {icon}

                    </div>

                </div>

            </div>

        </div>

    );

}