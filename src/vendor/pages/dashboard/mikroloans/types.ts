export interface LoanPackage {
    id?: number;
    name: string | null;
    description?: string | null;
    service_type: 'HOTSPOT' | 'PPPOE' | 'IPOE';
    billing_model: 'PREPAID' | 'POSTPAID';
    price: number | null;
    duration_minutes?: number | null;
    mikrotik_profile?: string | null;
    rate_limit?: string | null;
    max_download?: string | null;
    max_upload?: string | null;
    vendor?: number | null;
    mikrotik?: number | string | null;
    service_fee: number;
    is_loan_plan: boolean;
    active: boolean;
    is_featured: boolean;
    deleted: boolean;
    created_at?: string;
    updated_at?: string;
    is_trial: boolean;
}

export interface MicroLoan {
    id: number;
    user_phone: string;
    package_name: string;
    principal_amount: number;
    service_fee: number;
    total_amount_due: number;
    amount_repaid: number;
    remaining_balance: number;
    status: 'PENDING' | 'PAID' | 'PARTIALLY_PAID' | 'DEFAULTED';
    borrowed_at: string;
}

export interface LoanAnalytics {
    total_disbursed: number;
    total_repaid: number;
    total_outstanding: number;
    active_loans_count: number;
    defaulted_loans_count: number;
    paid_loans_count: number;
}