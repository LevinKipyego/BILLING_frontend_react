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
  
  // Alert system tracking properties
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  const token = localStorage.getItem("portal_access");

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/api/portal/packages/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPackages(response.data);
    } catch (error) {
      console.error(error);
      setMessageType('error');
      setMessage("Failed to load PPPoE profiles. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = async () => {
    if (!selectedPackage) return;

    if (!phone) {
      setMessageType('warning');
      setMessage("Please enter your M-PESA phone number.");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      const response = await axios.post(
        `${BaseUrl}/api/portal/purchase/`,
        {
          phone,
          plan_id: selectedPackage.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessageType('success');
      setMessage(response.data.message || "STK Push sent successfully! Check your phone.");
    } catch (error: any) {
      console.error(error);
      setMessageType('error');
      setMessage(error?.response?.data?.error || "Payment processing failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="font-['Figtree',sans-serif] transition-colors duration-200">
      
      {/* HEADER CONTROLS */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
            {selectedPackage ? "Checkout Securely" : "Available Internet Packages"}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {selectedPackage ? "Complete your payment details" : "Select a PPPoE tier to re-subscribe"}
          </p>
        </div>

        {selectedPackage && (
          <button
            onClick={() => {
              setSelectedPackage(null);
              setMessage("");
            }}
            className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition group"
          >
            <svg className="w-4 h-4 transform group-hover:-translate-x-0.5 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Packages
          </button>
        )}
      </div>

      {/* ==========================================================================
         PACKAGE LISTING MATRIX STATE
         ========================================================================== */}
      {!selectedPackage && (
        <>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 animate-pulse space-y-4"
                >
                  <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3"></div>
                  <div className="h-4 bg-zinc-100 dark:bg-zinc-800/60 rounded w-1/3"></div>
                  <div className="pt-4 flex justify-between items-center">
                    <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div>
                    <div className="h-9 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="group bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/50 dark:hover:border-emerald-500/40 hover:shadow-xl hover:shadow-zinc-200/40 dark:hover:shadow-none transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
                        {pkg.name}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400">
                        Active Plan
                      </span>
                    </div>

                    <p className="mt-4 text-2xl font-black text-zinc-900 dark:text-zinc-50">
                      KES {pkg.price}
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">{pkg.rate_limit || "Unlimited Speed"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Valid for {Math.floor(pkg.duration_minutes / 60)} Hours</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPackage(pkg)}
                    className="mt-6 w-full text-center bg-zinc-900 dark:bg-zinc-800 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-white py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-150 group-hover:bg-emerald-600 group-hover:scale-[1.01]"
                  >
                    Select Package
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ==========================================================================
         CHECKOUT & SAFARICOM M-PESA STK PUSH TERMINAL STATE
         ========================================================================== */}
      {selectedPackage && (
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-sm">
            
            {/* Package Review Card */}
            <div className="mb-6 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Selected Tier</span>
              <h3 className="text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 mt-1">
                {selectedPackage.name}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Speed Cap: {selectedPackage.rate_limit}
              </p>
              <div className="mt-3 text-2xl font-black text-emerald-600 dark:text-emerald-400">
                KES {selectedPackage.price}
              </div>
            </div>

            {/* Input Form Payload Element */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                  M-PESA Registered Number
                </label>
                <div className="relative mt-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-zinc-400 dark:text-zinc-500 text-sm font-medium">🇰🇪</span>
                  </div>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="254712345678"
                    className="w-full bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-xl pl-10 pr-4 py-3 outline-none font-medium text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-500 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 transition"
                  />
                </div>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1.5">
                  Ensure the phone format begins precisely with the country prefix 254.
                </p>
              </div>

              {/* DYNAMIC DJANGO ALERTS ADAPTER FOR WEB VIEW CHANNELS */}
              {message && (
                <div 
                  className={`text-sm p-4 rounded-xl border-left border-l-4 transition-all ${
                    messageType === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border-emerald-500' :
                    messageType === 'error' ? 'bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-400 border-red-500' :
                    messageType === 'warning' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border-amber-500' :
                    'bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-400'
                  }`}
                >
                  <div className="flex gap-2">
                    <span className="font-medium">{message}</span>
                  </div>
                </div>
              )}

              {/* Payment Execution Hook */}
              <button
                onClick={initiatePayment}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl font-bold transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-emerald-600/10 dark:shadow-none active:scale-[0.99]"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Pinging SIM Wallet...
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