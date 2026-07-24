import { useCallback, useState } from "react";

import {

    getAvailablePlans,
    getCurrentSubscription,

} from "../api/subscriptionApi";

import type {

    AvailablePlan,
    CurrentSubscription,

} from "../types/subscription";

export interface UseRenewSubscriptionResult {

    subscription: CurrentSubscription | null;

    plans: AvailablePlan[];

    loading: boolean;

    error: Error | null;

    load(customerId: number): Promise<void>;

    reload(): Promise<void>;

}

export function useRenewSubscription(): UseRenewSubscriptionResult {

    const [

        subscription,

        setSubscription,

    ] = useState<CurrentSubscription | null>(null);

    const [

        plans,

        setPlans,

    ] = useState<AvailablePlan[]>([]);

    const [

        loading,

        setLoading,

    ] = useState(false);

    const [

        error,

        setError,

    ] = useState<Error | null>(null);

    const [

        customerId,

        setCustomerId,

    ] = useState<number | null>(null);

    const fetchData = useCallback(

    async (

        id: number,

    ) => {

        setLoading(true);

        setError(null);

        try {

                const [

                    subscriptionResponse,

                    plansResponse,

                ] = await Promise.all([

                    getCurrentSubscription(id),

                    getAvailablePlans(),

                ]);

                setSubscription(

                    subscriptionResponse.payload,

                );

                setPlans(

                    plansResponse,

                );

            }

            catch (err) {

                setError(

                    err instanceof Error

                        ? err

                        : new Error(

                            "Unable to load subscription.",

                        ),

                );

            }

            finally {

                setLoading(false);

            }

        },

        [],

    );

    const load = useCallback(

        async (

            id: number,

        ) => {

            setCustomerId(id);

            await fetchData(id);

        },

        [fetchData],

    );

    const reload = useCallback(

        async () => {

            if (

                customerId === null

            ) {

                return;

            }

            await fetchData(customerId);

        },

        [

            customerId,

            fetchData,

        ],

    );

    return {

        subscription,

        plans,

        loading,

        error,

        load,

        reload,

    };

}