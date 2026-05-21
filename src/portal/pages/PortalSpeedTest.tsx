import React from "react";

export default function PortalSpeedTest(): React.JSX.Element {
  return (
    <div className="font-['Figtree',sans-serif] space-y-6 transition-colors duration-200">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">Network Speed Diagnostic</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Cross-reference your current latency, download metrics, and upload capacities directly against our edge core switches.</p>
      </div>

      {/* SECURE LIGHTWEIGHT SPEEDTEST CONTAINER FRAME */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-sm overflow-hidden aspect-video max-w-4xl h-[520px]">
        <iframe
          src="https://openspeedtest.com/Get-Widget.php"
          title="KayoNet Speed Diagnostic Tool"
          className="w-full h-full rounded-xl border-none bg-transparent"
          allow="geolocation; microphone; camera"
          loading="lazy"
        />
      </div>

      <div className="bg-zinc-100/50 dark:bg-zinc-900/40 p-4 rounded-xl max-w-4xl text-[11px] text-zinc-400 dark:text-zinc-500 font-medium leading-relaxed">
        <strong>Technical Guideline Note:</strong> For accurate results matching your Home Broadband allocation profile, pause downloading applications, disconnect background VPN tunnels, and test using a physical Cat6 ethernet cable link directly into the ONT port where applicable.
      </div>
    </div>
  );
}