// types/mpesa.ts

export interface MpesaC2BConfig {
  vendor: string;

  shortcode: string;
  business_name: string;

  c2b_type: "PayBill" | "BuyGoods";

  validation_url: string;
  confirmation_url: string;

  is_live: boolean;
  enabled: boolean;
  environment: "SANDBOX" | "PRODUCTION";

  created_at: string;
  updated_at: string;
}