type Status =
    | "active"
    | "inactive"
    | "suspended"
    | "expired"
    | "pending"
    | "disabled"
    | "online"
    | "offline";


export interface Customer {

    id: number;

    full_name: string;

    username?: string;

    email?: string;

    phone?: string;

    service_type: string;

    status: Status;

    router_name?: string;

    plan_name?: string;

}