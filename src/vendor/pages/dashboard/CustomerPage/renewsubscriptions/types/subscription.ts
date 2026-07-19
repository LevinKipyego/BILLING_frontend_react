import type {
    Customer,
    Mikrotik,
    Plan,
} from "./subscription";

export type RenewalMode =
    | "EXTEND"
    | "IMMEDIATE"
    | "CUSTOM";

export interface CurrentSubscription {

    id: number;

    service_type: "HOTSPOT" | "PPPOE";

    plan: Plan | null;

    mikrotik: Mikrotik | null;

    start_at: string;

    end_at: string;

    active: boolean;

}

export interface RenewalState {

    mode: RenewalMode;

    plan: Plan | null;

    mikrotik: Mikrotik | null;

    start_at: string | null;

    activate: boolean;

    push_radius: boolean;

}

export interface RenewalWarning {

    type:
        | "info"
        | "warning"
        | "error";

    message: string;

}

export interface RenewalSummary {

    oldExpiry: string;

    newExpiry: string;

    duration: number;

    price: string;

}

export interface RenewSubscriptionPayload {

    plan_id: number;

    mikrotik_id: string;

    renew_mode: RenewalMode;

    start_at: string | null;

    activate: boolean;

    push_radius: boolean;

}

export interface RenewSubscriptionModalProps {

    open: boolean;

    customer: Customer;

    subscription: CurrentSubscription;

    plans: Plan[];

    mikrotiks: Mikrotik[];

    loading?: boolean;

    onClose(): void;

    onSubmit(
        payload: RenewSubscriptionPayload
    ): Promise<void>;

}