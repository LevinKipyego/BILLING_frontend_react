

import {
    CalendarDays,
    Coins,
    Router,
    Wifi,
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

    return (

        <section

            onClick={onSelect}

            className={`
                rounded-xl
                border
                p-5
                transition-all
                ${
                    selected
                        ? "border-blue-600 bg-blue-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-blue-300"
                }
                ${onSelect ? "cursor-pointer" : ""}
            `}
        >

            <div className="mb-5 flex items-start justify-between">

                <div>

                    <h3 className="text-lg font-semibold text-gray-900">

                        {title}

                    </h3>

                    <p className="mt-1 text-sm text-gray-500">

                        {plan.description || "Subscription plan"}

                    </p>

                </div>

                {selected && (

                    <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">

                        Selected

                    </span>

                )}

            </div>

            <div className="space-y-4">

                <InfoRow

                    icon={Wifi}

                    label="Plan"

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

                    value={`${plan.duration_days} days`}

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