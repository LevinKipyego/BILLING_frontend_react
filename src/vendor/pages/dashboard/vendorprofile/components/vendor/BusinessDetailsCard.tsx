import React from "react";
import type { VendorProfile } from "../../types/vendor";

interface Props {
  profile: VendorProfile;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function BusinessDetailsCard({ profile, onChange }: Props) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg p-4 sm:p-5 shadow-sm space-y-4">
      <h2 className="text-sm sm:text-base font-medium text-slate-900 dark:text-white border-b border-slate-100 dark:border-gray-800 pb-2">
        Business Specifications
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Vendor Core Name
          </label>
          <input
            disabled
            type="text"
            value={profile.vendor?.name || ""}
            className="w-full px-3 py-2 bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-slate-400 dark:text-slate-500 cursor-not-allowed outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Infrastructure Email
          </label>
          <input
            disabled
            type="email"
            value={profile.vendor?.email || ""}
            className="w-full px-3 py-2 bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-slate-400 dark:text-slate-500 cursor-not-allowed outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Vendor Access Code
          </label>
          <input
            disabled
            type="text"
            value={profile.vendor_code || ""}
            className="w-full px-3 py-2 bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-slate-400 dark:text-slate-500 cursor-not-allowed outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Trade Name
          </label>
          <input
            type="text"
            name="business_name"
            value={profile.business_name || ""}
            onChange={onChange}
            placeholder="e.g. VeeGo Networks"
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Website URL
          </label>
          <input
            type="url"
            name="website"
            value={profile.website || ""}
            onChange={onChange}
            placeholder="https://..."
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}