import { useMemo } from "react";
import type {
    MikrotikDevice as Mikrotik ,
    
    
} from "../../../../../types/device";

import type {
   
    Plan
    
} from "../../../../../types/plan";


import type {
    RenewMode,
    RenewSubscriptionPayload,
} from "../types/subscription";

interface Props {

    mode: RenewMode;

    value: RenewSubscriptionPayload;

    plans: Plan[];

    mikrotiks: Mikrotik[];

    onChange: (
        value: RenewSubscriptionPayload
    ) => void;

}

export default function RenewalForm({

    mode,

    value,

    plans,

    mikrotiks,

    onChange,

}: Props) {

    const selectedPlan = useMemo(

        () =>
            plans.find(
                p => p.id === value.plan_id
            ),

        [plans, value.plan_id]

    );

    const projectedExpiry = useMemo(() => {

        if (
            !selectedPlan ||
            !value.start_at
        ) {
            return "";
        }

        const start = new Date(
            value.start_at
        );

        const end = new Date(start);

        end.setMinutes(
            end.getMinutes() +
            selectedPlan.duration_minutes
        );

        return end.toLocaleString();

    }, [
        selectedPlan,
        value.start_at,
    ]);

    return (

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">

            <div className="border-b border-slate-200 dark:border-slate-700 px-5 py-4">

                <h3 className="font-semibold">

                    Renewal Details

                </h3>

            </div>

            <div className="space-y-5 p-5">

                {/* Plan */}

                <div>

                    <label className="mb-2 block text-sm font-medium">

                        Plan

                    </label>

                    <select

                        value={value.plan_id}

                        onChange={(e) =>
                            onChange({
                                ...value,
                                plan_id: Number(
                                    e.target.value
                                ),
                            })
                        }

                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent p-3"

                    >

                        <option value={0}>
                            Select Plan
                        </option>

                        {plans.map(plan => (

                            <option
                                key={plan.id}
                                value={plan.id}
                            >
                                {plan.name}
                            </option>

                        ))}

                    </select>

                </div>

                {/* Router */}

                <div>

                    <label className="mb-2 block text-sm font-medium">

                        Router

                    </label>

                    <select

                        value={value.mikrotik_id}

                        onChange={(e) =>
                            onChange({
                                ...value,
                                mikrotik_id:
                                    e.target.value,
                            })
                        }

                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent p-3"

                    >

                        <option value="">
                            Select Router
                        </option>

                        {mikrotiks.map(router => (

                            <option
                                key={router.id}
                                value={router.id}
                            >
                                {router.identity_name}
                            </option>

                        ))}

                    </select>

                </div>

                {/* Custom Start */}

                {mode === "CUSTOM" && (

                    <div>

                        <label className="mb-2 block text-sm font-medium">

                            Start Date

                        </label>

                        <input

                            type="datetime-local"

                            value={value.start_at ?? ""}

                            onChange={(e) =>
                                onChange({
                                    ...value,
                                    start_at:
                                        e.target.value,
                                })
                            }

                            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent p-3"

                        />

                    </div>

                )}

                {/* Immediate */}

                {mode === "IMMEDIATE" && (

                    <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-4">

                        Starts immediately after clicking
                        <strong>
                            {" "}Renew
                        </strong>

                    </div>

                )}

                {/* Extend */}

                {mode === "EXTEND" && (

                    <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-4">

                        Automatically starts when the
                        current subscription expires.

                    </div>

                )}

                {/* Calculated Expiry */}

                {projectedExpiry && (

                    <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-4">

                        <p className="text-sm text-slate-500">

                            Estimated Expiry

                        </p>

                        <p className="mt-1 font-semibold">

                            {projectedExpiry}

                        </p>

                    </div>

                )}

                {/* Options */}

                <label className="flex items-center gap-3">

                    <input

                        type="checkbox"

                        checked={value.activate}

                        onChange={() =>
                            onChange({
                                ...value,
                                activate:
                                    !value.activate,
                            })
                        }

                    />

                    Activate immediately

                </label>

                <label className="flex items-center gap-3">

                    <input

                        type="checkbox"

                        checked={value.push_radius}

                        onChange={() =>
                            onChange({
                                ...value,
                                push_radius:
                                    !value.push_radius,
                            })
                        }

                    />

                    Push changes to Radius

                </label>

            </div>

        </div>

    );

}