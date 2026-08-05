import type { SMSProvider, TestSMSPayload, TestSMSResponse } from "../types/sms";
import { apiFetch } from "../../../../api/client";

/* READ ALL */
export function fetchSMSProviders(): Promise<SMSProvider[]> {
  return apiFetch("/sms/v1/sms-providers/");
}

/* READ SINGLE */
export function fetchSMSProvider(id: number): Promise<SMSProvider> {
  return apiFetch(`/sms/v1/sms-providers/${id}/`);
}

/* CREATE */
export function createSMSProvider(data: Partial<SMSProvider>): Promise<SMSProvider> {
  return apiFetch("/sms/v1/sms-providers/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* UPDATE (PATCH/PUT) */
export function updateSMSProvider(
  id: number,
  data: Partial<SMSProvider>
): Promise<SMSProvider> {
  return apiFetch(`/sms/v1/sms-providers/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/* DELETE */
export function deleteSMSProvider(id: number): Promise<void> {
  return apiFetch(`/sms/v1/sms-providers/${id}/`, {
    method: "DELETE",
  });
}

/* SET ACTIVE GATEWAY */
export function toggleActiveSMSProvider(id: number): Promise<{ status: string; message: string }> {
  return apiFetch(`/sms/v1/sms-providers/${id}/toggle-active/`, {
    method: "POST",
  });
}

/* TEST SMS DISPATCH */
export function testSMSProvider(
  data: TestSMSPayload,
  id?: number | string
): Promise<TestSMSResponse> {
  const url = id 
    ? `/sms/v1/sms-providers/${id}/send-test/`
    : `/sms/v1/sms-providers/send-test/`;

  return apiFetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  });
}