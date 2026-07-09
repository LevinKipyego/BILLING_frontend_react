export interface SubscriptionPlan {

    id: number;

    name: string;

    price: number;

}

export interface SubscriptionTransaction {

    id: number;

    transaction_id: string;

    amount: number;

    status: string;

    created_at: string;

}

export interface SubscriptionSummary {

    percentage_remaining: number;

    remaining_seconds: number;

    expired: boolean;

}

export interface BaseSubscription {

    id: number;

    active: boolean;

    start_at: string;

    end_at: string;

    created_at: string;

    plan: SubscriptionPlan;

    transaction?: SubscriptionTransaction | null;

    summary: SubscriptionSummary;

}

