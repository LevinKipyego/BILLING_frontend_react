import type { MikrotikDevice } from "../types/device";
import { apiFetch } from "./client";

export function fetchMikrotiks(): Promise<MikrotikDevice[]> {
  return apiFetch("/devices/");
}

/* CREATE */
export function createMikrotik(data: Partial<MikrotikDevice>) {
  return apiFetch("/devices/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* UPDATE */
export function updateMikrotik(id: string, data: Partial<MikrotikDevice>) {
  return apiFetch(`/devices/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/* DELETE */
export function deleteMikrotik(id: string) {
  return apiFetch(`/devices/${id}/`, {
    method: "DELETE",
  });
}