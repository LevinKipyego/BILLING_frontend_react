import { apiFetch } from "../../../../api/client";

import type {
    Customer,
    CreatePPPoEPayload,
    PPPoEProvisionResponse,
} from "../types/types";

/* ===========================================
   CUSTOMER PROFILE
=========================================== */

export async function listCustomers(): Promise<Customer[]> {

    return apiFetch("/customers/");

}

export async function getCustomer(

    id: number,

): Promise<Customer> {

    return apiFetch(

        `/customers/${id}/`

    );

}

export async function createCustomer(

    payload: any,

): Promise<Customer> {

    return apiFetch(

        "/customers/create/",

        {

            method: "POST",

            body: JSON.stringify(payload),

        }

    );

}

export async function updateCustomer(

    id: number,

    payload: Partial<Customer>,

): Promise<Customer> {

    return apiFetch(

        `/customers/${id}/`,

        {

            method: "PATCH",

            body: JSON.stringify(payload),

        }

    );

}

export async function deleteCustomer(

    id: number,

): Promise<void> {

    await apiFetch(

        `/customers/${id}/`,

        {

            method: "DELETE",

        }

    );

}

/* ===========================================
   CUSTOMER STATUS
=========================================== */

export async function suspendCustomer(

    id: number,

): Promise<void> {

    await apiFetch(

        `/customers/${id}/suspend/`,

        {

            method: "POST",

        }

    );

}

export async function activateCustomer(

    id: number,

): Promise<void> {

    await apiFetch(

        `/customers/${id}/activate/`,

        {

            method: "POST",

        }

    );

}

export async function deactivateCustomer(

    id: number,

): Promise<void> {

    await apiFetch(

        `/customers/${id}/deactivate/`,

        {

            method: "POST",

        }

    );

}

/* ===========================================
   PPPoE
=========================================== */

export async function createPPPoE(

    userId: number,

    payload: CreatePPPoEPayload,

): Promise<PPPoEProvisionResponse> {

    return apiFetch(

        `/users/${userId}/pppoe/`,

        {

            method: "POST",

            body: JSON.stringify(payload),

        }

    );

}