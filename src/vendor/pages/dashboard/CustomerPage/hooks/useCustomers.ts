import { useCallback, useEffect, useState } from "react";

import { apiFetch } from "../../../../api/client";

import type {
    Customer,
    CreatePPPoEPayload,
    PPPoEProvisionResponse,
} from "../types/types";


export default function useCustomers() {

    

    const [customers, setCustomers] =
        useState<Customer[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const [lastProvision, setLastProvision] =
        useState<PPPoEProvisionResponse | null>(null);

        const stats = {

        total: customers.length,

        hotspot: customers.filter(
            customer =>
                customer.service_type === "HOTSPOT"
        ).length,

        pppoe: customers.filter(
            customer =>
                customer.service_type === "PPPOE"
        ).length,

        active: customers.filter(
            customer =>
                customer.subscription_active
        ).length,

    };

    const refresh = useCallback(async () => {

        setLoading(true);

        setError(null);

        try {

            const data = await apiFetch(
                "/users/"
            );

            setCustomers(data);

        } catch (err: any) {

            setError(
                err.message ??
                "Failed to load customers."
            );

        } finally {

            setLoading(false);

        }

    }, []);


    const createPPPoE = useCallback(

        async (

            userId: number,

            payload: CreatePPPoEPayload,

        ) => {

            setLoading(true);

            setError(null);

            try {

                const response =
                    await apiFetch(

                        `/users/${userId}/pppoe/`,

                        {

                            method: "POST",

                            body: JSON.stringify(
                                payload
                            ),

                        }

                    );

                setLastProvision(
                    response
                );

                await refresh();

                return response;

            } catch (err: any) {

                setError(
                    err.message ??
                    "Failed to create PPPoE account."
                );

                throw err;

            } finally {

                setLoading(false);

            }

        },

        [refresh]

    );


    useEffect(() => {

        refresh();

    }, [refresh]);


    return {

        customers,

        stats,

        loading,

        error,

        refresh,

        createPPPoE,

        lastProvision,

    };

}