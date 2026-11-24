import { apiFetch } from "../../../../api/client";
import type { UserProfile } from "../components/types/types";

function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${encodeURIComponent(name)}=`));
    return match ? decodeURIComponent(match.split("=")[1]) : null;
}

function buildCsrfHeaders(): Record<string, string> {
    const csrfToken = getCookie("csrftoken");
    return csrfToken ? { "X-CSRFToken": csrfToken } : {};
}

export const fetchUserProfile = (
    id: number | string
): Promise<UserProfile> =>
    apiFetch(`/customer-profiles/${id}/profile/`);

export const updateCustomerProfile = (
    id: number | string,
    payload: Record<string, unknown>
): Promise<unknown> =>
    apiFetch(`/customers/${id}/`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...buildCsrfHeaders(),
        },
        body: JSON.stringify(payload),
    });

export const renewCustomerSubscription = (
    id: number | string,
    payload: {
        plan?: Record<string, unknown> | null;
        plan_id?: number | string | null;
        mode: string;
        [key: string]: unknown;
    }
): Promise<unknown> =>
    apiFetch(`/customers/${id}/renew/`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...buildCsrfHeaders(),
        },
        body: JSON.stringify(payload),
    });