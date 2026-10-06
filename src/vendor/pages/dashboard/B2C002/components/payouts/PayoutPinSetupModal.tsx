
// src/components/payouts/PayoutPinSetupModal.tsx

import { useState } from "react";

import {
  setupPayoutPin,
} from "../../api/payoutApi";

import {
  OutlineButton,
  PayoutSurface,
  PrimaryButton,
} from "./PayOutSurface";

interface Props {
  onClose: () => void;
  onCompleted: () => void;
}

export default function PayoutPinSetupModal({
  onClose,
  onCompleted,
}: Props) {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");



  async function submit() {
    setError("");

    if (pin.length !== 6) {
      setError(
        "Enter a 6-digit payout PIN."
      );
      return;
    }

    if (confirmPin.length !== 6) {
      setError(
        "Confirm your 6-digit payout PIN."
      );
      return;
    }

    if (pin !== confirmPin) {
      setError(
        "PINs do not match."
      );
      return;
    }

    setLoading(true);

    try {
      await setupPayoutPin({
        pin,
        confirmPin,
      });

      setPin("");
      setConfirmPin("");

      onCompleted();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to configure payout PIN."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/35 p-2 sm:items-center sm:p-4">
      <PayoutSurface className="w-full max-w-sm">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2.5">
          <div>
            <h3 className="text-[14px] font-semibold text-slate-900">
              Set payout PIN
            </h3>

            <p className="mt-0.5 text-[10px] text-slate-500">
              Create a 6-digit PIN to protect vendor withdrawals.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-[18px] leading-none text-slate-400 hover:text-slate-700 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="space-y-2 p-3">

          <PinField
            label="New PIN"
            value={pin}
            onChange={setPin}
            autoFocus
          />

          <PinField
            label="Confirm PIN"
            value={confirmPin}
            onChange={setConfirmPin}
          />

          {error && (
            <div className="rounded-lg border border-red-100 bg-red-50 px-2.5 py-2 text-[11px] text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1">

            <OutlineButton
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </OutlineButton>

            <PrimaryButton
              onClick={submit}
              disabled={
                loading ||
                pin.length !== 6 ||
                confirmPin.length !== 6
              }
            >
              {loading
                ? "Setting..."
                : "Set PIN"}
            </PrimaryButton>

          </div>
        </div>

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
      <label className="mb-1 block text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400">
        {label}
      </label>

      <input
        autoFocus={autoFocus}
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
              .replace(/\D/g, "")
              .slice(0, 6)
          )
        }
        type="password"
        inputMode="numeric"
        autoComplete="new-password"
        maxLength={6}
        className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 font-mono text-[13px] tracking-[0.2em] outline-none focus:border-slate-400"
      />
    </div>
  );
}
