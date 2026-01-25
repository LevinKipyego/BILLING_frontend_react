import { apiFetch } from "./client";
import type { NAS } from "../types/nas";

export function listNAS(): Promise<NAS[]> {
  return apiFetch("/nas/");
}

export function createNAS(data: Partial<NAS>): Promise<NAS> {
  return apiFetch("/nas/assign/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateNAS(id: number, data: Partial<NAS>): Promise<NAS> {
  return apiFetch(`/nas/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteNAS(id: number): Promise<void> {
  return apiFetch(`/nas/${id}/`, {
    method: "DELETE",
  });
}
