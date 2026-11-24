import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, Plus, RotateCcw, Wallet } from "lucide-react";

import CurrentSubscriptionCard from "./CurrentSubscriptionCard";
import RenewalModeSelector from "./RenewalModeSelector";
import type { RenewalMode } from "./RenewalModeSelector";
import PlanCard from "../common/PlanCard";
import { formatDuration } from "../../utils/date";

import type {
    AvailablePlan,
    CurrentSubscription,
} from "../../types/subscription";

import type {
    RenewalConfiguration as RenewalConfigurationState,
} from "../../types/renewal";

interface RenewalConfigurationProps {
    subscription: CurrentSubscription;
    plans: AvailablePlan[];
    configuration: RenewalConfigurationState;
    selectedPlan: AvailablePlan | null;
    onPlanChange(planId: number | null): void;
    onModeChange(mode: RenewalMode): void;
    onNotesChange(notes: string): void;
    customMinutes?: number;
    onCustomMinutesChange?(minutes: number): void;
    className?: string;
}

type CustomInputTab = "builder" | "calendar" | "minutes";

const DURATION_PRESETS = [
    { label: "50 mins", minutes: 50 },
    { label: "1 hr", minutes: 60 },
    { label: "3 hrs", minutes: 180 },
    { label: "6 hrs", minutes: 360 },
    { label: "24 hrs", minutes: 1440 },
    { label: "7 days", minutes: 10080 },
    { label: "30 days", minutes: 43200 },
];

const QUICK_ADD_BUTTONS = [
    { label: "+15m", minutes: 15 },
    { label: "+1h", minutes: 60 },
    { label: "+6h", minutes: 360 },
    { label: "+1d", minutes: 1440 },
    { label: "+7d", minutes: 10080 },
];

type PlanWithMeta = AvailablePlan & {
    service_type?: string;
    mikrotik_id?: number | string | null;
    router_id?: number | string | null;
    router_name?: string | null;
    duration_minutes?: number;
    duration_days?: number;
    validity_minutes?: number;
    price?: number | string;
};

type SubscriptionWithMeta = CurrentSubscription & {
    mikrotik_id?: number | string | null;
    router_id?: number | string | null;
};

function resolvePlanDurationMinutes(plan: PlanWithMeta | null | undefined): number {
    if (!plan) return 0;
    if (typeof plan.duration_minutes === "number" && plan.duration_minutes > 0) {
        return plan.duration_minutes;
    }
    if (typeof plan.validity_minutes === "number" && plan.validity_minutes > 0) {
        return plan.validity_minutes;
    }
    if (typeof plan.duration_days === "number" && plan.duration_days > 0) {
        return plan.duration_days * 1440;
    }
    return 0;
}

function resolvePlanPrice(plan: PlanWithMeta | null | undefined): number {
    if (!plan || plan.price == null) return 0;
    const numeric = Number(plan.price);
    return Number.isFinite(numeric) && numeric > 0 ? numeric : 0;
}

function decomposeMinutes(totalMinutes: number): {
    days: number;
    hours: number;
    minutes: number;
} {
    const safe = Math.max(0, Math.floor(Number.isFinite(totalMinutes) ? totalMinutes : 0));
    const days = Math.floor(safe / 1440);
    const remainderAfterDays = safe % 1440;
    const hours = Math.floor(remainderAfterDays / 60);
    const minutes = remainderAfterDays % 60;
    return { days, hours, minutes };
}

function toLocalDateTimeInputValue(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const mins = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${mins}`;
}

export default function RenewalConfiguration({
    subscription,
    plans,
    configuration,
    selectedPlan,
    onPlanChange,
    onModeChange,
    onNotesChange,
    customMinutes,
    onCustomMinutesChange,
    className = "",
}: RenewalConfigurationProps) {
    const subMeta = subscription as SubscriptionWithMeta;
    const configMeta = configuration as RenewalConfigurationState & {
        custom_minutes?: number;
        duration_minutes?: number;
    };

    const [localCustomMinutes, setLocalCustomMinutes] = useState<number>(
        configMeta.custom_minutes ?? configMeta.duration_minutes ?? 60,
    );

    const activeMode = configuration.mode as RenewalMode;
    const activeCustomMinutes =
        customMinutes !== undefined ? customMinutes : localCustomMinutes;

    const [inputTab, setInputTab] = useState<CustomInputTab>("builder");
    const [parts, setParts] = useState(() => decomposeMinutes(activeCustomMinutes));

    // Reference anchor for calendar target selection (defaults to current time)
    const calendarAnchorDate = useMemo(() => new Date(), []);

    const [calendarTargetValue, setCalendarTargetValue] = useState<string>(() => {
        const target = new Date(
            calendarAnchorDate.getTime() + Math.max(1, activeCustomMinutes) * 60_000,
        );
        return toLocalDateTimeInputValue(target);
    });

    // Keep days/hours/minutes breakdown synced when external presets or minute inputs change total minutes
    useEffect(() => {
        const currentComposed = parts.days * 1440 + parts.hours * 60 + parts.minutes;
        if (currentComposed !== activeCustomMinutes) {
            setParts(decomposeMinutes(activeCustomMinutes));
        }
    }, [activeCustomMinutes, parts.days, parts.hours, parts.minutes]);

    const handleCustomMinutesUpdate = (nextMinutes: number) => {
        const sanitized = Math.max(0, Math.round(Number.isFinite(nextMinutes) ? nextMinutes : 0));
        setParts(decomposeMinutes(sanitized));

        const nextTarget = new Date(Date.now() + Math.max(1, sanitized) * 60_000);
        setCalendarTargetValue(toLocalDateTimeInputValue(nextTarget));

        if (onCustomMinutesChange) {
            onCustomMinutesChange(sanitized);
        } else {
            setLocalCustomMinutes(sanitized);
        }
    };

    const handlePartsChange = (
        field: "days" | "hours" | "minutes",
        rawValue: number,
    ) => {
        const cleanVal = Math.max(0, Math.floor(Number.isFinite(rawValue) ? rawValue : 0));
        const nextParts = {
            ...parts,
            [field]: cleanVal,
        };
        setParts(nextParts);
        const total = nextParts.days * 1440 + nextParts.hours * 60 + nextParts.minutes;
        handleCustomMinutesUpdate(total);
    };

    const handleCalendarChange = (nextDateTimeStr: string) => {
        setCalendarTargetValue(nextDateTimeStr);
        if (!nextDateTimeStr) return;

        const targetDate = new Date(nextDateTimeStr);
        if (Number.isNaN(targetDate.getTime())) return;

        const diffMs = targetDate.getTime() - Date.now();
        const diffMinutes = Math.max(0, Math.round(diffMs / 60_000));
        setParts(decomposeMinutes(diffMinutes));

        if (onCustomMinutesChange) {
            onCustomMinutesChange(diffMinutes);
        } else {
            setLocalCustomMinutes(diffMinutes);
        }
    };

    const handleQuickAddMinutes = (deltaMinutes: number) => {
        handleCustomMinutesUpdate(activeCustomMinutes + deltaMinutes);
    };

    // 1. Filter plans strictly by customer's service_type and MikroTik router
    const filteredPlans = useMemo(() => {
        const targetService = String(subscription.service_type ?? "").trim().toUpperCase();
        const targetRouterId = subMeta.mikrotik_id ?? subMeta.router_id ?? null;
        const targetRouterName = String(subscription.router_name ?? "").trim().toLowerCase();

        return (plans as PlanWithMeta[]).filter((plan) => {
            if (targetService && plan.service_type) {
                if (String(plan.service_type).trim().toUpperCase() !== targetService) {
                    return false;
                }
            }

            const planRouterId = plan.mikrotik_id ?? plan.router_id ?? null;
            if (targetRouterId != null && planRouterId != null) {
                return String(planRouterId) === String(targetRouterId);
            }

            const planRouterName = String(plan.router_name ?? "").trim().toLowerCase();
            if (targetRouterName && planRouterName) {
                return planRouterName === targetRouterName;
            }

            return true;
        });
    }, [plans, subscription.service_type, subMeta.mikrotik_id, subMeta.router_id, subscription.router_name]);

    // 2. Current plan from subscription.plan (used as default plan_id and for wallet calculation)
    const currentPlan = useMemo(() => {
        const subPlan = subscription.plan as PlanWithMeta | undefined;
        if (subPlan?.id != null) {
            return (
                filteredPlans.find((p) => String(p.id) === String(subPlan.id)) ?? subPlan
            );
        }
        return filteredPlans[0] ?? null;
    }, [subscription.plan, filteredPlans]);

    const currentPlanId = useMemo(() => {
        if (currentPlan?.id != null) return Number(currentPlan.id);
        if (subscription.plan?.id != null) return Number(subscription.plan.id);
        return null;
    }, [currentPlan, subscription.plan]);

    // Effective plan_id submitted for ANY mode:
    // - extend / reset: selectedPlan.id if changed, otherwise currentPlanId
    // - custom / wallet: always currentPlanId (for rate_limit & plan metadata)
    const effectivePlanId = useMemo(() => {
        if (activeMode === "extend" || activeMode === "reset") {
            return selectedPlan?.id ?? currentPlanId;
        }
        return currentPlanId;
    }, [activeMode, selectedPlan, currentPlanId]);

    // 3. Wallet balance from CurrentSubscription.walletbalance
    const availableWallet = useMemo(() => {
        const parsed = Number(subscription.walletbalance ?? 0);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    }, [subscription.walletbalance]);

    // Calculate top-up minutes from subscription.walletbalance against currentPlan.price & duration
    const walletCalculation = useMemo(() => {
        const planPrice = resolvePlanPrice(currentPlan);
        const planMinutes = resolvePlanDurationMinutes(currentPlan);

        if (availableWallet <= 0 || planPrice <= 0 || planMinutes <= 0) {
            return {
                redeemableMinutes: 0,
                amountUsed: 0,
                planPrice,
                planMinutes,
            };
        }

        const redeemableMinutes = Math.max(
            0,
            Math.floor((availableWallet / planPrice) * planMinutes),
        );
        const amountUsed =
            redeemableMinutes > 0
                ? Number(
                      Math.min(
                          availableWallet,
                          (redeemableMinutes / planMinutes) * planPrice,
                      ).toFixed(2),
                  )
                : 0;

        return {
            redeemableMinutes,
            amountUsed,
            planPrice,
            planMinutes,
        };
    }, [availableWallet, currentPlan]);

    return (
        <div className={`space-y-5 sm:space-y-6 ${className}`}>
            {/* Current Active Subscription Display */}
            <CurrentSubscriptionCard subscription={subscription} />

            {/* Renewal Mode Toggle Selection */}
            <RenewalModeSelector
                value={activeMode}
                onChange={onModeChange}
            />

            {/* EXTEND or RESET: Show only filtered plans */}
            {(activeMode === "extend" || activeMode === "reset") && (
                <section className="space-y-3 sm:space-y-4">
                    <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                            Select Renewal Plan
                        </h3>
                        <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            Showing plans matching{" "}
                            <span className="font-semibold text-slate-700 dark:text-slate-200">
                                {subscription.service_type || "customer service"}
                            </span>
                            {subscription.router_name ? (
                                <>
                                    {" "}on{" "}
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                                        {subscription.router_name}
                                    </span>
                                </>
                            ) : null}
                            . Defaults to current plan if unchanged.
                        </p>
                    </div>

                    {filteredPlans.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 p-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            No plans found matching{" "}
                            <span className="font-semibold text-slate-700 dark:text-slate-200">
                                {subscription.service_type || "this service"}
                            </span>
                            {subscription.router_name ? ` on ${subscription.router_name}` : ""}.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3 sm:gap-4">
                            {filteredPlans.map((plan) => {
                                const isSelected =
                                    selectedPlan != null
                                        ? selectedPlan.id === plan.id
                                        : currentPlanId != null &&
                                          String(plan.id) === String(currentPlanId);

                                return (
                                    <PlanCard
                                        key={plan.id}
                                        title={plan.name}
                                        plan={plan}
                                        selected={isSelected}
                                        onSelect={() => onPlanChange(plan.id)}
                                    />
                                );
                            })}
                        </div>
                    )}
                </section>
            )}

            {/* CUSTOM: Flexible Days / Hours / Minutes + Calendar + Direct Minutes */}
            {activeMode === "custom" && (
                <section className="space-y-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-blue-600 dark:text-blue-400" />
                            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                                Custom Duration Builder
                            </h3>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="rounded-md bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 text-[11px] font-mono font-semibold text-blue-700 dark:text-blue-300">
                                {activeCustomMinutes.toLocaleString()} mins ({formatDuration(activeCustomMinutes)})
                            </span>
                            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                                Plan #{effectivePlanId ?? "-"}
                            </span>
                        </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Combine days, hours, and minutes, pick a target date/time on the calendar,
                        or enter total minutes directly. Always sent to the backend as{" "}
                        <strong className="font-semibold text-slate-700 dark:text-slate-200">
                            minutes
                        </strong>
                        {currentPlan ? ` using plan (${currentPlan.name}) for rate limits` : ""}.
                    </p>

                    {/* Input Method Switcher */}
                    <div className="grid grid-cols-3 gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 p-1 text-xs">
                        <button
                            type="button"
                            onClick={() => setInputTab("builder")}
                            className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 font-medium transition ${
                                inputTab === "builder"
                                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                            <Clock size={13} />
                            <span>Days / Hrs / Mins</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setInputTab("calendar")}
                            className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 font-medium transition ${
                                inputTab === "calendar"
                                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                            <Calendar size={13} />
                            <span>Calendar</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setInputTab("minutes")}
                            className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 font-medium transition ${
                                inputTab === "minutes"
                                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                            <span>Total Mins</span>
                        </button>
                    </div>

                    {/* Tab 1: Days / Hours / Minutes Inputs */}
                    {inputTab === "builder" && (
                        <div className="grid grid-cols-3 gap-2.5">
                            <div className="space-y-1">
                                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Days
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    step={1}
                                    value={parts.days}
                                    onChange={(e) => handlePartsChange("days", Number(e.target.value))}
                                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Hours
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    step={1}
                                    value={parts.hours}
                                    onChange={(e) => handlePartsChange("hours", Number(e.target.value))}
                                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Minutes
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    step={1}
                                    value={parts.minutes}
                                    onChange={(e) => handlePartsChange("minutes", Number(e.target.value))}
                                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                        </div>
                    )}

                    {/* Tab 2: Calendar Date & Time Picker */}
                    {inputTab === "calendar" && (
                        <div className="space-y-2.5">
                            <div className="space-y-1">
                                <label
                                    htmlFor="custom-duration-calendar"
                                    className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                                >
                                    Target End Date & Time
                                </label>
                                <input
                                    id="custom-duration-calendar"
                                    type="datetime-local"
                                    value={calendarTargetValue}
                                    onChange={(e) => handleCalendarChange(e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Converts your selected calendar date & time into{" "}
                                <strong className="text-slate-700 dark:text-slate-200">
                                    {activeCustomMinutes.toLocaleString()} minutes
                                </strong>{" "}
                                from now.
                            </p>
                        </div>
                    )}

                    {/* Tab 3: Direct Total Minutes Input */}
                    {inputTab === "minutes" && (
                        <div className="space-y-1">
                            <label
                                htmlFor="custom-duration-minutes"
                                className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                            >
                                Exact Minutes
                            </label>
                            <input
                                id="custom-duration-minutes"
                                type="number"
                                min={1}
                                step={1}
                                value={activeCustomMinutes}
                                onChange={(e) => handleCustomMinutesUpdate(Number(e.target.value))}
                                placeholder="e.g. 50, 180, 1440"
                                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                    )}

                    {/* Quick Increment (+Add) & Clear */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                            {QUICK_ADD_BUTTONS.map((item) => (
                                <button
                                    key={item.label}
                                    type="button"
                                    onClick={() => handleQuickAddMinutes(item.minutes)}
                                    className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/40 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 transition hover:bg-emerald-100 dark:hover:bg-emerald-950/70"
                                >
                                    <Plus size={11} />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>

                        {activeCustomMinutes > 0 && (
                            <button
                                type="button"
                                onClick={() => handleCustomMinutesUpdate(0)}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <RotateCcw size={11} />
                                <span>Reset (0m)</span>
                            </button>
                        )}
                    </div>

                    {/* Duration Presets */}
                    <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                        {DURATION_PRESETS.map((preset) => (
                            <button
                                key={preset.minutes}
                                type="button"
                                onClick={() => handleCustomMinutesUpdate(preset.minutes)}
                                className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                                    activeCustomMinutes === preset.minutes
                                        ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                                        : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                                }`}
                            >
                                {preset.label} ({preset.minutes}m)
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* WALLET: Show only wallet balance redemption calculation */}
            {activeMode === "wallet" && (
                <section className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-start gap-2.5">
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                                <Wallet size={16} />
                            </div>
                            <div>
                                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                                    Redeem Wallet Balance
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Current subscription wallet balance:{" "}
                                    <strong className="font-semibold text-slate-800 dark:text-slate-200">
                                        KES {availableWallet.toLocaleString()}
                                    </strong>
                                </p>
                            </div>
                        </div>

                        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                            Plan ID #{effectivePlanId ?? "-"}
                        </span>
                    </div>

                    <div className="rounded-lg border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/40 p-3 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                        {currentPlan &&
                        walletCalculation.planPrice > 0 &&
                        walletCalculation.planMinutes > 0 ? (
                            <>
                                <p>
                                    Calculated using current plan{" "}
                                    <strong>{currentPlan.name}</strong> (Price KES{" "}
                                    {walletCalculation.planPrice.toLocaleString()} for{" "}
                                    {formatDuration(walletCalculation.planMinutes)})
                                </p>
                                <p className="font-semibold">
                                    Top-up duration: {formatDuration(walletCalculation.redeemableMinutes)}
                                    {walletCalculation.amountUsed > 0
                                        ? ` (KES ${walletCalculation.amountUsed.toLocaleString()} from wallet balance)`
                                        : ""}
                                </p>
                            </>
                        ) : (
                            <p className="text-amber-700 dark:text-amber-300">
                                Unable to calculate wallet top-up: ensure subscription wallet
                                balance is above 0 and the current plan has valid price and
                                duration.
                            </p>
                        )}
                    </div>
                </section>
            )}

            {/* Optional Operator Notes Textarea */}
            <section className="space-y-2">
                <label
                    htmlFor="renewal-notes"
                    className="block text-base sm:text-lg font-bold text-slate-900 dark:text-white"
                >
                    Internal Notes
                </label>

                <textarea
                    id="renewal-notes"
                    rows={3}
                    value={configuration.notes}
                    onChange={(event) => onNotesChange(event.target.value)}
                    placeholder="Optional notes or references for this renewal action..."
                    className="
                        w-full
                        rounded-xl
                        border
                        border-slate-300 dark:border-slate-700
                        bg-white dark:bg-slate-900
                        px-3.5 py-2.5
                        text-xs sm:text-sm
                        text-slate-900 dark:text-white
                        placeholder-slate-400 dark:placeholder-slate-500
                        shadow-sm
                        transition
                        focus:border-blue-500 dark:focus:border-blue-400
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500/20 dark:focus:ring-blue-400/20
                    "
                />
            </section>
        </div>
    );
}