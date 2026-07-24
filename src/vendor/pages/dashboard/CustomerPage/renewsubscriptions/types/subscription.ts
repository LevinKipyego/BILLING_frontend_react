/* =====================================================
 * Available Plan
 * ===================================================== */

export interface AvailablePlan {

    id: number;

    name: string;

    description?: string | null;

    service_type: string;

    price: number;

    duration_minutes: number;

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

    remaining_minutes: number;

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

    new_expiry: string;

    start_at: string;

    end_at: string;

    amount: number;

    duration_minutes: number;

    extends_minutes: number;

    formatted_duration: string;

    formatted_remaining: string;

    price_difference: number;

    plan_changed: boolean;

}

/* =====================================================
 * Renewal Summary
 * ===================================================== */

export interface RenewalSummary {

    mode: RenewalMode;

    plan_name: string;

    amount: number;

    duration_minutes: number;

    formatted_duration: string;

    effective_date: string;

    expiry_date: string;

    start_at: string;

    end_at: string;

    plan_changed: boolean;

    total_changes: number;

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