export type SMSProviderType =
  | "BYTEWAVE"
  | "AFRICAS_TALKING"
  | "TWILIO"
  | "GENERIC_HTTP";

export interface SMSProvider {
  id?: number;
  provider_type: SMSProviderType;
  provider_type_display?: string;
  sender_id: string;
  api_token?: string;
  api_url: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TestSMSPayload {
  recipient: string;
  message: string;
}

export interface TestSMSResponse {
  success: boolean;
  message: string;
  provider_id?: number;
  provider_type?: string;
  details?: Record<string, any>;
}