
export interface Payment {

    id: number;

    amount: number;

    status: "success" | "failed" | "pending";

    payment_method: string;

    transaction_id: string;

    reference: string;

    created_at: string;

    service: "Hotspot" | "PPPoE";

    plan_name: string;

    plan: number | null;

}