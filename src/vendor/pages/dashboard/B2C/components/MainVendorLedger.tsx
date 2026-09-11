import React, { useState, useEffect } from "react";
import { apiGet, apiPost } from "../../../../api/client"; 
import type { 
  VendorDashboardData, 
  LedgerEntry, 
  PayoutRecord, 
  PayoutStatus 
} from "../types";
import VendorPayoutConfig from "./VendorPayoutConfig";
import { 
  ArrowPathIcon, 
  ExclamationCircleIcon, 
  CheckCircleIcon,
  BanknotesIcon,
  PhoneIcon,
  CreditCardIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

export const VendorDashboard: React.FC = () => {
  const [data, setData] = useState<VendorDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Tab State
  const [activeTab, setActiveTab] = useState<"ledger" | "payouts" | "config">("ledger");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [payoutAmount, setPayoutAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [payoutError, setPayoutError] = useState<string | null>(null);
  const [payoutSuccess, setPayoutSuccess] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const responseData = await apiGet<VendorDashboardData>("/v1/vendor/payouts/dashboard/");
      setData(responseData);
    } catch (err: any) {
      console.error("Failed to load vendor dashboard data:", err);
      setError(err.message || "Failed to fetch vendor data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Normalizes phone numbers (e.g. 0712345678 -> 254712345678)
  const normalizePhoneNumber = (phone: string): string => {
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = "254" + cleaned.slice(1);
    } else if (cleaned.startsWith("7") || cleaned.startsWith("1")) {
      if (cleaned.length === 9) {
        cleaned = "254" + cleaned;
      }
    }
    return cleaned;
  };

  // Handle Manual Payout Request
  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutError(null);
    setPayoutSuccess(null);

    const amount = parseFloat(payoutAmount);
    if (isNaN(amount) || amount <= 0) {
      setPayoutError("Please enter a valid payout amount.");
      return;
    }

    if (data && amount > data.summary.currentBalance) {
      setPayoutError("Requested amount exceeds your current working balance.");
      return;
    }

    const formattedPhone = normalizePhoneNumber(data?.summary.payoutPhone || "");
    if (!/^254[71]\d{8}$/.test(formattedPhone)) {
      setPayoutError("Please configure a valid Safaricom payout phone number first.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await apiPost<{ message: string; payout: PayoutRecord }>(
        "/v1/vendor/payouts/request/",
        { amount }
      );

      setPayoutSuccess(response.message || "Payout request initiated successfully!");
      setPayoutAmount("");
      
      // Refresh dashboard balances and payout records
      await fetchDashboardData();

      setTimeout(() => {
        setIsModalOpen(false);
        setPayoutSuccess(null);
      }, 1500);

    } catch (err: any) {
      console.error("Payout request failed:", err);
      setPayoutError(err.message || "Failed to trigger payout. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base">
        <ArrowPathIcon className="w-8 h-8 animate-spin mb-3 text-emerald-600 dark:text-emerald-400" />
        Loading financial metrics...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto my-6 p-4 sm:p-6 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-2xl text-red-700 dark:text-red-300">
        <div className="flex items-center gap-2.5 font-bold text-base sm:text-lg mb-1">
          <ExclamationCircleIcon className="w-6 h-6 shrink-0" />
          <span>Error Loading Dashboard</span>
        </div>
        <p className="text-xs sm:text-sm pl-8.5">{error || "Failed to load vendor dashboard data."}</p>
      </div>
    );
  }

  const { summary, ledger, payouts } = data;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 md:space-y-8 font-inter text-slate-800 dark:text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            {summary.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Billing Model:{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {summary.billingModel === "AGGREGATED" ? "System Paybill (Aggregated)" : "Direct Paybill"}
            </span>
          </p>
        </div>

        {/* Manual Payout Trigger */}
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={summary.currentBalance <= 0}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
        >
          <BanknotesIcon className="w-5 h-5 shrink-0" />
          <span>Request Instant Payout</span>
        </button>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Working Balance */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                Working Balance
              </span>
              <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400">
                <BanknotesIcon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-3">
              KES {summary.currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          {summary.billingModel === "AGGREGATED" && (
            <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              Auto-payout at KES {summary.payoutThreshold.toLocaleString()} to{" "}
              <span className="font-mono font-medium text-slate-600 dark:text-slate-300">
                {summary.payoutPhone || "N/A"}
              </span>
            </p>
          )}
        </div>

        {/* Settlement Target */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                Settlement Target
              </span>
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400">
                <PhoneIcon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 mt-3 font-mono">
              {summary.payoutPhone || "Not Configured"}
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                summary.autoPayoutEnabled ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              {summary.autoPayoutEnabled ? "Auto-payout Enabled" : "Manual Settlement Only"}
            </span>
          </div>
        </div>

        {/* Total Settled Collections */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                Total Settled Collections
              </span>
              <div className="p-2 bg-blue-100 dark:bg-blue-950/60 rounded-xl text-blue-600 dark:text-blue-400">
                <CreditCardIcon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-3">
              KES{" "}
              {ledger
                .reduce((acc, curr) => acc + curr.netAmount, 0)
                .toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            {ledger.length} total transactions processed
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        <nav className="-mb-px flex space-x-6 sm:space-x-8 min-w-max">
          <button
            onClick={() => setActiveTab("ledger")}
            className={`py-3.5 px-1 border-b-2 font-semibold text-xs sm:text-sm transition-colors ${
              activeTab === "ledger"
                ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            Transaction Ledger ({ledger.length})
          </button>
          <button
            onClick={() => setActiveTab("payouts")}
            className={`py-3.5 px-1 border-b-2 font-semibold text-xs sm:text-sm transition-colors ${
              activeTab === "payouts"
                ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            Disbursement Payouts ({payouts.length})
          </button>
          <button
            onClick={() => setActiveTab("config")}
            className={`py-3.5 px-1 border-b-2 font-semibold text-xs sm:text-sm transition-colors ${
              activeTab === "config"
                ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            Payout Configuration
          </button>
        </nav>
      </div>

      {/* Tab View Container */}
      {activeTab === "config" ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <VendorPayoutConfig onConfigUpdated={fetchDashboardData} />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {activeTab === "ledger" ? (
            <LedgerTable ledger={ledger} />
          ) : (
            <PayoutsTable payouts={payouts} />
          )}
        </div>
      )}

      {/* Instant Payout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                Request Instant Payout
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setPayoutError(null);
                  setPayoutSuccess(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {payoutSuccess && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs sm:text-sm">
                <CheckCircleIcon className="w-5 h-5 shrink-0" />
                <span>{payoutSuccess}</span>
              </div>
            )}

            {payoutError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-xs sm:text-sm">
                <ExclamationCircleIcon className="w-5 h-5 shrink-0" />
                <span>{payoutError}</span>
              </div>
            )}

            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Payout Phone Number
                </label>
                <input
                  type="text"
                  readOnly
                  value={summary.payoutPhone || "Not set"}
                  className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-mono cursor-not-allowed"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs sm:text-sm mb-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Amount (KES)
                  </label>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs">
                    Max: KES {summary.currentBalance.toLocaleString()}
                  </span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  max={summary.currentBalance}
                  placeholder="e.g. 5000"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-xl transition-all disabled:opacity-50"
                >
                  {isSubmitting && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
                  <span>{isSubmitting ? "Processing..." : "Confirm & Request"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================
// TRANSACTION LEDGER TABLE COMPONENT
// =========================================================
const LedgerTable: React.FC<{ ledger: LedgerEntry[] }> = ({ ledger }) => {
  if (ledger.length === 0) {
    return (
      <div className="p-8 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        No ledger transactions recorded yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs sm:text-sm text-slate-600 dark:text-slate-300">
        <thead className="bg-slate-50 dark:bg-slate-800/60 text-[11px] sm:text-xs uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-bold">
          <tr>
            <th className="px-4 sm:px-6 py-3.5">Receipt No.</th>
            <th className="px-4 sm:px-6 py-3.5">Date & Time</th>
            <th className="px-4 sm:px-6 py-3.5">Gross Amount</th>
            <th className="px-4 sm:px-6 py-3.5">Platform Fee</th>
            <th className="px-4 sm:px-6 py-3.5 text-right">Net Credited</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {ledger.map((entry) => (
            <tr key={entry.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
              <td className="px-4 sm:px-6 py-4 font-mono font-semibold text-slate-900 dark:text-slate-100">
                {entry.mpesaReceiptNumber}
              </td>
              <td className="px-4 sm:px-6 py-4 text-slate-500 dark:text-slate-400">
                {new Date(entry.createdAt).toLocaleString()}
              </td>
              <td className="px-4 sm:px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                KES {Number(entry.grossAmount || 0).toFixed(2)}
              </td>
              <td className="px-4 sm:px-6 py-4 text-red-600 dark:text-red-400 font-semibold">
                - KES {Number(entry.platformFee || 0).toFixed(2)}
              </td>
              <td className="px-4 sm:px-6 py-4 text-emerald-600 dark:text-emerald-400 font-bold text-right">
                KES {Number(entry.netAmount || 0).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// =========================================================
// DISBURSEMENT PAYOUTS TABLE COMPONENT
// =========================================================
const PayoutsTable: React.FC<{ payouts: PayoutRecord[] }> = ({ payouts }) => {
  if (payouts.length === 0) {
    return (
      <div className="p-8 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        No disbursement payout attempts recorded.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs sm:text-sm text-slate-600 dark:text-slate-300">
        <thead className="bg-slate-50 dark:bg-slate-800/60 text-[11px] sm:text-xs uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-bold">
          <tr>
            <th className="px-4 sm:px-6 py-3.5">Payout ID</th>
            <th className="px-4 sm:px-6 py-3.5">Recipient Phone</th>
            <th className="px-4 sm:px-6 py-3.5">Amount</th>
            <th className="px-4 sm:px-6 py-3.5">Status</th>
            <th className="px-4 sm:px-6 py-3.5">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {payouts.map((payout) => (
            <tr key={payout.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
              <td className="px-4 sm:px-6 py-4 font-mono text-slate-500 dark:text-slate-400">
                {payout.id.slice(0, 8)}...
              </td>
              <td className="px-4 sm:px-6 py-4 font-mono font-semibold text-slate-900 dark:text-slate-100">
                {payout.phoneNumber}
              </td>
              <td className="px-4 sm:px-6 py-4 font-bold text-slate-900 dark:text-slate-100">
                KES {Number(payout.amount || 0).toFixed(2)}
              </td>
              <td className="px-4 sm:px-6 py-4">
                <StatusBadge status={payout.status} />
              </td>
              <td className="px-4 sm:px-6 py-4 text-slate-500 dark:text-slate-400">
                {new Date(payout.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// =========================================================
// STATUS BADGE UTILITY
// =========================================================
const StatusBadge: React.FC<{ status: PayoutStatus }> = ({ status }) => {
  const styles: Record<PayoutStatus, string> = {
    SUCCESS: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    PROCESSING: "bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    PENDING: "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    FAILED: "bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800",
  };

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${styles[status]}`}>
      {status}
    </span>
  );
};

export default VendorDashboard;