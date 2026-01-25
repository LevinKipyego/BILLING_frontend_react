// src/api/mpesa.ts
import { apiFetch } from "./client";

export type MpesaConfigPayload = {
  business_shortcode: string;
  passkey: string;
  consumer_key: string;
  consumer_secret: string;
  callback_url: string;
  environment: "sandbox" | "production";
};

export async function getMpesaConfig() {
  return apiFetch("");
}

export async function createMpesaConfig(data: MpesaConfigPayload) {
  return apiFetch("/create/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateMpesaConfig(data: MpesaConfigPayload) {
  return apiFetch("/payments/mpesa/", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteMpesaConfig() {
  return apiFetch("/payments/mpesa/", {
    method: "DELETE",
  });
}