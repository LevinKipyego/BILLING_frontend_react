import { apiFetch } from "./client";
import type { PPPoESubscription } from "../types/subscriptions";

// PPPoE subscriptions
function fetchPppoeSubscriptions(): Promise<PPPoESubscription[]> {
    return apiFetch('/pppoe/subscriptions/');
}

export default fetchPppoeSubscriptions;



