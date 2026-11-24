import {
    useCallback,
    useEffect,
    useMemo,
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

function extractList<T>(data: unknown): T[] {
    if (Array.isArray(data)) {
        return data as T[];
    }
    if (
        data &&
        typeof data === "object" &&
        "results" in data &&
        Array.isArray((data as { results?: unknown }).results)
    ) {
        return (data as { results: T[] }).results;
    }
    return [];
}

function extractErrorMessage(err: unknown, fallback: string): string {
    if (!err) return fallback;
    if (typeof err === "string") return err.trim() || fallback;
    if (typeof err === "object") {
        const record = err as {
            message?: string;
            detail?: string;
            error?: string;
            response?: {
                data?: {
                    detail?: string;
                    message?: string;
                    error?: string;
                };
            };
        };
        const candidates = [
            record.response?.data?.detail,
            record.response?.data?.message,
            record.response?.data?.error,
            record.detail,
            record.error,
            record.message,
        ];
        for (const candidate of candidates) {
            if (typeof candidate === "string" && candidate.trim().length > 0) {
                return candidate.trim();
            }
        }
    }
    return fallback;
}

export default function useCustomers() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [mikrotiks, setMikrotiks] = useState<Mikrotik[]>([]);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastProvision, setLastProvision] =
        useState<PPPoEProvisionResponse | null>(null);

    const stats = useMemo(() => {
        const activeCustomers = customers.filter(
            (customer) => Boolean(customer.subscription_active),
        );

        return {
            total: activeCustomers.length,
            hotspot: activeCustomers.filter(
                (customer) => customer.service_type === "HOTSPOT",
            ).length,
            pppoe: activeCustomers.filter(
                (customer) => customer.service_type === "PPPOE",
            ).length,
            online: activeCustomers.filter(
                (customer) => customer.session_status === "ONLINE",
            ).length,
        };
    }, [customers]);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await apiFetch("/customers/");
            setCustomers(extractList<Customer>(data));
        } catch (err: unknown) {
            setError(extractErrorMessage(err, "Failed to load customers."));
        } finally {
            setLoading(false);
        }
    }, []);

    const loadProvisionData = useCallback(async () => {
        try {
            const [routers, planList] = await Promise.all([
                apiFetch("/devices/"),
                apiFetch("/plans/"),
            ]);

            setMikrotiks(extractList<Mikrotik>(routers));
            setPlans(extractList<Plan>(planList));
        } catch (err: unknown) {
            setError(
                extractErrorMessage(err, "Failed to load provisioning data."),
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
                const response = await apiFetch(`/customers/${userId}/pppoe/`, {
                    method: "POST",
                    body: JSON.stringify(payload),
                });

                setLastProvision(response as PPPoEProvisionResponse);
                await refresh();

                return response as PPPoEProvisionResponse;
            } catch (err: unknown) {
                setError(
                    extractErrorMessage(err, "Failed to create PPPoE account."),
                );
                return null;
            } finally {
                setLoading(false);
            }
        },
        [refresh],
    );

    // Optimistic / instant state helpers for table & action updates
    const removeCustomer = useCallback((customerId: number | string) => {
        setCustomers((prev) =>
            prev.filter((item) => String(item.id) !== String(customerId)),
        );
    }, []);

    const updateCustomer = useCallback(
        (customerId: number | string, patch: Partial<Customer>) => {
            setCustomers((prev) =>
                prev.map((item) =>
                    String(item.id) === String(customerId)
                        ? { ...item, ...patch }
                        : item,
                ),
            );
        },
        [],
    );

    const markCustomerRenewed = useCallback(
        (customerId: number | string, patch?: Partial<Customer>) => {
            setCustomers((prev) =>
                prev.map((item) =>
                    String(item.id) === String(customerId)
                        ? {
                              ...item,
                              subscription_active: true,
                              ...patch,
                          }
                        : item,
                ),
            );
        },
        [],
    );

    useEffect(() => {
        void refresh();
        void loadProvisionData();
    }, [refresh, loadProvisionData]);

    return {
        customers,
        mikrotiks,
        plans,
        stats,
        loading,
        error,
        refresh,
        loadProvisionData,
        createPPPoE,
        lastProvision,
        removeCustomer,
        updateCustomer,
        markCustomerRenewed,
    };
}