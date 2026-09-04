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

  shortcode?: string;

  // Hotspot Toggles
  allow_hotspot_password_recovery: boolean;
  allow_hotspot_purchase_receipts: boolean;

  // PPPoE / Static Customer Toggles
  allow_pppoe_welcome_sms: boolean;
  allow_payment_receipts: boolean;
  allow_expiry_reminders: boolean;

  // System & Admin Toggles
  allow_bulk_promotions: boolean;

  allow_renew_message: boolean;
  allow_DS_message: boolean;
  allow_cancel_message: boolean;

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

export type SMSStatus = 'PENDING' | 'SENT' | 'SUCCESS' | 'FAILED';

export type SystemSMSEvent = 
  | 'PAYMENT_SUCCESS' 
  | 'VOUCHER_ISSUED' 
  | 'TV_ACTIVATED' 
  | 'EXPIRY_WARNING';

export interface SMSMessage {
  id: number;
  vendor: number;
  provider: number;
  provider_name?: string;
  title: string;
  event: SystemSMSEvent;
  event_display?: string;
  content: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SMSMessageCreatePayload {
  provider: number;
  title: string;
  event: SystemSMSEvent;
  content: string;
  is_active: boolean;
}

// --- Analytics Types ---

export interface SMSAnalyticsSummary {
  total_requests: number;
  successful: number;
  failed: number;
  pending: number;
  success_rate_percentage: number;
  failure_rate_percentage: number;
}

export interface SMSFailureReason {
  reason: string;
  count: number;
}

export interface SMSDailyTrend {
  date: string;
  total: number;
  successful: number;
  failed: number;
}

export interface SMSProviderBreakdown {
  provider_name: string;
  total: number;
  successful: number;
  failed: number;
}

export interface SMSTopTemplate {
  template_title: string;
  event_type: string;
  total_sent: number;
}

export interface SMSAnalyticsCharts {
  daily_trends: SMSDailyTrend[];
  provider_breakdown: SMSProviderBreakdown[];
  top_templates: SMSTopTemplate[];
}

export interface SMSAnalyticsResponse {
  time_frame_days: number;
  summary: SMSAnalyticsSummary;
  failure_analysis: SMSFailureReason[];
  charts: SMSAnalyticsCharts;
}