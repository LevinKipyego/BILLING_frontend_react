import { apiFetch } from "./client";
import type { PPPoESubscription } from "../types/subscriptions";


function fetchPppoeSubscriptions(): Promise<PPPoESubscription[]> {
    return apiFetch('/subscriptions/');
}

export default fetchPppoeSubscriptions;