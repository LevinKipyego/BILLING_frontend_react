import React, { useState } from "react";

export default function PortalProfile(): React.JSX.Element {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogout = (): void => {
    localStorage.removeItem("portal_access");
    window.location.href = "/portal/login";
  };

  return (
    <div className="font-['Figtree',sans-serif] space-y-6 transition-colors duration-200">
      
      {/* HEADER SECTION */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
          Account Profile
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Manage your PPPoE subscription authentications and router credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl">
        
        {/* LEFT COLUMN: ACCOUNT CREDENTIALS PANELS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* PPPoE Dial-in Credentials Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 sm:p-6 shadow-sm space-y-5">
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">
                Router PPPoE Settings
              </h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                Use these values if you need to configure a new home router manually.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">PPPoE Username</p>
                <h4 className="font-bold text-zinc-800 dark:text-zinc-100 mt-1">john123</h4>
              </div>

              <div>
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">PPPoE Password</p>
                <div className="flex items-center justify-between gap-2 mt-1 bg-zinc-50 dark:bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-100 dark:border-zinc-900">
                  <span className="font-mono text-sm tracking-wide text-zinc-800 dark:text-zinc-200">
                    {showPassword ? "KayoNet@Secure99" : "••••••••••••"}
                  </span>
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contact and Billing Association Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 sm:p-6 shadow-sm space-y-5">
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">
                Billing & Contact Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Contact Phone</p>
                <h4 className="font-bold text-zinc-800 dark:text-zinc-100 mt-1">+254 700 000 000</h4>
              </div>

              <div>
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Default M-PESA Wallet</p>
                <h4 className="font-bold text-zinc-800 dark:text-zinc-100 mt-1">254700000000</h4>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Service Installation Address</p>
                <h4 className="font-medium text-zinc-700 dark:text-zinc-300 mt-1">Block C, Room 402 — Nairobi, Kenya</h4>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: NETWORK FLAGS AND SESSION ACTIONS */}
        <div className="space-y-6">
          
          {/* Hardware & Network Status Metadata Panel */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 font-bold text-base">
                J
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">John Doe</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 mt-0.5">
                  Account Active
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400 dark:text-zinc-500 font-medium">Subscribed Tier</span>
                <span className="font-bold text-zinc-700 dark:text-zinc-300">Home Premium</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400 dark:text-zinc-500 font-medium">MAC Lock State</span>
                <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300">94:65:2D:11:4A:BC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400 dark:text-zinc-500 font-medium">Assigned Local IP</span>
                <span className="font-mono text-zinc-500 dark:text-zinc-400">10.10.42.185</span>
              </div>
            </div>
          </div>

          {/* Core Layout Identity Controls / Logout */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 shadow-sm space-y-3">
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">System Session Controls</p>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-950/40 bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm font-bold hover:bg-red-100/70 dark:hover:bg-red-950/40 transition active:scale-[0.99]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out of Portal
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}