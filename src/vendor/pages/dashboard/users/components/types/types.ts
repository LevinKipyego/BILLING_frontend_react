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


export interface mikrotik{

    id: string;
    identity_name?: string;
    api_ip: string;
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

    mikrotik? :mikrotik;

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

export interface HotspotAccount {
    credential: HotspotCredential | null;
    current_subscription: HotspotSubscription | null;
    connection: ConnectionStatus | null;
}

export interface HotspotSummary {
    total_accounts: number;
    active_accounts: number;
    inactive_accounts: number;
}

export interface HotspotProfile {
    summary: HotspotSummary;
    accounts: HotspotAccount[];
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

    mikrotik?: mikrotik;

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



export interface PPPoEAccount {
    credential: PPPoECredential | null;
    current_subscription: PPPoESubscription | null;
    connection: ConnectionStatus | null;
}

export interface PPPoESummary {
    total_accounts: number;
    active_accounts: number;
    inactive_accounts: number;
}

export interface PPPoEProfile {
    summary: PPPoESummary;
    accounts: PPPoEAccount[];
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


export interface l_router{
                id: string,
                name: string,
                ip: string
}

export interface DeviceSummary {

    known_devices: number;

    online_devices: number;

    last_seen: string | null;

    last_router: l_router | null;

}


export interface CurrentDevice {

    mac_address: string;

    username: string;

    service: "HOTSPOT" | "PPPOE" | "UNKNOWN";

    device_type:
        | "PHONE"
        | "LAPTOP"
        | "TABLET"
        | "ROUTER"
        | "UNKNOWN";

    ip_address: string | null;

    router: {
        id: string | null;
        name: string;
        ip: string;
        vendor: {
            id: string;
            name: string;
        } | null;
    };

    connected_since: string;

    last_seen: string;

    upload_bytes: number;

    download_bytes: number;
}

export interface DeviceHistory{

    mac_address: string;

    username: string;

    service: "HOTSPOT" | "PPPOE" | "UNKNOWN";

    device_type:
        | "PHONE"
        | "LAPTOP"
        | "TABLET"
        | "ROUTER"
        | "UNKNOWN";

    router: {

        id: string | null;

        name: string;

        ip: string;

        vendor: {

            id: string;

            name: string;

        } | null;

    };

    last_ip: string | null;

    first_seen: string | null;

    last_seen: string | null;

    sessions: number;

    upload_bytes: number;

    download_bytes: number;

    online: boolean;

}

export interface DeviceProfile {
    summary: DeviceSummary;
    current: CurrentDevice[];
    history: DeviceHistory[];
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

    hotspot: HotspotProfile;

    hotspot_history: HotspotSubscription[];

    pppoe: PPPoEProfile;

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