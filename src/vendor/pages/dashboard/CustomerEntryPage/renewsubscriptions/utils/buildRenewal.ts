import { addMinutes, formatDuration } from "./date";

import type {
    AvailablePlan,
    CurrentSubscription,
    SubscriptionChange,
} from "../types/subscription";

import type {
    Renewal,
    RenewalConfiguration,
} from "../types/renewal";

type RenewalModeValue = "extend" | "reset" | "custom" | "wallet" | string;

type ExtendedConfiguration = RenewalConfiguration & {
    mode: RenewalModeValue;
    custom_minutes?: number;
    duration_minutes?: number;
    redeem_wallet?: boolean;
};

type ExtendedPlan = AvailablePlan & {
    duration_days?: number;
    validity_minutes?: number;
};

function resolvePlanDurationMinutes(plan: ExtendedPlan | null | undefined): number {
    if (!plan) return 0;
    if (typeof plan.duration_minutes === "number" && plan.duration_minutes > 0) {
        return Math.floor(plan.duration_minutes);
    }
    if (typeof plan.validity_minutes === "number" && plan.validity_minutes > 0) {
        return Math.floor(plan.validity_minutes);
    }
    if (typeof plan.duration_days === "number" && plan.duration_days > 0) {
        return Math.floor(plan.duration_days * 1440);
    }
    return 0;
}

function resolveStartDate(mode: RenewalModeValue, expiresAt: string | undefined): Date {
    if (mode === "reset") {
        return new Date();
    }

    if (!expiresAt) {
        return new Date();
    }

    const parsed = new Date(expiresAt);
    if (Number.isNaN(parsed.getTime())) {
        return new Date();
    }

    // For extend / custom / wallet top-ups on active/future subscriptions, extend from currentExpiry;
    // if already expired, start from now
    const now = new Date();
    if (mode === "extend" && parsed.getTime() > now.getTime()) {
        return parsed;
    }

    return mode === "extend" ? parsed : now;
}

export function buildRenewal(
    subscription: CurrentSubscription,
    selectedPlan: AvailablePlan | null,
    configuration: ExtendedConfiguration,
): Renewal {
    const mode: RenewalModeValue = configuration.mode ?? "extend";
    const currentPlan = subscription.plan as ExtendedPlan;
    const chosenPlan = (selectedPlan ?? currentPlan) as ExtendedPlan;

    // Always resolve a plan for plan_id & rate_limit (preferring selectedPlan in extend/reset, else currentPlan)
    const effectivePlan =
        mode === "extend" || mode === "reset"
            ? (selectedPlan as ExtendedPlan | null) ?? currentPlan
            : currentPlan;

    const effectivePlanId = effectivePlan?.id ?? currentPlan?.id;
    const planDurationMinutes = resolvePlanDurationMinutes(chosenPlan);
    const planPrice = Number(chosenPlan?.price ?? 0) || 0;
    const currentPlanPrice = Number(currentPlan?.price ?? 0) || 0;

    const customMinutes = Math.max(
        0,
        Math.floor(Number(configuration.custom_minutes ?? configuration.duration_minutes ?? 0) || 0),
    );

    const walletBalance = Math.max(0, Number(subscription.walletbalance ?? 0) || 0);
    const walletPlanPrice = Number(currentPlan?.price ?? 0) || 0;
    const walletPlanMinutes = resolvePlanDurationMinutes(currentPlan);

    let effectiveDurationMinutes = 0;
    let amount = 0;
    let walletAmountUsed = 0;

    if (mode === "custom") {
        effectiveDurationMinutes = customMinutes;
        amount = 0;
        walletAmountUsed = 0;
    } else if (mode === "wallet") {
        if (walletBalance > 0 && walletPlanPrice > 0 && walletPlanMinutes > 0) {
            effectiveDurationMinutes = Math.max(
                0,
                Math.floor((walletBalance / walletPlanPrice) * walletPlanMinutes),
            );
            walletAmountUsed =
                effectiveDurationMinutes > 0
                    ? Number(
                          Math.min(
                              walletBalance,
                              (effectiveDurationMinutes / walletPlanMinutes) * walletPlanPrice,
                          ).toFixed(2),
                      )
                    : 0;
        }
        amount = walletAmountUsed;
    } else {
        // "extend" or "reset"
        effectiveDurationMinutes = planDurationMinutes;
        amount = planPrice;
    }

    const startDate = resolveStartDate(mode, subscription.expires_at);
    const endDate = addMinutes(startDate, effectiveDurationMinutes);

    const payload = {
        plan_id: effectivePlanId,
        mode,
        duration_minutes: effectiveDurationMinutes,
        ...(mode === "custom" ? { custom_minutes: customMinutes } : {}),
        ...(mode === "wallet"
            ? {
                  redeem_wallet: true,
                  wallet_amount_used: walletAmountUsed,
              }
            : {}),
        notes: configuration.notes?.trim() || undefined,
    };

    const changes: SubscriptionChange[] = [];

    if (
        (mode === "extend" || mode === "reset") &&
        currentPlan &&
        chosenPlan &&
        currentPlan.id !== chosenPlan.id
    ) {
        changes.push({
            field: "Plan",
            old_value: currentPlan.name,
            new_value: chosenPlan.name,
        });
    }

    if (mode !== "extend") {
        changes.push({
            field: "Renewal Mode",
            old_value: "extend",
            new_value: mode,
        });
    }

    if (mode === "wallet" && walletAmountUsed > 0) {
        changes.push({
            field: "Wallet Balance",
            old_value: `KES ${walletBalance.toLocaleString()}`,
            new_value: `KES ${Math.max(0, Number((walletBalance - walletAmountUsed).toFixed(2))).toLocaleString()}`,
        });
    }

    changes.push({
        field: "Expiry",
        old_value: subscription.expires_at,
        new_value: endDate.toISOString(),
    });

    const formattedDuration = formatDuration(effectiveDurationMinutes);

    const preview = {
        current_plan: currentPlan,
        new_plan: chosenPlan,
        mode,
        current_expiry: subscription.expires_at,
        new_expiry: endDate.toISOString(),
        start_at: startDate.toISOString(),
        end_at: endDate.toISOString(),
        amount,
        wallet_amount_used: walletAmountUsed,
        duration_minutes: effectiveDurationMinutes,
        extends_minutes: effectiveDurationMinutes,
        formatted_duration: formattedDuration,
        formatted_remaining: formatDuration(subscription.remaining_minutes),
        price_difference: amount - currentPlanPrice,
        plan_changed: Boolean(currentPlan && chosenPlan && currentPlan.id !== chosenPlan.id),
    };

    const summary = {
        mode,
        plan_name: chosenPlan?.name ?? currentPlan?.name ?? "",
        amount,
        wallet_amount_used: walletAmountUsed,
        duration_minutes: effectiveDurationMinutes,
        formatted_duration: formattedDuration,
        effective_date: startDate.toISOString(),
        expiry_date: endDate.toISOString(),
        start_at: startDate.toISOString(),
        end_at: endDate.toISOString(),
        plan_changed: Boolean(currentPlan && chosenPlan && currentPlan.id !== chosenPlan.id),
        total_changes: changes.length,
    };

    return {
        payload,
        preview,
        summary,
        changes,
    } as Renewal;
}