import { apiFetch } from "./client";

export function listMikrotikConnections() {
  return apiFetch("/mikrotik/connections/");
}

export function createMikrotikConnection(data: any) {
  return apiFetch("/mikrotik/connections/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateMikrotikConnection(id: string, data: any) {
  return apiFetch(`/mikrotik/connections/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteMikrotikConnection(id: string) {
  return apiFetch(`/mikrotik/connections/${id}/`, {
    method: "DELETE",
  });
}
