import { apiFetch } from "./client";

export function listMikrotikConnections() {
  return apiFetch("/devices/connections/");
}

export function createMikrotikConnection(data: any) {
  return apiFetch("/devices/connections/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateMikrotikConnection(id: string, data: any) {
  return apiFetch(`/devices/connections/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteMikrotikConnection(id: string) {
  return apiFetch(`/devices/connections/${id}/`, {
    method: "DELETE",
  });
}
