// ======================================================
// PLAN
// ======================================================

export interface SubscriptionPlan {

    id: number;

    name: string;

    price: number;

    duration?: number;

    speed?: string;

    description?: string;

}

// ======================================================
// TRANSACTION
// ======================================================

export interface SubscriptionTransaction {

    id: number;

    transaction_id: string;

    amount: number;

    status: string;

    created_at: string;

}

// ======================================================
// SUBSCRIPTION SUMMARY
// ======================================================

export interface SubscriptionSummary {

    percentage_remaining: number;

    remaining_seconds: number;

    expired: boolean;

    days_remaining?: number;

    hours_remaining?: number;

    human_remaining?: string;

}

export type SubscriptionStatus =
    | "ACTIVE"
    | "EXPIRED"
    | "SUSPENDED"
    | "TRIAL"
    | "PENDING";



// ======================================================
// BASE SUBSCRIPTION
// ======================================================

export interface BaseSubscription {

    id: number;

    active: boolean;

    is_trial?: boolean;

    start_at: string;

    end_at: string;

    created_at: string;

    plan: SubscriptionPlan;

    transaction?: SubscriptionTransaction | null;

    summary: SubscriptionSummary;

    status: SubscriptionStatus;

}

// ======================================================
// HOTSPOT SUBSCRIPTION
// ======================================================

export interface HotspotSubscription
    extends BaseSubscription {

    credential_username?: string;

    mikrotik_name?: string;

}

// ======================================================
// PPPOE SUBSCRIPTION
// ======================================================

export interface PPPoESubscription
    extends BaseSubscription {

    credential_username?: string;

    mikrotik_name?: string;

}

// ======================================================
// COMMON SUBSCRIPTION CARD MODEL
// ======================================================

export interface CurrentSubscription {

    id: number;

    active: boolean;

    is_trial: boolean;

    start_at: string;

    end_at: string;

    plan_name: string;

    transaction_code?: string | null;

    summary: SubscriptionSummary;

}


