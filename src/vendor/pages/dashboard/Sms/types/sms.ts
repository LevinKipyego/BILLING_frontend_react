export type SMSProviderType =
  | "BYTEWAVE"
  | "AFRICAS_TALKING"
  | "TALKSASA"
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

  // Hotspot Toggles
  allow_hotspot_password_recovery: boolean;
  allow_hotspot_purchase_receipts: boolean;

  // PPPoE / Static Customer Toggles
  allow_pppoe_welcome_sms: boolean;
  allow_payment_receipts: boolean;
  allow_expiry_reminders: boolean;

  // System & Admin Toggles
  allow_bulk_promotions: boolean;

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