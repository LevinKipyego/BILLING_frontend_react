import {
    Calendar,
    UserCircle2,
} from "lucide-react";

import StatusBadge from "../StatusBadge";

interface Props {
    title: string;
    status:
        | "active"
        | "expired"
        | "pending"
        | "suspended";
    plan?: string;
    username?: string;
    expires?: string | null;
}

export default function ServiceCard({
    title,
    status,
    plan,
    username,
    expires,
}: Props) {
    return (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-sm">
            <div className="flex items-start justify-between gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                    {title}
                </h2>
                <StatusBadge status={status} />
            </div>

            <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 text-xs sm:text-sm">
                <div>
                    <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        Current Plan
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 truncate">
                        {plan ?? "-"}
                    </p>
                </div>

                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 min-w-0">
                    <UserCircle2 size={15} className="shrink-0 text-slate-400" />
                    <span className="truncate">{username ?? "-"}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 min-w-0">
                    <Calendar size={15} className="shrink-0 text-slate-400" />
                    <span className="truncate">Expires: {expires ?? "-"}</span>
                </div>
            </div>
        </div>
    );
}

