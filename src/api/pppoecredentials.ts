import { apiFetch } from "./client";

import type { PPPoECredential, PPPoECredentialCreate } from "../types/pppoecredentials";

// 🔹 List all credentials
export function listPPPoECredentials(): Promise<PPPoECredential[]> {
  return apiFetch("/pppoe/credentials/");
}

// 🔹 Get single credential
export function getPPPoECredential(id: number): Promise<PPPoECredential> {
  return apiFetch(`/pppoe/credentials/${id}/`);
}

// 🔹 Create credential
export function createPPPoECredential(
  data: PPPoECredentialCreate
): Promise<PPPoECredential> {
  return apiFetch("/pppoe/credentials/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 🔹 Update credential
export function updatePPPoECredential(
  id: number,
  data: Partial<PPPoECredentialCreate>
): Promise<PPPoECredential> {
  return apiFetch(`/pppoe/credentials/${id}/`, {
    method: "PUT", // or PATCH if partial
    body: JSON.stringify(data),
  });
}

// 🔹 Delete credential
export function deletePPPoECredential(id: number): Promise<void> {
  return apiFetch(`/pppoe/credentials/${id}/`, {
    method: "DELETE",
  });
}