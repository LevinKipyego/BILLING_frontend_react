// src/components/payouts/PayoutPanel.tsx

import { useEffect, useState } from "react";

import PayoutSecurity from "./components/payouts/PayoutSecurity";
import CashOutSurface from "./components/payouts/CashOutSurface";
import PayoutHistory from "./components/payouts/PayoutHistory";
import LedgerHistory from "./components/payouts/LedgerHistory";
import PinChangeModal from "./components/payouts/PinChangeModal";
import PayoutPinSetupModal from "./components/payouts/PayoutPinSetupModal";
import { PayoutSurface } from "./components/payouts/PayOutSurface";

import { getVendorPayoutSummary } from "./api/payoutApi";
import type { VendorPayoutSummary } from "./types/vendorPayout";


type PinMode = "setup" | "change" | null;

export default function PayoutPanel() {
  const [vendor, setVendor] = useState<VendorPayoutSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pinMode, setPinMode] = useState<PinMode>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  async function loadPayoutSummary() {
    setLoading(true);
    setError(null);

    try {
      const data = await getVendorPayoutSummary();
      console.log("Payout dashboard:", data);
      setVendor(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load payout information."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPayoutSummary();
  }, []);

  function refresh() {
    setRefreshKey((value) => value + 1);
    loadPayoutSummary();
  }

  /*
   * ---------------------------------------------------------
   * Loading state
   * ---------------------------------------------------------
   */

  if (loading && !vendor) {
    return (
      <div className="w-full px-2 py-2 sm:px-4 sm:py-4 lg:px-6">
        <div className="mx-auto w-full max-w-7xl space-y-3">
          <PayoutSurface>
            <div className="animate-pulse p-4 sm:p-5 bg-white dark:bg-gray-900 rounded-lg">
              <div className="h-3 w-28 rounded bg-slate-200 dark:bg-gray-800" />
              <div className="mt-2 h-2.5 w-52 rounded bg-slate-100 dark:bg-gray-800" />
              <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
                <div className="h-36 rounded-lg bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800" />
                <div className="h-36 rounded-lg bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800" />
              </div>
              <div className="mt-3 h-48 rounded-lg bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800" />
            </div>
          </PayoutSurface>
        </div>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * Error state
   * ---------------------------------------------------------
   */

  if (error && !vendor) {
    return (
      <div className="w-full px-2 py-2 sm:px-4 sm:py-4 lg:px-6">
        <div className="mx-auto w-full max-w-7xl">
          <PayoutSurface>
            <div className="flex flex-col items-center justify-center px-4 py-12 text-center bg-white dark:bg-gray-900 rounded-lg">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-400 font-semibold text-xs">
                !
              </div>

              <h2 className="mt-3 text-sm sm:text-base font-medium text-slate-900 dark:text-white">
                Unable to load payouts
              </h2>

              <p className="mt-1 max-w-sm text-[11px] text-slate-500 dark:text-slate-400">
                {error}
              </p>

              <button
                type="button"
                onClick={loadPayoutSummary}
                className="
                  mt-3.5 h-8 rounded-lg
                  border border-slate-200 dark:border-gray-700
                  bg-white dark:bg-gray-900 px-3
                  text-[11px] font-medium
                  text-slate-700 dark:text-slate-200
                  hover:bg-slate-50 dark:hover:bg-gray-800/40
                  transition-colors
                "
              >
                Try again
              </button>
            </div>
          </PayoutSurface>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return null;
  }

  const currentBalance = vendor.summary?.currentBalance ?? "0.00";

  return (
    <div className="w-full px-2 py-2 sm:px-4 sm:py-4 lg:px-6">
      <div className="mx-auto w-full max-w-7xl space-y-3">

        {/* ===================================================
            Page header
        =================================================== */}

        <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg px-4 sm:px-5 py-3.5 shadow-sm">
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-medium text-slate-900 dark:text-white">
              Vendor payouts
            </h1>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              Withdraw vendor earnings and manage payout security protocols.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-lg border border-slate-200 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/40 px-3 py-2">
              <p className="text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">
                Available balance
              </p>
              <p className="mt-0.5 text-[12px] font-semibold text-slate-900 dark:text-slate-100 font-mono">
                KES{" "}
                {Number(currentBalance).toLocaleString("en-KE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================
            Top surfaces
        =================================================== */}

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
          <CashOutSurface
            currentBalance={currentBalance}
            onCompleted={refresh}
          />

          <PayoutSecurity
            key={`security-${refreshKey}`}
            onChangePin={(mode) => {
              setPinMode(mode);
            }}
          />
        </div>

        {/* ===================================================
            History & Ledger (Vertical Column Layout)
        =================================================== */}

        <div className="flex flex-col gap-3">
          <PayoutHistory key={`history-${refreshKey}`} />
          <LedgerHistory key={`ledger-${refreshKey}`} />
        </div>

        {/* ===================================================
            Security information footer frame
        =================================================== */}

        <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 py-3.5 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg shadow-sm">
          <div>
            <p className="text-[11px] font-medium text-slate-800 dark:text-slate-200">
              Payout protection active
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              PIN and OTP validation are strictly required before any automated disbursements.
            </p>
          </div>

          <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
            Secured
          </span>
        </div>

      </div>

      {/* =====================================================
          FIRST-TIME PIN SETUP MODAL
      ===================================================== */}

      {pinMode === "setup" && (
        <PayoutPinSetupModal
          onClose={() => setPinMode(null)}
          onCompleted={() => {
            setPinMode(null);
            refresh();
          }}
        />
      )}

      {/* =====================================================
          EXISTING PIN CHANGE MODAL
      ===================================================== */}

      {pinMode === "change" && (
        <PinChangeModal
          phone={vendor.summary?.payoutPhone ?? ""}
          onClose={() => setPinMode(null)}
          onCompleted={() => {
            setPinMode(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}