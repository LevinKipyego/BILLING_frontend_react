// src/types/mikrotikConnection.ts

export interface MikrotikConnection {
  id: string;
  mikrotik: string; // MikrotikDevice ID
  host: string;
  port: number;
  username: string;
  hotspot_server?: string | null;
  use_ssl: boolean;
  enabled: boolean;
  created_at: string;
}

export interface MikrotikConnectionCreate {
  mikrotik: string;
  host: string;
  port: number;
  username: string;
  password: string;
  hotspot_server?: string;
  use_ssl?: boolean;
  enabled?: boolean;
}
