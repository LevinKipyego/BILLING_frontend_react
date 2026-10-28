import {
  getMpesaConfig,
  createMpesaConfig,
  updateMpesaConfig,
  deleteMpesaConfig,
  testMpesaConfig,
} from "../../../../api/mpesa";
import type { MpesaConfigPayload } from "../../../../api/mpesa";
import { apiFetch } from "../../../../api/client";
import type { StkTestPayload } from "../types/mpesa";

export async function fetchMpesaConfig() {
  return getMpesaConfig();
}

export async function createGateway(payload: MpesaConfigPayload) {
  return createMpesaConfig(payload);
}

export async function updateGateway(payload: MpesaConfigPayload) {
  return updateMpesaConfig(payload);
}

export async function deleteGateway() {
  return deleteMpesaConfig();
}

export async function runStkTest(payload: StkTestPayload) {
  return testMpesaConfig(payload as never);
}

export async function registerC2bUrls() {
  return apiFetch("/v1/c2b/register_url/", { method: "POST" });
}
