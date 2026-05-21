
import { useEffect, useState } from "react";
import axios from "axios";
import { BaseUrl } from "../../BaseUrl";

interface PackageType {
  id: number;
  name: string;
  price: number;
  rate_limit: string;
  duration_minutes: number;
}

export default function PortalPackages() {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);

  const [phone, setPhone] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  const token = localStorage.getItem("portal_access");

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/api/portal/packages/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPackages(response.data);
    } catch (error) {
      console.error(error);
      setMessageType('error');
      setMessage("Failed to load internet profiles. Please refresh this page.");
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = async () => {
    if (!selectedPackage) return;

    if (!phone) {
      setMessageType('warning');
      setMessage("Please enter your M-PESA registered phone number to proceed.");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      const response = await axios.post(
        `${BaseUrl}/api/portal/purchase/`,
        { phone, plan_id: selectedPackage.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessageType('success');
      setMessage(response.data.message || "STK Push sent successfully! Check your phone screen for the prompt.");
    } catch (error: any) {
      console.error(error);
      setMessageType('error');
      setMessage(error?.response?.data?.error || "Payment processing encountered an issue. Let's try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Human-friendly utility method to parse package validity durations
  const formatDuration = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return remainingHours > 0 ? `${days} Day${days > 1 ? 's' : ''} ${remainingHours} Hrs` : `${days} Day${days > 1 ? 's' : ''}`;
    }
    return `${hours} Hours`;
  };

  return (
    <div className="font-['Figtree',sans-serif] space-y-6 transition-colors duration-200 leading-relaxed">
      
      {/* HEADER CONTROLS SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-900 pb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            {selectedPackage ? "Checkout Securely" : "Internet Service Packages"}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
            {selectedPackage ? "Review your chosen tier and authenticate via mobile money." : "Choose a PPPoE speed profile below to renew or upgrade your access link."}
          </p>
        </div>

        {selectedPackage && (
          <button
            onClick={() => {
              setSelectedPackage(null);
              setMessage("");
            }}
            className="self-start sm:self-center flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition group bg-emerald-50/60 dark:bg-emerald-950/20 px-3.5 py-2 rounded-xl border border-emerald-200/40 dark:border-emerald-800/20"
          >
            <svg className="w-4 h-4 transform group-hover:-translate-x-0.5 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Change Package
          </button>
        )}
      </div>

      {/* PACKAGE LISTING MATRIX STATE */}
      {!selectedPackage && (
        <>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 animate-pulse space-y-5">
                  <div className="flex justify-between">
                    <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
                    <div className="h-5 bg-zinc-100 dark:bg-zinc-800/60 rounded w-1/4"></div>
                  </div>
                  <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3 mt-4"></div>
                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                    <div className="h-4 bg-zinc-100 dark:bg-zinc-800/60 rounded w-2/3"></div>
                    <div className="h-4 bg-zinc-100 dark:bg-zinc-800/60 rounded w-1/2"></div>
                  </div>
                  <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-full pt-2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="group bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/50 dark:hover:border-emerald-500/40 hover:shadow-lg hover:shadow-zinc-200/30 dark:hover:shadow-none transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors">
                        {pkg.name}
                      </h3>
                      <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800">
                        PPPoE Plan
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">KES {pkg.price}</span>
                      <span className="text-xs font-semibold text-zinc-400">/ Cycle</span>
                    </div>
                    
                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2.5 text-xs font-semibold">
                      <div className="flex items-center gap-2.5 text-zinc-600 dark:text-zinc-300">
                        <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Bandwidth Cap: <strong className="text-zinc-900 dark:text-zinc-100 font-bold">{pkg.rate_limit || "Burstable Speed"}</strong></span>
                      </div>
                      <div className="flex items-center gap-2.5 text-zinc-600 dark:text-zinc-300">
                        <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Account Access Validity: <strong className="text-zinc-900 dark:text-zinc-100 font-bold">{formatDuration(pkg.duration_minutes)}</strong></span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPackage(pkg)}
                    className="mt-6 w-full text-center bg-zinc-900 dark:bg-zinc-800 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-white py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider font-bold transition-all duration-150 group-hover:bg-emerald-600 group-hover:scale-[1.01]"
                  >
                    Select Package
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* CHECKOUT & SAFARICOM M-PESA EXPRESS STATE */}
      {selectedPackage && (
        <div className="max-w-md mx-auto pt-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 sm:p-7 shadow-sm space-y-6">
            
            {/* Package Review Details */}
            <div className="p-4 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-900/60">
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500">Subscription Summary</span>
              <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-1">
                {selectedPackage.name}
              </h3>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-1">
                Rate Limit: {selectedPackage.rate_limit} &bull; Valid {formatDuration(selectedPackage.duration_minutes)}
              </p>
              <div className="mt-3 text-2xl font-black text-emerald-600 dark:text-emerald-500">
                KES {selectedPackage.price}
              </div>
            </div>

            {/* Input Form Payload */}
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  M-PESA Target Phone Number
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none select-none">
                    <span className="text-zinc-400 dark:text-zinc-500 text-sm font-medium">🇰🇪</span>
                  </div>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="254712345678"
                    className="w-full bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-xl pl-11 pr-4 py-3 outline-none font-semibold text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-500 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600 transition"
                  />
                </div>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium leading-normal">
                  Provide your target phone formatted with the <strong>254</strong> country prefix node (e.g., 254712345678).
                </p>
              </div>

              {/* SERVICE MESSAGING AND FEEDBACK CHANNELS */}
              {message && (
                <div 
                  className={`text-xs font-semibold p-4 rounded-xl border-l-4 transition-all ${
                    messageType === 'success' ? 'bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border-emerald-500' :
                    messageType === 'error' ? 'bg-red-50/60 dark:bg-red-950/20 text-red-800 dark:text-red-400 border-red-500' :
                    messageType === 'warning' ? 'bg-amber-50/60 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border-amber-500' :
                    'bg-zinc-50/60 dark:bg-zinc-800/40 text-zinc-800 dark:text-zinc-200 border-zinc-400'
                  }`}
                >
                  <p className="leading-normal">{message}</p>
                </div>
              )}

              {/* Payment Execution Hook Button */}
              <button
                onClick={initiatePayment}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-bold transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none shadow-sm shadow-emerald-600/10 dark:shadow-none active:scale-[0.99]"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Pinging SIM STK ToolKit...
                  </>
                ) : (
                  "Pay via M-PESA Express"
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}