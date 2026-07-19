import { Calendar, Router, Package, Power } from "lucide-react";

import type { Plan, Mikrotik } from "../types/types";
import type { RenewalState } from "./types";

interface Props {

    renewal: RenewalState;

    plans: Plan[];

    mikrotiks: Mikrotik[];

    showCustomDate: boolean;

    onPlanChange: (plan: Plan | null) => void;

    onRouterChange: (router: Mikrotik | null) => void;

    onStartDateChange: (value: string) => void;

    onActivateChange?: (value: boolean) => void;

    onPushRadiusChange?: (value: boolean) => void;

}

export default function RenewalConfiguration({

    renewal,

    plans,

    mikrotiks,

    showCustomDate,

    onPlanChange,

    onRouterChange,

    onStartDateChange,

    onActivateChange,

    onPushRadiusChange,

}: Props) {

    return (

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">

            <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-5">

                <h2 className="text-lg font-bold">

                    Renewal Configuration

                </h2>

                <p className="mt-1 text-sm text-slate-500">

                    Configure how the renewed subscription should be created.

                </p>

            </div>

            <div className="grid gap-6 p-6 lg:grid-cols-2">

                {/* Plan */}

                <div>

                    <label className="mb-2 flex items-center gap-2 text-sm font-medium">

                        <Package size={16} />

                        Plan

                    </label>

                    <select

                        value={renewal.plan?.id ?? ""}

                        onChange={(e) => {

                            const plan = plans.find(

                                p => p.id === Number(e.target.value),

                            );

                            onPlanChange(plan ?? null);

                        }}

                        className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-3 dark:border-slate-700"

                    >

                        <option value="">

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

                    <label className="mb-2 flex items-center gap-2 text-sm font-medium">

                        <Router size={16} />

                        Router

                    </label>

                    <select

                        value={renewal.mikrotik?.id ?? ""}

                        onChange={(e) => {

                            const router = mikrotiks.find(

                                r => r.id === e.target.value,

                            );

                            onRouterChange(router ?? null);

                        }}

                        className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-3 dark:border-slate-700"

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

                {/* Custom Date */}

                {showCustomDate && (

                    <div className="lg:col-span-2">

                        <label className="mb-2 flex items-center gap-2 text-sm font-medium">

                            <Calendar size={16} />

                            Custom Start Date

                        </label>

                        <input

                            type="datetime-local"

                            value={renewal.start_at ?? ""}

                            onChange={(e) =>

                                onStartDateChange(e.target.value)

                            }

                            className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-3 dark:border-slate-700"

                        />

                    </div>

                )}

                {/* Activate */}

                <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-700">

                    <div>

                        <h4 className="font-medium">

                            Activate Subscription

                        </h4>

                        <p className="text-sm text-slate-500">

                            Automatically activate after renewal.

                        </p>

                    </div>

                    <input

                        type="checkbox"

                        checked={renewal.activate}

                        onChange={(e) =>

                            onActivateChange?.(e.target.checked)

                        }

                    />

                </div>

                {/* Radius */}

                <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-700">

                    <div>

                        <h4 className="font-medium">

                            Push To Radius

                        </h4>

                        <p className="text-sm text-slate-500">

                            Synchronize credentials immediately.

                        </p>

                    </div>

                    <input

                        type="checkbox"

                        checked={renewal.push_radius}

                        onChange={(e) =>

                            onPushRadiusChange?.(e.target.checked)

                        }

                    />

                </div>

            </div>

        </div>

    );

}