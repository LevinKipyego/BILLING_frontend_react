export type ServiceType = 'HOTSPOT' | 'PPPOE';

export interface Plan {
  id: number;
  name: string;
  [key: string]: any;
}

export interface MikrotikDevice {
  id: string;
  name: string;
  [key: string]: any;
}

export interface MigrationUser {
  full_name: string;
  email: string;
  phone: string;
  mac: string;
  username: string;
  password: string;
  location: string;
  active:boolean;
  expire_date: string;
}

export interface BulkMigrationPayload {
  mikrotik_id: string;
  plan_id: number;
  service_type: ServiceType;
  users: MigrationUser[];
}

export interface BulkMigrationResponse {
  status: string;
  migrated_count: number;
  message: string;
}