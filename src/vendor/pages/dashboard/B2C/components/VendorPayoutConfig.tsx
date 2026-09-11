import React, { useState, useEffect } from "react";
import { apiGet, apiPatch } from "../../../../api/client";
import { 
  PhoneIcon, 
  EnvelopeIcon,
  ShieldCheckIcon, 
  Cog6ToothIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import { Check, Lock, Building2 } from "lucide-react";

interface VendorPayoutConfigProps {
  onConfigUpdated?: () => void;
}

export default function VendorPayoutConfig({ onConfigUpdated }: VendorPayoutConfigProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    payout_phone: "",
    email: "",
    payout_threshold: "1000.00",
    auto_payout_enabled: true,
  });

  // Normalizes local Kenyan phone inputs (07XX / 01XX / +254) to standard 2547XXXXXXXX / 2541XXXXXXXX format
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

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet<{
        payout_phone: string;
        email: string;
        payout_threshold: string | number;
        auto_payout_enabled: boolean;
      }>("/v1/vendor/payouts/config/");

      setFormData({
        payout_phone: data.payout_phone || "",
        email: data.email || "",
        payout_threshold: String(data.payout_threshold || "1000.00"),
        auto_payout_enabled: data.auto_payout_enabled ?? true,
      });
    } catch (err: any) {
      console.error("Failed to load payout settings:", err);
      setError(err.message || "Failed to load payout settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const formattedPhone = normalizePhoneNumber(formData.payout_phone);

    // Validate phone structure post-normalization
    if (!/^254[71]\d{8}$/.test(formattedPhone)) {
      setError("Please enter a valid Safaricom phone number (e.g., 0712345678 or 254712345678).");
      setIsSaving(false);
      return;
    }

    try {
      await apiPatch("/v1/vendor/payouts/config/", {
        billing_model: "AGGREGATED", // Automatically pinned as per backend requirement
        payout_phone: formattedPhone,
        email: formData.email,
        payout_threshold: parseFloat(formData.payout_threshold),
        auto_payout_enabled: formData.auto_payout_enabled,
      });

      // Update local view state with formatted phone number
      setFormData((prev) => ({ ...prev, payout_phone: formattedPhone }));
      setToastMessage("Payout settings updated successfully!");
      if (onConfigUpdated) onConfigUpdated();

      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: any) {
      console.error("Failed to update payout settings:", err);
      setError(err.message || "Failed to save configuration. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px] text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base">
        <ArrowPathIcon className="w-5 h-5 animate-spin mr-2 text-emerald-600 dark:text-emerald-400" />
        Fetching vendor payout configuration...
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 md:space-y-8 font-inter text-slate-800 dark:text-slate-100 px-4 sm:px-6 lg:px-8 py-4">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-emerald-600 dark:bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircleIcon className="w-5 h-5 shrink-0" />
          <span className="text-xs md:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Global Error Banner */}
      {error && (
        <div className="flex items-start sm:items-center gap-3 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 rounded-xl text-xs md:text-sm">
          <ExclamationCircleIcon className="w-5 h-5 shrink-0 mt-0.5 sm:mt-0" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Payout Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure destination account details and auto-settlement thresholds for disbursements.
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all disabled:opacity-50 text-xs sm:text-sm"
        >
          {isSaving ? (
            <ArrowPathIcon className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
          ) : (
            <Check className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
          <span>{isSaving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        {/* AUTOMATIC BILLING MODEL DISPLAY */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Billing Model: Company Paybill (Aggregated)
                </h3>
                <span className="text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md">
                  Active
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Payments route through the platform Paybill. Automated settlements disburse directly to your specified M-Pesa number.
              </p>
            </div>
          </div>
        </div>

        {/* 1. DISBURSEMENT DESTINATION */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 lg:p-8 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5 border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <PhoneIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
              Destination Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                M-Pesa Payout Phone Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="payout_phone"
                  value={formData.payout_phone}
                  onChange={handleChange}
                  placeholder="0712345678 or 254712345678"
                  className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <PhoneIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3 sm:top-3.5" />
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                Safaricom number to receive automated B2C settlements. Auto-formats to <span className="font-mono text-slate-700 dark:text-slate-300">254XXXXXXXXX</span>.
              </p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Billing Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="vendor@example.com"
                  className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <EnvelopeIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3 sm:top-3.5" />
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                Receives automated settlement reports and transaction receipts.
              </p>
            </div>
          </div>
        </div>

        {/* 2. AUTO-PAYOUT THRESHOLD */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 lg:p-8 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5 border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <Cog6ToothIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
              Payout Limits & Automation
            </h2>
          </div>

          <div className="max-w-xl">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Minimum Payout Threshold (KES)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="10"
                name="payout_threshold"
                value={formData.payout_threshold}
                onChange={handleChange}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              Minimum virtual ledger balance required before an automated B2C settlement triggers.
            </p>
          </div>
        </div>

        {/* 3. SECURITY & AUTOMATION TOGGLES */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 lg:p-8 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5 border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <ShieldCheckIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
              Automation Rules
            </h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-start sm:items-center justify-between cursor-pointer p-3 sm:p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-start sm:items-center gap-3">
                <Lock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Enable Automatic B2C Threshold Payouts
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Automatically trigger B2C payments when working balance crosses threshold limit.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                name="auto_payout_enabled"
                checked={formData.auto_payout_enabled}
                onChange={handleChange}
                className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0 mt-1 sm:mt-0"
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}