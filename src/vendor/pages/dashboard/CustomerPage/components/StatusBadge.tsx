import {
    CheckCircle2,
    Clock3,
    Ban,
    WifiOff,
} from "lucide-react";

import type { Customer } from "../types/types";

interface Props {

    customer: Customer;

}

export default function StatusBadge({

    customer,

}: Props) {

    /*
    Priority

    Suspended
    ↓
    Expired
    ↓
    Active
    ↓
    Offline
    */

    if (!customer.active) {

        return (

            <Badge

                icon={<Ban size={14} />}

                label="Suspended"

                className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"

            />

        );

    }

    if (!customer.subscription_active) {

        return (

            <Badge

                icon={<Clock3 size={14} />}

                label="Expired"

                className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"

            />

        );

    }

    if (

        customer.session_status ===

        "ONLINE"

    ) {

        return (

            <Badge

                icon={<CheckCircle2 size={14} />}

                label="Online"

                className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"

            />

        );

    }

    return (

        <Badge

            icon={<WifiOff size={14} />}

            label="Offline"

            className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"

        />

    );

}

interface BadgeProps {

    icon: React.ReactNode;

    label: string;

    className: string;

}

function Badge({

    icon,

    label,

    className,

}: BadgeProps) {

    return (

        <span

            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${className}`}

        >

            {icon}

            {label}

        </span>

    );

}