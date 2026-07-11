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

    mac_address: string;

    ip_address: string;

    router_name: string;

    username: string;

    connected_since?: string;

    first_seen?: string;

    last_seen?: string;

    total_sessions: number;

    type: string;

}




export interface DeviceSummary {

    known_devices: number;

    online_devices: number;

    last_seen: string | null;

    last_router: string | null;

}


export interface CurrentDevice {

    mac_address: string;

    username: string;

    service: "HOTSPOT" | "PPPOE" | "UNKNOWN";

    ip_address: string | null;

    router_ip: string;

    router_name: string;

    connected_since: string | null;

    last_seen: string | null;

    upload_bytes: number;

    download_bytes: number;

}

export interface DeviceHistoryItem {

    mac_address: string;

    username: string;

    service: "HOTSPOT" | "PPPOE" | "UNKNOWN";

    router_name: string;

    router_ip: string;

    last_ip: string | null;

    first_seen: string;

    last_seen: string;

    sessions: number;

    upload_bytes: number;

    download_bytes: number;

}

export interface DeviceProfile {
    summary: DeviceSummary;
    current: CurrentDevice | null;
    history: DeviceHistoryItem[];
}

/* =========================================================
 * ACTIVITY
 * ========================================================= */

export interface Activity {

    id: string;

    type:
        | "PAYMENT"
        | "HOTSPOT_SUBSCRIPTION"
        | "PPPOE_SUBSCRIPTION"
        | "NETWORK_LOGIN"
        | "NETWORK_LOGOUT"
        | "ACCOUNT_CREATED"
        | "PASSWORD_CHANGED"
        | "ACCOUNT_SUSPENDED"
        | "ACCOUNT_ACTIVATED";

    title: string;

    description: string;

    status:
        | "success"
        | "pending"
        | "failed"
        | "warning"
        | "info"
        | "active";

    created_at: string;

    metadata: Record<string, any>;

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

    //devices: Device[];

    devices: DeviceProfile;

    sessions: RadiusSession[];

    activity: Activity[];

    activities: Activity[];



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