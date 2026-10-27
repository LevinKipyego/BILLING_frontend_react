import React from "react";
import type { VendorProfile } from "../../types/vendor";

interface Props {
  profile: VendorProfile;
  onChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
}

export default function VendorAccountSidebar({ profile, onChange }: Props) {
  const vendor = profile.vendor;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Account Info Panel */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-gray-800">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-emerald-500 text-white font-semibold flex items-center justify-center text-sm shadow-sm">
            {vendor?.name ? vendor.name.substring(0, 2).toUpperCase() : "VN"}
          </div>
          <div className="space-y-0.5 min-w-0">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
              {vendor?.name}
            </h3>
            <span
              className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium uppercase rounded border ${
                vendor?.status?.toLowerCase() === "active"
                  ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-500/20"
              }`}
            >
              {vendor?.status || "Pending"}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
            <span>Billing Model</span>
            <span className="font-mono text-slate-900 dark:text-slate-200 font-medium">
              {vendor?.billing_model || "DIRECT"}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
            <span>Ledger Balance</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              {profile.default_currency} {vendor?.current_balance || "0.00"}
            </span>
          </div>
        </div>
      </div>

      {/* System Regional Defaults */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg p-4 sm:p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-medium text-slate-900 dark:text-white border-b border-slate-100 dark:border-gray-800 pb-2">
          Regional Defaults
        </h2>

        <div className="space-y-3 text-xs sm:text-sm">
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Timezone
            </label>
            <select
              name="default_timezone"
              value={profile.default_timezone || "Africa/Nairobi"}
              onChange={onChange}
              className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
              <option value="UTC">Coordinated Universal Time (UTC)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="America/New_York">America/New_York (EST)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Currency
            </label>
            <select
              name="default_currency"
              value={profile.default_currency || "KES"}
              onChange={onChange}
              className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="KES">KES - Kenyan Shilling</option>
              <option value="USD">USD - United States Dollar</option>
              <option value="EUR">EUR - Euro Zone</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Brand Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                name="primary_color"
                value={profile.primary_color || "#2563eb"}
                onChange={onChange}
                className="h-8 w-12 cursor-pointer rounded border border-slate-300 dark:border-gray-700 bg-transparent p-0.5"
              />
              <span className="font-mono text-xs text-slate-600 dark:text-slate-300">
                {profile.primary_color || "#2563eb"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}