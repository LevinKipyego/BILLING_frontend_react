import { apiFetch } from "./client";
import type { HotspotSubscription } from "../types/subscriptions";

//hotspot subscriptions
export function fetchHotspotSubscriptions(): Promise<HotspotSubscription[]> {
    return apiFetch('/hotspot/subscriptions/');
}

