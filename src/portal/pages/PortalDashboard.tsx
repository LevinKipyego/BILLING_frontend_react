import React from "react";

export default function PortalDashboard(): React.JSX.Element {
  // Mock data for the network usage stat graph
  const usageData = [
    { day: "Mon", download: 65, upload: 25 },
    { day: "Tue", download: 80, upload: 35 },
    { day: "Wed", download: 45, upload: 15 },
    { day: "Thu", download: 95, upload: 40 },
    { day: "Fri", download: 70, upload: 30 },
    { day: "Sat", download: 110, upload: 55 },
    { day: "Sun", download: 85, upload: 45 },
  ];

  return (
    <div className="font-['Figtree',sans-serif] space-y-6 transition-colors duration-200">
      
      {/* DASHBOARD SUMMARY HEADER */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
          Welcome Back
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Monitor your PPPoE live link metrics and subscription tracking data.
        </p>
      </div>

      {/* CORE PERFORMANCE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Card 1: Package Profile */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Current Package</p>
            <h3 className="text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 mt-1.5">Home Premium</h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">Speed Cap: 20 Mbps</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-500 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>

        {/* Card 2: Radius Link State */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Session Status</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
              <h3 className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-500">
                Connected
              </h3>
            </div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Uptime: 04h 12m 30s</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 5h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2z" />
            </svg>
          </div>
        </div>

        {/* Card 3: Expiry Cycle Target */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 flex items-center justify-between shadow-sm sm:col-span-2 lg:col-span-1">
          <div>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Expiry Date</p>
            <h3 className="text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 mt-1.5">12 Jun 2026</h3>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">Expires in 24 Days</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-500 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* ==========================================================================
         NETWORK USAGE DATA GRAPH (PURE TAILWIND FLEXBAR IMPLEMENTATION)
         ========================================================================== */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h4 className="text-base font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">Weekly Bandwidth Allocation</h4>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Historical overview of data metrics (GB)</p>
          </div>
          
          {/* Legend indicators */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
              <span className="w-3 h-3 rounded bg-emerald-600" />
              <span>Download</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
              <span className="w-3 h-3 rounded bg-zinc-300 dark:bg-zinc-700" />
              <span>Upload</span>
            </div>
          </div>
        </div>

        {/* Chart Column Frame rendering */}
        <div className="h-64 flex items-end justify-between gap-2 pt-4 px-2 border-b border-zinc-100 dark:border-zinc-800/60">
          {usageData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              
              {/* Stacked columns wrapper containing values */}
              <div className="w-full max-w-[28px] sm:max-w-[36px] flex items-end gap-1 h-full relative">
                
                {/* Custom hovering detail card popup */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-zinc-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-10 whitespace-nowrap shadow-xl">
                  DL: {data.download}GB | UL: {data.upload}GB
                </div>

                {/* Upload bar column */}
                <div 
                  style={{ height: `${(data.upload / 120) * 100}%` }}
                  className="w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded-t-sm group-hover:bg-zinc-300 dark:group-hover:bg-zinc-700 transition-colors duration-150"
                />
                {/* Download bar column */}
                <div 
                  style={{ height: `${(data.download / 120) * 100}%` }}
                  className="w-1/2 bg-emerald-600 rounded-t-sm group-hover:bg-emerald-500 transition-colors duration-150"
                />
              </div>

              {/* Baseline indicator text labels */}
              <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 mt-1">
                {data.day}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}