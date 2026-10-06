

import { v4 as uuidv4 } from "uuid";

import { apiFetch, apiPost } from "../../../../api/client";

import type {
  LedgerEntry,
  PinChangeAuthorizationResponse,
  PayoutAuthorizationResponse,
  PayoutRecord,
  PayoutRequestResponse,
  PayoutSecurity,
  VendorPayoutSummary,
} from "../types/vendorPayout";

export function createPayoutIdempotencyKey(): string {
  return uuidv4();
}

export function getPayoutSecurity() {
  return apiFetch<PayoutSecurity>(
    "/v1/vendor/payouts/config/"
  );
}

export function updatePayoutContact(data: {
  payoutPhone?: string;
  payoutEmail?: string;
}) {
  return apiFetch<PayoutSecurity>(
    "/v1/vendor/payouts/config/",
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

export function setupPayoutPin(data: {
  pin: string;
  confirmPin: string;
}) {
  return apiPost(
    "/v1/vendor/payouts/payout-security/pin/setup/",
    data
  );
}

export function startPinChange(data: {
  oldPin: string;
  newPin: string;
  confirmNewPin: string;
}) {
  return apiPost<PinChangeAuthorizationResponse>(
    "/v1/vendor/payouts/payout-security/pin/change/",
    data
  );
}

export function verifyPinChangeOTP(data: {
  authorizationId: string;
  otp: string;
}) {
  return apiPost(
    "/v1/vendor/payouts/payout-security/pin/change/verify/",
    data
  );
}

export function authorizePayout(data: {
  amount: string;
  pin: string;
}) {
  return apiPost<PayoutAuthorizationResponse>(
    "/v1/vendor/payouts/payout-security/authorize/",
    data
  );
}

export function verifyPayoutOTP(
  data: {
    authorizationId: string;
    otp: string;
  },
  idempotencyKey: string
) {
  return apiPost<PayoutRequestResponse>(
    "/v1/vendor/payouts/payout-security/verify-otp/",
    data,
    {
      idempotent: true,
      idempotencyKey,
    }
  );
}

export async function getPayoutHistory() {
  return apiFetch<{
    results: PayoutRecord[];
  }>("/v1/vendor/payouts/history/");
}

export async function getVendorLedger() {
  return apiFetch<{
    results: LedgerEntry[];
  }>("/v1/vendor/payouts/ledger/");
}

export function getVendorPayoutSummary() {
  return apiFetch<VendorPayoutSummary>(
    "/v1/vendor/payouts/dashboard/"
  );
}