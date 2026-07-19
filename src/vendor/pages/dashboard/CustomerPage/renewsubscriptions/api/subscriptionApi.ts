import { apiFetch } from "../../../../../api/client";
import type {
    CurrentSubscription,
    RenewSubscriptionPayload,
    RenewSubscriptionResponse,
} from "../types/subscription";

/* ===========================================================
   Get Current Subscription
=========================================================== */

export async function getCurrentSubscription(
    customerId: number,
): Promise<CurrentSubscription> {

    return apiFetch(
        `/customers/${customerId}/subscription/`,
    );

}

/* ===========================================================
   Renewal Preview
=========================================================== */

export async function previewRenewal(
    customerId: number,
    payload: RenewSubscriptionPayload,
): Promise<RenewSubscriptionResponse> {

    return apiFetch(

        `/customers/${customerId}/subscription/preview/`,

        {

            method: "POST",

            body: JSON.stringify(payload),

        },

    );

}

/* ===========================================================
   Renew Subscription
=========================================================== */

export async function renewSubscription(
    customerId: number,
    payload: RenewSubscriptionPayload,
): Promise<RenewSubscriptionResponse> {

    return apiFetch(

        `/customers/${customerId}/subscription/renew/`,

        {

            method: "POST",

            body: JSON.stringify(payload),

        },

    );

}

/* ===========================================================
   Suspend Subscription
=========================================================== */

export async function suspendSubscription(
    customerId: number,
): Promise<void> {

    await apiFetch(

        `/customers/${customerId}/subscription/suspend/`,

        {

            method: "POST",

        },

    );

}

/* ===========================================================
   Resume Subscription
=========================================================== */

export async function resumeSubscription(
    customerId: number,
): Promise<void> {

    await apiFetch(

        `/customers/${customerId}/subscription/resume/`,

        {

            method: "POST",

        },

    );

}

/* ===========================================================
   Cancel Subscription
=========================================================== */

export async function cancelSubscription(
    customerId: number,
): Promise<void> {

    await apiFetch(

        `/customers/${customerId}/subscription/cancel/`,

        {

            method: "POST",

        },

    );

}