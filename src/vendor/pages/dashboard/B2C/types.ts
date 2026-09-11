export type BillingModel = 'DIRECT' | 'AGGREGATED';
export type PayoutStatus = 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';

export interface VendorSummary {
  id: string;
  name: string;
  billingModel: BillingModel;
  currentBalance: number;
  payoutThreshold: number;
  autoPayoutEnabled: boolean;
  payoutPhone: string;
}

export interface LedgerEntry {
  id: number;
  mpesaReceiptNumber: string;
  grossAmount: number;
  platformFee: number;
  netAmount: number;
  createdAt: string;
  clientPhone?: string;
}

export interface PayoutRecord {
  id: string;
  amount: number;
  phoneNumber: string;
  status: PayoutStatus;
  conversationId?: string;
  responseDescription?: string;
  createdAt: string;
}

export interface VendorDashboardData {
  summary: VendorSummary;
  ledger: LedgerEntry[];
  payouts: PayoutRecord[];
}