import { apiFetch } from "../../../../../api/client";

import type { ApiResponse } from "../types/api";

/* =====================================================
 * Execute Customer Action
 * ===================================================== */

export async function executeCustomerAction<
    TResult = unknown,
    TPayload = unknown,
>(

    endpoint: string,

    customerId: number,

    payload: TPayload,

): Promise<ApiResponse<TResult>> {

    return apiFetch<ApiResponse<TResult>>(
        `/customers/${customerId}/${endpoint}/`,
        {

            method: "POST",

            body: JSON.stringify(payload),

        },

    );

}