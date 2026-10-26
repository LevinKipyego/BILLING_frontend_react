export type ServiceType = 'PPPOE' | 'HOTSPOT';

export interface BulkRenewPayload {
  service_type: ServiceType;
  duration_minutes: number;
  window_hours: number;
  mikrotik_id?: number | null;
}

export interface BulkRenewResponse {
  status: 'success' | 'error';
  renewed_count: number;
  message: string;
  error?: string;
}