import React from "react";
import type { VendorProfile } from "../../types/vendor";

interface Props {
  profile: VendorProfile;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ContactDetailsCard({ profile, onChange }: Props) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg p-4 sm:p-5 shadow-sm space-y-4">
      <h2 className="text-sm sm:text-base font-medium text-slate-900 dark:text-white border-b border-slate-100 dark:border-gray-800 pb-2">
        Communications & Contact Telephony
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Office Contact
          </label>
          <input
            type="text"
            name="phone_number"
            value={profile.phone_number || ""}
            onChange={onChange}
            placeholder="+254..."
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            NOC Hotline
          </label>
          <input
            type="text"
            name="support_phone"
            value={profile.support_phone || ""}
            onChange={onChange}
            placeholder="+254..."
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Support Email
          </label>
          <input
            type="email"
            name="support_email"
            value={profile.support_email || ""}
            onChange={onChange}
            placeholder="support@vendor.com"
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}