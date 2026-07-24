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

export function buildRenewal(
    subscription: CurrentSubscription,
    selectedPlan: AvailablePlan,
    configuration: RenewalConfiguration,
): Renewal {

    const currentExpiry = new Date(
        subscription.expires_at,
    );

    const startDate =
        configuration.mode === "reset"
            ? new Date()
            : currentExpiry;

    const endDate = addMinutes(
        startDate,
        selectedPlan.duration_minutes,
    );

    const payload = {

        plan_id: selectedPlan.id,

        mode: configuration.mode,

        notes:
            configuration.notes.trim() ||
            undefined,

    };

    const changes: SubscriptionChange[] = [];

    if (
        subscription.plan.id !==
        selectedPlan.id
    ) {

        changes.push({

            field: "Plan",

            old_value:
                subscription.plan.name,

            new_value:
                selectedPlan.name,

        });

    }

    if (
        configuration.mode !== "extend"
    ) {

        changes.push({

            field: "Renewal Mode",

            old_value: "Extend",

            new_value:
                configuration.mode,

        });

    }

    changes.push({

        field: "Expiry",

        old_value:
            subscription.expires_at,

        new_value:
            endDate.toISOString(),

    });

    const preview = {

        current_plan: subscription.plan,

        new_plan: selectedPlan,

        mode: configuration.mode,

        current_expiry:
            subscription.expires_at,

        new_expiry:
            endDate.toISOString(),

        start_at:
            startDate.toISOString(),

        end_at:
            endDate.toISOString(),

        amount:
            selectedPlan.price,

        duration_minutes:
            selectedPlan.duration_minutes,

        extends_minutes:
            selectedPlan.duration_minutes,

        formatted_duration:
            formatDuration(
                selectedPlan.duration_minutes,
            ),

        formatted_remaining:
            formatDuration(
                subscription.remaining_minutes,
            ),

        price_difference:
            selectedPlan.price -
            subscription.plan.price,

        plan_changed:
            subscription.plan.id !==
            selectedPlan.id,

    };

    const summary = {

        mode:
            configuration.mode,

        plan_name:
            selectedPlan.name,

        amount:
            selectedPlan.price,

        duration_minutes:
            selectedPlan.duration_minutes,

        formatted_duration:
            formatDuration(
                selectedPlan.duration_minutes,
            ),

        effective_date:
            startDate.toISOString(),

        expiry_date:
            endDate.toISOString(),

        start_at:
            startDate.toISOString(),

        end_at:
            endDate.toISOString(),

        plan_changed:
            subscription.plan.id !==
            selectedPlan.id,

        total_changes:
            changes.length,

    };

    return {

        payload,

        preview,

        summary,

        changes,

    };

}