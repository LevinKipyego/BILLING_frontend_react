// src/components/payouts/OtpModal.tsx

import { useEffect, useState } from "react";

import {
  verifyPayoutOTP,
} from "../../api/payoutApi";

import {
  PrimaryButton,
  OutlineButton,
  PayoutSurface,
} from "./PayOutSurface";

import { maskPhone } from "../../utils/payoutFormat";

interface Props {
  title: string;
  description: string;
  phone: string;
  authorizationId: string;
  idempotencyKey: string;
  onClose: () => void;
  onCompleted: () => void;
}

export default function OtpModal({
  title,
  description,
  phone,
  authorizationId,
  idempotencyKey,
  onClose,
  onCompleted,
}: Props) {
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [seconds, setSeconds] = useState(300);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = window.setInterval(() => {
      setSeconds((value) =>
        Math.max(value - 1, 0)
      );
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [seconds]);

  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");

  const remainingSeconds = (seconds % 60)
    .toString()
    .padStart(2, "0");

  async function verify() {
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit verification code.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await verifyPayoutOTP(
        {
          authorizationId,
          otp,
        },
        idempotencyKey
      );

      onCompleted();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Verification failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 backdrop-blur-xs p-2 sm:items-center sm:p-4">
      <PayoutSurface className="w-full max-w-sm">
        {/* =================================================
            HEADER
        ================================================== */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-gray-800 px-4 sm:px-5 py-3.5">
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-medium text-slate-900 dark:text-white">
              {title}
            </h3>

            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
            className="ml-3 shrink-0 rounded-md p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-50 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* =================================================
            BODY CONTENT
        ================================================== */}
        <div className="p-4 sm:p-5 space-y-3.5">
          {/* Phone Badge */}
          <div className="rounded-lg border border-slate-200 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/40 px-3 py-2">
            <p className="text-[9px] uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500 font-medium">
              Sent to
            </p>

            <p className="mt-0.5 font-mono text-[12px] font-medium text-slate-800 dark:text-slate-200">
              {maskPhone(phone)}
            </p>
          </div>

          {/* OTP Input */}
          <div>
            <label className="mb-1 block text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">
              Verification code
            </label>

            <input
              autoFocus
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6)
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  verify();
                }
              }}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              className="h-11 w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-center font-mono text-[20px] text-slate-900 dark:text-slate-100 tracking-[0.35em] outline-none focus:border-slate-400 dark:focus:border-gray-500 transition-colors placeholder:tracking-normal placeholder:text-slate-300 dark:placeholder:text-gray-600"
              placeholder="••••••"
            />
          </div>

          {/* Timer & Expiry */}
          <div className="flex justify-between text-[9px] text-slate-400 dark:text-slate-500 font-medium">
            <span>Verification code expires</span>

            <span
              className={
                seconds < 60
                  ? "font-semibold text-red-600 dark:text-red-400"
                  : "font-mono"
              }
            >
              {minutes}:{remainingSeconds}
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/50 px-3 py-2 text-[11px] text-red-700 dark:text-red-400 font-medium">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <OutlineButton
              onClick={onClose}
              disabled={loading}
              className="w-full"
            >
              Cancel
            </OutlineButton>

            <PrimaryButton
              onClick={verify}
              disabled={
                loading ||
                otp.length !== 6 ||
                seconds <= 0
              }
              className="w-full"
            >
              {loading
                ? "Verifying..."
                : "Verify & Cash Out"}
            </PrimaryButton>
          </div>
        </div>
      </PayoutSurface>
    </div>
  );
}