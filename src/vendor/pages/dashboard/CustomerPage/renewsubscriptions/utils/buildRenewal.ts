import { addDays } from "./date";

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

    const endDate = addDays(
        startDate,
        selectedPlan.duration_days,
    );

    const payload = {

        plan_id: selectedPlan.id,

        mode: configuration.mode,

        notes:
            configuration.notes.trim() || undefined,

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
        configuration.mode === "reset"
    ) {

        changes.push({

            field: "Renewal Mode",

            old_value: "Extend",

            new_value: "Reset",

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

        start_at:
            startDate.toISOString(),

        end_at:
            endDate.toISOString(),

        amount:
            selectedPlan.price,

        duration_days:
            selectedPlan.duration_days,

        extends_days:
            selectedPlan.duration_days,

        price_difference:

            selectedPlan.price -

            subscription.plan.price,

    };

    const summary = {

        mode:
            configuration.mode,

        plan_name:
            selectedPlan.name,

        amount:
            selectedPlan.price,

        duration_days:
            selectedPlan.duration_days,

        start_at:
            startDate.toISOString(),

        end_at:
            endDate.toISOString(),

    };

    return {

        payload,

        preview,

        summary,

        changes,

    };

}