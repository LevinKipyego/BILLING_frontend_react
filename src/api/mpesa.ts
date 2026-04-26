// src/api/mpesa.ts
import type { MpesaC2BConfig } from "../types/mpesa";
import { apiFetch } from "./client";

export type MpesaConfigPayload = {
  business_shortcode: string;
  passkey: string;
  consumer_key: string;
  consumer_secret: string;
  callback_url: string;
  environment: "SANDBOX" | "PRODUCTION";
};

export async function getMpesaConfig() {
  return apiFetch("/stk_config/list/");
}

export async function createMpesaConfig(data: MpesaConfigPayload) {
  return apiFetch("/create/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateMpesaConfig(data: MpesaConfigPayload) {
  return apiFetch("/update/", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteMpesaConfig() {
  return apiFetch("/payments/mpesa/", {
    method: "DELETE",
  });
}



//mpesaC2B config


  
 export function getMpesaC2BConfig(): Promise<MpesaC2BConfig[]> {
  return apiFetch("/mpesaC2Bconfig/me/");
}

export function saveMpesaC2BConfig(data: any) {
  return apiFetch("/mpesaC2Bconfig/me/", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function testMpesaConnection() {
  return apiFetch("/mpesaC2Bconfig/test/", {
    method: "POST",
  });
}