import { apiFetch } from "../../../../api/client";
import type { VendorProfile, VendorProfileUpdatePayload } from "../types/vendor";

export async function getVendorProfile(): Promise<VendorProfile> {
  return await apiFetch("/vendors/profile/");
}

export async function updateVendorProfile(
  payload: VendorProfileUpdatePayload
): Promise<{ message: string; data: VendorProfile }> {
  return await apiFetch("/vendors/profile/", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}