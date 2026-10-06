// src/types/payout.ts

export type PayoutStatus =
  | "PENDING"
  | "PROCESSING"
  | "SUBMITTED"
  | "SUCCESS"
  | "FAILED";


export interface VendorPayoutSummary {
  summary: {
    id: string;
    name: string;
    billingModel: string;
    currentBalance: string;
    payoutThreshold: string;
    autoPayoutEnabled: boolean;
    payoutPhone: string | null;
    payoutEmail: string | null;
  };

  payoutConfig?: {
    payoutPhone: string | null;
    payoutEmail: string | null;
    payoutThreshold: string;
    autoPayoutEnabled: boolean;
    billingModel: string;
  };

  payoutSecurity?: {
    pinConfigured: boolean;
    pinEnabled: boolean;
  };

  ledger?: {
    results: unknown[];
  };

  payouts?: {
    results: unknown[];
  };
}

export interface PayoutSecurity {
  pinConfigured: boolean;
  pinEnabled: boolean;
  payoutPhone: string | null;
  payoutEmail: string | null;
}

export interface PayoutAuthorizationResponse {
  message: string;
  authorization_id: string;
  expires_at: string;
  otp_expires_at: string;
  phone: string;
}

export interface PinChangeAuthorizationResponse {
  message: string;
  authorization_id: string;
  phone: string;
  otp_expires_at: string;
}

export interface PayoutRecord {
  id: string;
  amount: string;
  phoneNumber: string;
  status: PayoutStatus | string;
  mpesaReceiptNumber: string | null;
  responseDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PayoutRequestResponse {
  message: string;
  payout: PayoutRecord;
}

export interface LedgerEntry {
  id: string;
  mpesaReceiptNumber: string | null;
  grossAmount: string;
  platformFee: string;
  netAmount: string;
  createdAt: string;
}