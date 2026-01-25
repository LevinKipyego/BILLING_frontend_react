import { apiFetch } from "../api/client";

export interface MikrotikDevice {
  id?: string;
  identity_name: string;
  serial_number: string;
  api_ip: string;
  created_at?: string;
  mikrotik?: string;
}

export function listMikrotiks(): Promise<MikrotikDevice[]> {
  return apiFetch("/devices/");
}