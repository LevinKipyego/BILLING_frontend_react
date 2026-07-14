export interface Customer {

    id: number;

    full_name: string;

    phone: string;

    username: string;

    rad_username: string;

    plan_name: string | null;

    router_name: string | null;

    router_ip: string | null;

    vendor_name: string | null;

    service_type: "HOTSPOT" | "PPPOE";

    active: boolean;

    session_status: string;

    subscription_active: boolean;

    expires_at: string | null;

    created_at: string;

}


export interface CreatePPPoEPayload {

    mikrotik_id: string;

    plan_id: number;

    activate: boolean;

    push_radius: boolean;

}


export interface PPPoEProvisionResponse {

    success: boolean;

    message: string;

    customer: {

        id: number;

        full_name: string;

        phone: string;

        username: string;

        service_type: string;

    };

    router: {

        id: string;

        name: string;

    };

    credential: {

        id: number;

        username: string;

        password: string;

        active: boolean;

    };

    subscription: {

        id: number;

        plan: {

            id: number;

            name: string;

        };

        active: boolean;

        start_at: string;

        end_at: string;

    };

}


export interface CustomerStats {

    total: number;

    hotspot: number;

    pppoe: number;

    active: number;

}




export interface Mikrotik {

    id: string;

    identity_name: string;

    api_ip: string;

}


export interface Plan {

    id: number;

    name: string;

    price: string;

    duration_minutes: number;

}