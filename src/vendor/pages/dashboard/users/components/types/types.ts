/* =========================================================
 * USER
 * ========================================================= */
import type { Payment } from "../../payments/components/types/types";
import type { BaseSubscription } from "./subscription";

export interface User {
    id: number;

    full_name: string;

    username: string;

    phone: string;

    email: string;

    active: boolean;

    created_at: string;

    avatar?: string | null;
}

/* =========================================================
 * OVERVIEW
 * ========================================================= */

export interface Overview {

    // ==========================
    // Customer
    // ==========================

    customer_since: string;

    // ==========================
    // Financial
    // ==========================

    lifetime_spend: number;

    current_balance: number;

    average_purchase: number;

    total_payments: number;

    // ==========================
    // Purchases
    // ==========================

    hotspot_purchases: number;

    pppoe_purchases: number;

    // ==========================
    // Services
    // ==========================

    active_services: number;

    active_hotspot: boolean;

    active_pppoe: boolean;

    // ==========================
    // Usage
    // ==========================

    total_sessions: number;

    // ==========================
    // Dates
    // ==========================

    first_purchase: string | null;

    last_payment: string | null;

    status: "active" | "offline" | "suspended" | "expired" | "pending";

    last_seen: string | null;

}

/* =========================================================
 * HOTSPOT
 * ========================================================= */

export interface HotspotCredential {

    id: number;

    username: string;

    password: string;

    active: boolean;

    suspended: boolean;

    created_at: string;

}

export interface HotspotConnection {

    online: boolean;

    router?: string;

    ip_address?: string;

    mac_address?: string;

    login_time?: string | null;

    uptime?: string | null;

    
}
export interface ConnectionStatus {

    online: boolean;

    router_name: string;

    ip_address: string;

    mac_address: string;

    login_time: string;

    uptime_seconds: number;

    download_bytes: number;

    upload_bytes: number;

    last_seen: string;

}

export interface Hotspot {

    credential: HotspotCredential | null;

    current_subscription: HotspotSubscription | null;

    connection: ConnectionStatus | null;

}


export interface SubscriptionSummary {

    percentage_remaining: number;

    remaining_seconds: number;

    expired: boolean;

}


/* =========================================================
 * PPPOE
 * ========================================================= */

export interface PPPoECredential {

    id: number;

    mikrotik: string;

    username: string;

    password: string;

    active: boolean;

    suspended: boolean;

    created_at: string;

}

export interface PPPoEProfile {

    credential: PPPoECredential | null;

    current_subscription: SubscriptionSummary | null;

    history: SubscriptionSummary[];

}

export interface PPPoESubscription {

    id: number;

    plan_name: string;

    start_at: string;

    end_at: string;

    active: boolean;

}

/* =========================================================
 * PAYMENTS
 * ========================================================= */



/* =========================================================
 * RADIUS SESSION
 * ========================================================= */

export interface RadiusSession {

    id: number;

    router: string;

    ip_address: string;

    mac_address: string;

    login_time: string;

    logout_time: string | null;

    duration: string;

    bytes_in: number;

    bytes_out: number;

}

/* =========================================================
 * DEVICES
 * ========================================================= */

export interface Device {

    id?: number;

    name: string;

    type: "phone" | "computer" | "router" | "tablet" | "unknown";

    identifier?: string;

    mac_address?: string;

    ip_address?: string;

    status: "active" | "offline";

    source: "Hotspot" | "PPPoE" | "GenieACS";

    vendor?: string;

    online: boolean;

}

/* =========================================================
 * ACTIVITY
 * ========================================================= */

export interface Activity {

    id: number;

    type:
        | "PAYMENT"
        | "HOTSPOT_LOGIN"
        | "HOTSPOT_LOGOUT"
        | "PPPOE_LOGIN"
        | "PPPOE_LOGOUT"
        | "SUBSCRIPTION"
        | "ACCOUNT"
        | "PASSWORD";

    title: string;

    description: string;

    status:
        | "success"
        | "warning"
        | "error"
        | "info";

    created_at: string;

    amount?: number;

}
/* =========================================================
 * COMPLETE PROFILE
 * ========================================================= */

export interface UserProfile {

    user: User;

    overview: Overview;

    hotspot: {

        credential: HotspotCredential | null;

        connection: HotspotConnection | null;

        current_subscription: HotspotSubscription | null;

    };

    hotspot_history: HotspotSubscription[];

    pppoe: {

        credential: PPPoECredential | null;

        current_subscription: PPPoESubscription | null;

    };

    connection: HotspotConnection | null;

    pppoe_history: PPPoESubscription[];

    payments: Payment[];

    devices: Device[];

    sessions: RadiusSession[];

    activity: Activity[];



    //tickets: SupportTicket[];

   // notes: CustomerNote[];

   // invoices: Invoice[];

    //sms_logs: SMSLog[];

    //emails: EmailLog[];

    //addresses: CustomerAddress[];

    //genieacs: GenieDevice[];


}

export type UserTab =
    | "overview"
    | "hotspot"
    | "pppoe"
    | "payments"
    | "sessions"
    | "devices"
    | "activity";



export interface HotspotSubscription extends BaseSubscription {

    credential: HotspotCredential;

    }


export interface PPPoESubscription extends BaseSubscription {

    credential: PPPoECredential;

    is_trial: boolean;

}