import { useState } from "react";

import { renewSubscription } from "../api/subscriptionApi";

import type {
    RenewSubscriptionPayload,
    RenewSubscriptionResult,
} from "../types/subscription";

import type {
    ApiResponse,
} from "../types/api";

export function useRenewAction() {

    const [

        submitting,

        setSubmitting,

    ] = useState(false);

    const [

        error,

        setError,

    ] = useState<string | null>(null);

    async function submit(

        customerId: number,

        payload: RenewSubscriptionPayload,

    ): Promise<ApiResponse<RenewSubscriptionResult>> {

        setSubmitting(true);

        setError(null);

        try {

            return await renewSubscription(

                customerId,

                payload,

            );

        }

        catch (err) {

            setError(

                err instanceof Error

                    ? err.message

                    : "Renewal failed.",

            );

            throw err;

        }

        finally {

            setSubmitting(false);

        }

    }

    return {

        submitting,

        error,

        submit,

    };

}