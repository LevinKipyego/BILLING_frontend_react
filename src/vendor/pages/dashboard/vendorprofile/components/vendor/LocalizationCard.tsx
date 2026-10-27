import React from "react";
import type { VendorProfile } from "../../types/vendor";

interface Props {
  profile: VendorProfile;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function LocalizationCard({ profile, onChange }: Props) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg p-4 sm:p-5 shadow-sm space-y-4">
      <h2 className="text-sm sm:text-base font-medium text-slate-900 dark:text-white border-b border-slate-100 dark:border-gray-800 pb-2">
        Localization Parameters & DNS
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            HQ Operational Hub Region
          </label>
          <input
            type="text"
            name="location"
            value={profile.location || ""}
            onChange={onChange}
            placeholder="Nairobi, Kenya"
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            MikroTik Portal DNS
          </label>
          <input
            type="text"
            name="default_mikrotik_dns"
            value={profile.default_mikrotik_dns || ""}
            onChange={onChange}
            placeholder="hotspot.veego.net"
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
          />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Physical Street Address
          </label>
          <textarea
            name="address"
            value={profile.address || ""}
            onChange={onChange}
            rows={2}
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
          />
        </div>
      </div>
    </div>
  );
}