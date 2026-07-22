// =====================================================
// Generic API Error
// =====================================================

export interface ApiError {

    message: string;

    errors?: string[];

    status?: number;

}

// =====================================================
// Generic API Response
// =====================================================

export interface ApiResponse<T = Record<string, unknown>> {

    success: boolean;

    message: string;

    action: string;

    customer_id: number | null;

    payload: T;

    network: NetworkResult | null;

    warnings: string[];

    errors: string[];

}

// =====================================================
// Network Result
// =====================================================

export interface NetworkResult {

    success: boolean;

    message: string;

    synchronized: boolean;

    disconnected: boolean;

    retries: number;

    retry_after: number | null;

    warnings: string[];

    errors: string[];

    metadata: Record<string, unknown>;

}

// =====================================================
// Validation Error
// =====================================================

export interface ValidationError {

    field: string;

    message: string;

}