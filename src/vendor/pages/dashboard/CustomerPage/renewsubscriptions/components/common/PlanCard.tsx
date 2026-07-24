import {
    CalendarDays,
    Coins,
    Router,
    Wifi,
    CheckCircle2,
} from "lucide-react";

import InfoRow from "./InfoRow";

import type { AvailablePlan } from "../../types/subscription";

interface PlanCardProps {
    title?: string;
    plan: AvailablePlan;
    selected?: boolean;
    onSelect?(): void;
}

export default function PlanCard({
    title = "Plan",
    plan,
    selected = false,
    onSelect,
}: PlanCardProps) {
    const isInteractive = Boolean(onSelect);

    return (
        <section
            tabIndex={isInteractive ? 0 : undefined}
            role={isInteractive ? "button" : undefined}
            aria-pressed={isInteractive ? selected : undefined}
            onClick={onSelect}
            onKeyDown={(e) => {
                if (isInteractive && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onSelect?.();
                }
            }}
            className={`
                relative
                rounded-2xl
                border
                p-4 sm:p-5
                transition-all
                duration-200
                outline-none
                ${
                    selected
                        ? "border-blue-600 dark:border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-600/20 dark:ring-blue-500/20 shadow-sm"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
                }
                ${
                    isInteractive
                        ? "cursor-pointer active:scale-[0.99] hover:shadow-md"
                        : ""
                }
            `}
        >
            {/* Header Section */}
            <div className="mb-4 sm:mb-5 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                        {title}
                    </h3>
                    <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                        {plan.description || "Subscription plan"}
                    </p>
                </div>

                {selected && (
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-blue-600 dark:bg-blue-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Selected</span>
                    </span>
                )}
            </div>

            {/* Plan Attributes List */}
            <div className="space-y-2.5 sm:space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <InfoRow
                    icon={Wifi}
                    label="Plan Name"
                    value={plan.name}
                />

                <InfoRow
                    icon={Coins}
                    label="Price"
                    value={`KES ${plan.price.toLocaleString()}`}
                />

                <InfoRow
                    icon={CalendarDays}
                    label="Duration"
                    value={`${plan.duration_minutes} mins`}
                />

                {plan.router_name && (
                    <InfoRow
                        icon={Router}
                        label="Router"
                        value={plan.router_name}
                    />
                )}
            </div>
        </section>
    );
}