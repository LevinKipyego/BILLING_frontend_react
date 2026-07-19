import { useCallback, useState } from "react";

import {
    renewSubscription,
    previewRenewal,
    suspendSubscription,
    resumeSubscription,
    cancelSubscription,
    getCurrentSubscription,
} from "../api/subscriptionApi";

import type {
    CurrentSubscription,
    RenewSubscriptionPayload,
    RenewSubscriptionResponse,
} from "../types/subscription";

export default function useSubscription() {

    const [subscription, setSubscription] =
        useState<CurrentSubscription | null>(null);

    const [renewalPreview, setRenewalPreview] =
    useState<RenewSubscriptionResponse | null>(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const load = useCallback(
        async (customerId: number) => {

            setLoading(true);
            setError(null);

            try {

                const result =
                    await getCurrentSubscription(
                        customerId,
                    );

                setSubscription(result);

                return result;

            } catch (err: any) {

                setError(
                    err.message ??
                    "Unable to load subscription.",
                );

                throw err;

            } finally {

                setLoading(false);

            }

        },
        [],
    );

    const previewRenewalData = useCallback(
        async (
            customerId: number,
            payload: RenewSubscriptionPayload,
        ) => {

            setLoading(true);
            setError(null);

            try {

                const result =
                    await previewRenewal(
                        customerId,
                        payload,
                    );

                setRenewalPreview(result);

                return result;

            } catch (err: any) {

                setError(
                    err.message ??
                    "Unable to preview renewal.",
                );

                throw err;

            } finally {

                setLoading(false);

            }

        },
        [],
    );

    const renew = useCallback(
        async (
            customerId: number,
            payload: RenewSubscriptionPayload,
        ) => {

            setLoading(true);
            setError(null);

            try {

                return await renewSubscription(
                    customerId,
                    payload,
                );

            } catch (err: any) {

                setError(
                    err.message ??
                    "Unable to renew subscription.",
                );

                throw err;

            } finally {

                setLoading(false);

            }

        },
        [],
    );

    const suspend = useCallback(
        async (customerId: number) => {

            await suspendSubscription(customerId);

        },
        [],
    );

    const resume = useCallback(
        async (customerId: number) => {

            await resumeSubscription(customerId);

        },
        [],
    );

    const cancel = useCallback(
        async (customerId: number) => {

            await cancelSubscription(customerId);

        },
        [],
    );

    return {

    subscription,

    renewalPreview,

    previewRenewalData,

    renew,

    suspend,

    resume,

    cancel,

    load,

    loading,

    error,

};
}