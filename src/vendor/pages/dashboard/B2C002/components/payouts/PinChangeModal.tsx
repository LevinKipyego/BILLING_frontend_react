// src/components/payouts/PinChangeModal.tsx

import { useState } from "react";

import {
  startPinChange,
  verifyPinChangeOTP,
} from "../../api/payoutApi";

import {
  OutlineButton,
  PayoutSurface,
  PrimaryButton,
} from "./PayOutSurface";

import { maskPhone } from "../../utils/payoutFormat";

interface Props {
  phone: string;
  onClose: () => void;
  onCompleted: () => void;
}

export default function PinChangeModal({
  phone,
  onClose,
  onCompleted,
}: Props) {
  const [step, setStep] = useState<
    "PIN" | "OTP"
  >("PIN");

  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] =
    useState("");

  const [authorizationId, setAuthorizationId] =
    useState("");

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  

  function reset() {
    setStep("PIN");
    setOldPin("");
    setNewPin("");
    setConfirmPin("");
    setAuthorizationId("");
    setOtp("");
    setError("");
    setLoading(false);
  }

  function close() {
    if (loading) return;

    reset();
    onClose();
  }

  async function startChange() {
    setError("");

    if (oldPin.length !== 6) {
      setError(
        "Enter your current 6-digit PIN."
      );
      return;
    }

    if (newPin.length !== 6) {
      setError(
        "Enter a new 6-digit PIN."
      );
      return;
    }

    if (confirmPin.length !== 6) {
      setError(
        "Confirm your new 6-digit PIN."
      );
      return;
    }

    if (newPin !== confirmPin) {
      setError(
        "New PINs do not match."
      );
      return;
    }

    if (oldPin === newPin) {
      setError(
        "New PIN must be different from the old PIN."
      );
      return;
    }

    setLoading(true);

    try {
      const result = await startPinChange({
        oldPin,
        newPin,
        confirmNewPin: confirmPin,
      });

      setAuthorizationId(
        result.authorization_id
      );

      setStep("OTP");

      // Do not keep PIN values in component state
      // once the authorization has been created.
      setOldPin("");
      setNewPin("");
      setConfirmPin("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to start PIN change."
      );
    } finally {
      setLoading(false);
    }
  }

  async function verify() {
    setError("");

    if (!authorizationId) {
      setError(
        "PIN change authorization is missing."
      );
      return;
    }

    if (otp.length !== 6) {
      setError(
        "Enter the 6-digit verification code."
      );
      return;
    }

    setLoading(true);

    try {
      await verifyPinChangeOTP({
        authorizationId,
        otp,
      });

      reset();
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
              {step === "PIN"
                ? "Change payout PIN"
                : "Verify PIN change"}
            </h3>

            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              {step === "PIN"
                ? "Enter your current PIN and choose a new one."
                : phone
                ? `Verification code sent to ${maskPhone(
                    phone
                  )}`
                : "Enter the verification code sent to your payout phone."}
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            disabled={loading}
            aria-label="Close"
            className="ml-3 shrink-0 rounded-md p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-50 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* =================================================
            CHANGE PIN
        ================================================== */}

        {step === "PIN" ? (
          <div className="space-y-3 p-4 sm:p-5">
            <PinField
              label="Current PIN"
              value={oldPin}
              onChange={setOldPin}
              autoFocus
            />

            <PinField
              label="New PIN"
              value={newPin}
              onChange={setNewPin}
            />

            <PinField
              label="Confirm new PIN"
              value={confirmPin}
              onChange={setConfirmPin}
            />

            {error && (
              <ErrorMessage text={error} />
            )}

            <div className="grid grid-cols-2 gap-2 pt-1">
              <OutlineButton
                onClick={close}
                disabled={loading}
                className="w-full"
              >
                Cancel
              </OutlineButton>

              <PrimaryButton
                onClick={startChange}
                disabled={loading}
                className="w-full"
              >
                {loading
                  ? "Sending..."
                  : "Continue"}
              </PrimaryButton>
            </div>
          </div>
        ) : (
          /* =================================================
             OTP VERIFICATION
          ================================================== */

          <div className="p-4 sm:p-5">
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
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              className="h-11 w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-center font-mono text-[20px] text-slate-900 dark:text-slate-100 tracking-[0.35em] outline-none focus:border-slate-400 dark:focus:border-gray-500 transition-colors placeholder:tracking-normal placeholder:text-slate-300 dark:placeholder:text-gray-600"
              placeholder="••••••"
            />

            {error && (
              <div className="mt-3">
                <ErrorMessage text={error} />
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-2">
              <OutlineButton
                onClick={() => {
                  if (!loading) {
                    setStep("PIN");
                    setOtp("");
                    setError("");
                  }
                }}
                disabled={loading}
                className="w-full"
              >
                Back
              </OutlineButton>

              <PrimaryButton
                onClick={verify}
                disabled={
                  loading ||
                  otp.length !== 6 ||
                  !authorizationId
                }
                className="w-full"
              >
                {loading
                  ? "Verifying..."
                  : "Change PIN"}
              </PrimaryButton>
            </div>
          </div>
        )}
      </PayoutSurface>
    </div>
  );
}

function PinField({
  label,
  value,
  onChange,
  autoFocus = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">
        {label}
      </label>

      <input
        autoFocus={autoFocus}
        value={value}
        onChange={(e) =>
          onChange(
            sanitizePin(e.target.value)
          )
        }
        type="password"
        inputMode="numeric"
        autoComplete="off"
        maxLength={6}
        placeholder="••••••"
        className="h-9 w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 font-mono text-[13px] text-slate-900 dark:text-slate-100 tracking-[0.2em] outline-none focus:border-slate-400 dark:focus:border-gray-500 transition-colors placeholder:tracking-normal placeholder:text-[11px] placeholder:text-slate-300 dark:placeholder:text-gray-600"
      />
    </div>
  );
}

function sanitizePin(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 6);
}

function ErrorMessage({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/50 px-3 py-2 text-[11px] text-red-700 dark:text-red-400 font-medium">
      {text}
    </div>
  );
}