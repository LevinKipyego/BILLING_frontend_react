/* =====================================================
 * Available Plan
 * ===================================================== */

export interface AvailablePlan {

    id: number;

    name: string;

    description?: string;

    price: number;

    duration_days: number;

    service_type: string;

    router_name?: string | null;

}

/* =====================================================
 * Current Subscription
 * ===================================================== */

export interface CurrentSubscription {

    id: number;

    username: string;

    service_type: string;

    status: string;

    plan: AvailablePlan;

    router_name?: string | null;

    started_at: string;

    expires_at: string;

    remaining_days: number;

    auto_renew: boolean;

}

/* =====================================================
 * Subscription Change
 * ===================================================== */

export interface SubscriptionChange {

    field: string;

    old_value: string | number | boolean | null;

    new_value: string | number | boolean | null;

}

/* =====================================================
 * Renewal Mode
 * ===================================================== */

export type RenewalMode =

    | "extend"

    | "reset";

/* =====================================================
 * Renewal Preview
 * ===================================================== */

export interface RenewalPreview {

    current_plan: AvailablePlan;

    new_plan: AvailablePlan;

    mode: RenewalMode;

    current_expiry: string;

    start_at: string;

    end_at: string;

    amount: number;

    duration_days: number;

    extends_days: number;

    price_difference: number;

}

/* =====================================================
 * Renewal Summary
 * ===================================================== */

export interface RenewalSummary {

    mode: RenewalMode;

    plan_name: string;

    amount: number;

    duration_days: number;

    start_at: string;

    end_at: string;

}

/* =====================================================
 * Renew Payload
 * ===================================================== */

export interface RenewSubscriptionPayload {

    plan_id: number;

    mode: RenewalMode;

    notes?: string;

}

/* =====================================================
 * Renew Result
 * ===================================================== */

export interface RenewSubscriptionResult {

    subscription: CurrentSubscription;

}