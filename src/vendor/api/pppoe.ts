import { apiFetch } from "./client";

export interface CreatePPPoEPayload {

    mikrotik_id: string;

    plan_id: number;

    activate: boolean;

    push_radius: boolean;

}

export async function createPPPoEUser(

    userId: number,

    payload: CreatePPPoEPayload,

) {

    return apiFetch(

        `/api/pppoe/users/${userId}/create/`,

        {

            method: "POST",

            body: JSON.stringify(payload),

        }

    );

}