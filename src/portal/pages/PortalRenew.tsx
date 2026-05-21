import React, { useState } from "react";
import axios from "axios";
import { BaseUrl } from "../../BaseUrl";

interface TargetTier {
  id: string;
  name: string;
  speed: string;
  price: number;
}

export default function PortalRenew(): React.JSX.Element {
  const [phone, setPhone] = useState<string>("254700000000");
  const [selectedPackage, setSelectedPackage] = useState<string>("premium");
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");

  const packages: TargetTier[] = [
    { id: "lite", name: "Home Lite", speed: "8 Mbps", price: 1500 },
    { id: "standard", name: "Home Standard", speed: "15 Mbps", price: 2500 },
    { id: "premium", name: "Home Premium", speed: "30 Mbps", price: 4000 },
  ];

  const handleSTKPush = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setStatusMessage("Dispatching secure M-PESA STK prompt to handset...");
      
      // Axios request payload matching Django Daraja views
      await axios.post(`${BaseUrl}/api/billing/stk-push/`, {
        phone_number: phone,
        package_id: selectedPackage,
      });

      setStatusMessage("Prompt dispatched successfully! Complete PIN entry on your phone to auto-renew link.");
    } catch (err: any) {
      setStatusMessage(err?.response?.data?.error || "Daraja gateway timeout. Please retry or clear cache.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-['Figtree',sans-serif] space-y-6 max-w-4xl transition-colors duration-200">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">Renew / Change Package</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Initiate an instant Safaricom M-PESA STK payment push directly to your smartphone.</p>
      </div>

      <form onSubmit={handleSTKPush} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Tier Cards Select Frame */}
        <div className="md:col-span-2 space-y-3">
          <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Select Speed Tier</p>
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                selectedPackage === pkg.id
                  ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500 ring-2 ring-emerald-500/10"
                  : "bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800/80"
              }`}
            >
              <div>
                <h4 className="font-bold text-zinc-800 dark:text-zinc-100 text-sm">{pkg.name} ({pkg.speed})</h4>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">30 Days Unlimited Lease Access</p>
              </div>
              <span className="font-black text-sm text-zinc-900 dark:text-zinc-50">KES {pkg.price.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Action Trigger Interface Widget */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">M-PESA Phone String</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 254712345678"
              className="w-full bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-emerald-500 text-zinc-800 dark:text-zinc-100 transition"
              required
            />
          </div>

          {statusMessage && (
            <div className="text-xs font-medium bg-zinc-50 dark:bg-zinc-950/50 text-zinc-600 dark:text-zinc-400 p-3 rounded-xl border border-zinc-100 dark:border-zinc-900">
              {statusMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition disabled:opacity-50 active:scale-[0.99]"
          >
            {loading ? "Awaiting PIN Input..." : "Trigger Instant STK Push"}
          </button>
        </div>
      </form>
    </div>
  );
}