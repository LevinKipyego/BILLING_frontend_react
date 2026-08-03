// src/types/mikrotikConnection.ts

export interface MikrotikConnection {
  id: string;
  mikrotik: string; 
  management_ip: string;
  port: number;
  username: string;
  hotspot_server?: string | null;
  use_ssl: boolean;
  enabled: boolean;
  created_at: string;
  hotspot_login_url?: string | null; 
}

export interface MikrotikConnectionCreate {
  mikrotik: string;
  management_ip: string;
  port: number;
  username: string;
  password: string;
  hotspot_server?: string;
  use_ssl?: boolean;
  enabled?: boolean;
  hotspot_login_url?: string;
}
