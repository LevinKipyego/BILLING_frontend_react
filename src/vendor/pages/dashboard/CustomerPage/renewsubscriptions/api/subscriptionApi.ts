import { apiFetch } from "../../../../../api/client";

import type { ApiResponse } from "../types/api";

import type {
    AvailablePlan,
    CurrentSubscription,
    RenewSubscriptionPayload,
    RenewSubscriptionResult,
} from "../types/subscription";

/* =====================================================
 * Current Subscription
 * ===================================================== */

export function getCurrentSubscription(
    customerId: number,
): Promise<ApiResponse<CurrentSubscription>> {

    return apiFetch(
        `/customers/${customerId}/subscription/`,
    );

}

/* =====================================================
 * Available Plans
 * ===================================================== */

export function getAvailablePlans(
): Promise<AvailablePlan[]> {

    return apiFetch("/plans/");

}

/* =====================================================
 * Renew Subscription
 * ===================================================== */

export function renewSubscription(
    customerId: number,
    payload: RenewSubscriptionPayload,
): Promise<ApiResponse<RenewSubscriptionResult>> {

    return apiFetch(
        `/customers/${customerId}/renew/`,
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
    );

}