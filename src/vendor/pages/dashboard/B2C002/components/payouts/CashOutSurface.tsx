// src/components/payouts/CashOutSurface.tsx

import { useRef, useState } from "react";

import {
  authorizePayout,
  createPayoutIdempotencyKey,
} from "../../api/payoutApi";

import {
  PayoutSurface,
  PrimaryButton,
  SurfaceHeader,
} from "./PayOutSurface";

import OtpModal from "./OtpModal";

interface Props {
  currentBalance: string;
  onCompleted?: () => void;
}

export default function CashOutSurface({
  currentBalance,
  onCompleted,
}: Props) {
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [otpOpen, setOtpOpen] = useState(false);
  const [authorizationId, setAuthorizationId] = useState("");
  const [otpPhone, setOtpPhone] = useState("");

  
  const idempotencyKey = useRef<string | null>(null);

  async function continuePayout() {
    setError("");

    const numericAmount = Number(amount);
    const numericBalance = Number(currentBalance);

    if (!amount || !Number.isFinite(numericAmount)) {
      setError("Enter a valid amount.");
      return;
    }

    if (numericAmount < 10) {
      setError("Minimum payout is KES 10.00.");
      return;
    }

    if (!Number.isFinite(numericBalance)) {
      setError("Unable to determine your available balance.");
      return;
    }

    if (numericAmount > numericBalance) {
      setError("Insufficient available balance.");
      return;
    }

    if (!/^\d{6}$/.test(pin)) {
      setError("Enter your 6-digit payout PIN.");
      return;
    }

    if (!idempotencyKey.current) {
      idempotencyKey.current = createPayoutIdempotencyKey();
    }

    setLoading(true);

    try {
      const result = await authorizePayout({
        amount: numericAmount.toFixed(2),
        pin,
      });

      setAuthorizationId(result.authorization_id);
      setOtpPhone(result.phone);

      setPin("");
      setOtpOpen(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to authorize payout."
      );
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setAmount("");
    setPin("");
    setAuthorizationId("");
    setOtpPhone("");
    setOtpOpen(false);

    // Generate a fresh idempotency key for the next payout.
    idempotencyKey.current = null;
  }

  const formattedBalance = Number(currentBalance || 0).toLocaleString(
    "en-KE",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );

  return (
    <>
      <PayoutSurface>
        <SurfaceHeader
          title="Cash out"
          description="Withdraw available vendor balance."
        />

        <div className="p-4 sm:p-5">
          {/* Available balance frame */}
          <div className="mb-3.5 flex items-center justify-between rounded-lg border border-slate-200 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/40 px-3 py-2">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Available balance
            </span>

            <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-mono">
              KES {formattedBalance}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px_auto] sm:items-end">
            {/* Amount Input */}
            <div>
              <label className="mb-1 block text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">
                Amount
              </label>

              <div className="flex h-9 items-center rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden focus-within:border-slate-400 dark:focus-within:border-gray-500 transition-colors">
                <span className="px-2.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 border-r border-slate-200 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/40 h-full flex items-center">
                  KES
                </span>

                <input
                  value={amount}
                  onChange={(e) =>
                    setAmount(
                      e.target.value.replace(/[^\d.]/g, "")
                    )
                  }
                  inputMode="decimal"
                  placeholder="0.00"
                  className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-[13px] font-medium text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-300 dark:placeholder:text-gray-600 font-mono"
                />
              </div>
            </div>

            {/* PIN Input */}
            <div>
              <label className="mb-1 block text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">
                PIN
              </label>

              <input
                value={pin}
                onChange={(e) =>
                  setPin(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6)
                  )
                }
                type="password"
                inputMode="numeric"
                maxLength={6}
                placeholder="6-digit PIN"
                className="h-9 w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-[13px] text-slate-900 dark:text-slate-100 tracking-[0.2em] outline-none focus:border-slate-400 dark:focus:border-gray-500 placeholder:tracking-normal placeholder:text-[11px] placeholder:text-slate-300 dark:placeholder:text-gray-600 transition-colors"
              />
            </div>

            {/* Continue Button */}
            <PrimaryButton
              disabled={loading}
              onClick={continuePayout}
              className="w-full sm:w-auto h-9"
            >
              {loading ? "Sending..." : "Continue"}
            </PrimaryButton>
          </div>

          {/* Error Message Box */}
          {error && (
            <div className="mt-3.5 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/50 px-3 py-2 text-[11px] text-red-700 dark:text-red-400 font-medium">
              {error}
            </div>
          )}

          {/* Footer Info */}
          <div className="mt-3.5 flex items-center justify-between text-[9px] text-slate-400 dark:text-slate-500">
            <span>OTP verification required</span>
            <span>Minimum KES 10.00</span>
          </div>
        </div>
      </PayoutSurface>

      {/* OTP Modal */}
      {otpOpen && (
        <OtpModal
          title="Verify payout"
          description="Enter the verification code sent to your registered payout phone."
          phone={otpPhone}
          authorizationId={authorizationId}
          idempotencyKey={idempotencyKey.current!}
          onClose={() => {
            setOtpOpen(false);
          }}
          onCompleted={() => {
            reset();
            onCompleted?.();
          }}
        />
      )}
    </>
  );
}