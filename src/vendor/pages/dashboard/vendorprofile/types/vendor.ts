export type VendorSummary = {
  id: string;
  name: string;
  email: string;
  status: string;
  is_verified: boolean;
  is_onboarded: boolean;
  billing_model: "DIRECT" | "AGGREGATED";
  payout_phone?: string | null;
  payout_email?: string | null;
  current_balance: string;
};

export type VendorProfile = {
  vendor: VendorSummary;
  vendor_code: string;
  business_name?: string | null;
  phone_number?: string | null;
  support_phone?: string | null;
  support_email?: string | null;
  location?: string | null;
  address?: string | null;
  website?: string | null;
  primary_color: string;
  default_timezone: string;
  default_currency: string;
  default_mikrotik_dns?: string | null;
};

export type VendorProfileUpdatePayload = Partial<
  Omit<VendorProfile, "vendor" | "vendor_code">
>;