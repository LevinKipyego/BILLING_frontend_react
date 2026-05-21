import React from "react";
import { Link } from "react-router-dom";

interface BannerProperties {
  daysRemaining: number;
  accountStatus: "Active" | "Expired" | "Suspended";
}

export default function PortalNoticeBanner({ daysRemaining, accountStatus }: BannerProperties): React.JSX.Element | null {
  // If line metrics are functional and renewal is far out, suppress frame rendering
  if (accountStatus === "Active" && daysRemaining > 3) return null;

  return (
    <div className="font-['Figtree',sans-serif] mb-6 animate-fade-in">
      {accountStatus === "Expired" || accountStatus === "Suspended" ? (
        <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </span>
            <div>
              <h4 className="text-sm font-bold text-red-900 dark:text-red-300">PPPoE Connection Suspended</h4>
              <p className="text-xs text-red-700/80 dark:text-red-400/80 font-medium mt-0.5">Your monthly internet bundle billing window has lapsed. Renew to restore network access.</p>
            </div>
          </div>
          <Link to="/portal/renew" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition text-center whitespace-nowrap">
            Pay Invoice
          </Link>
        </div>
      ) : (
        /* Warn user early to prevent mid-workflow link interruptions */
        <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </span>
            <div>
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">Lease cycle expiring soon</h4>
              <p className="text-xs text-amber-700/80 dark:text-amber-400/80 font-medium mt-0.5">Your link active period winds down in <strong className="font-bold">{daysRemaining} days</strong>. Pre-renew to guarantee zero runtime downtime.</p>
            </div>
          </div>
          <Link to="/portal/renew" className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition text-center whitespace-nowrap">
            Extend Lease
          </Link>
        </div>
      )}
    </div>
  );
}