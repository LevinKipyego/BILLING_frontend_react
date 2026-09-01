import {
    useCallback,
    useEffect,
    useState,
} from "react";

import { apiFetch } from "../../../../api/client";

import type {
    Customer,
    CreatePPPoEPayload,
    PPPoEProvisionResponse,
    Mikrotik,
    Plan,
} from "../types/types";

export default function useCustomers() {

    const [customers, setCustomers] =
        useState<Customer[]>([]);

    const [mikrotiks, setMikrotiks] =
        useState<Mikrotik[]>([]);

    const [plans, setPlans] =
        useState<Plan[]>([]);

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
                "/customers/"
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

    const loadProvisionData = useCallback(async () => {

        try {

            const [

                routers,

                plans,

            ] = await Promise.all([

                apiFetch("/devices/"),

                apiFetch("/plans/"),

            ]);

            setMikrotiks(routers);

            setPlans(plans);

        }

        catch (err: any) {

            setError(

                err.message ??

                "Failed to load provisioning data."

            );

        }

    }, []);

    const createPPPoE = useCallback(

        async (

            userId: number,

            payload: CreatePPPoEPayload,

        ): Promise<PPPoEProvisionResponse | null> => {

            setLoading(true);

            setError(null);

            try {

                const response =
                    await apiFetch(

                        `/customers/${userId}/pppoe/`,

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

            }

            catch (err: any) {

                setError(

                    err.message ??

                    "Failed to create PPPoE account."

                );

                return null;

            }

            finally {

                setLoading(false);

            }

        },

        [refresh]

    );

    useEffect(() => {

        refresh();

        loadProvisionData();

    }, [

        refresh,

        loadProvisionData,

    ]);

    return {

        customers,

        mikrotiks,

        plans,

        stats,

        loading,

        error,

        refresh,

        createPPPoE,

        lastProvision,

    };

}