
 export interface PPPoESubscription {
    id: number;

    user: number;          // FK → Users ID
    plan: number;          // FK → Plan ID
    credential: number;    // FK → PPPoECredential ID

    start_at: string;      // ISO datetime
    end_at: string;
    user_name: string;
    credential_password: string;
    plan_name:string;
    transaction_code: string;
    active: boolean;

    created_by_transaction: number | ""; // FK → Transaction ID (can be empty string if not set)    

    is_trial: boolean;
    created_at:string;
}
