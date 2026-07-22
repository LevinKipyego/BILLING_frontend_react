import { useCallback, useState } from "react";

import { executeCustomerAction } from "../api/customerActionApi";

import type { ApiResponse } from "../types/api";
import type {
    ActionDefinition,

} from "../types/actions";

export interface UseCustomerActionResult {

    loading: boolean;

    error: string | null;

    execute<TPayload, TResult = unknown>(

        action: ActionDefinition,

        customerId: number,

        payload: TPayload,

    ): Promise<ApiResponse<TResult>>;

    reset(): void;

}

export function useCustomerAction(): UseCustomerActionResult {

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const execute = useCallback(

        async <TPayload, TResult = unknown>(

            action: ActionDefinition,

            customerId: number,

            payload: TPayload,

        ): Promise<ApiResponse<TResult>> => {

            setLoading(true);

            setError(null);

            try {

                return await executeCustomerAction<TResult>(

                    action.endpoint,

                    customerId,

                    payload,

                );

            }

            catch (err) {

                const message =

                    err instanceof Error

                        ? err.message

                        : "Unable to execute action.";

                setError(message);

                throw err;

            }

            finally {

                setLoading(false);

            }

        },

        [],

    );

    const reset = useCallback(() => {

        setError(null);

    }, []);

    return {

        loading,

        error,

        execute,

        reset,

    };

}