import React, { useEffect, useState } from "react";
import axios from "axios";

type ProfileResponse = {
  user: {
    id: string;
    full_name: string;
    phone_number: string;
    mpesa_number: string;
    address: string;
    location: string;
    mac_address: string;
    status: boolean;
    initials: string;
  };
  pppoe: {
    username: string;
    password: string;
    ip_address: string;
    subscription_plan: string;
  };
  subscription: {
    status: boolean;
    expires_at: string | null;
  };
};

const API_BASE = import.meta.env.VITE_API_BASE || "http://192.168.100.88:8000/api";

export default function PortalProfile(): React.JSX.Element {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [copiedField, setCopiedField] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("portal_access");
        const response = await axios.get(`${API_BASE}/portal/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (err: any) {
        console.error(err);
        setError(err?.response?.data?.message || "Failed to load profile parameters.");
        if (err?.response?.status === 401) {
          localStorage.removeItem("portal_access");
          window.location.href = "/portal/login?message=session-expired";
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("portal_access");
      await axios.post(`${API_BASE}/portal/logout/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("portal_access");
      window.location.href = "/portal/login";
    }
  };

  // Robust universal copy engine handling both HTTP and HTTPS browser constraints
  const executeCopyAction = (textString: string, fieldKey: string) => {
    if (!textString) return;

    // Method A: Modern Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textString)
        .then(() => triggerCopyFeedback(fieldKey))
        .catch(() => runFallbackCopy(textString, fieldKey));
    } else {
      // Method B: Textarea selection routing for HTTP local network assets
      runFallbackCopy(textString, fieldKey);
    }
  };

  const runFallbackCopy = (text: string, fieldKey: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Pin element off-screen completely out of layout stream
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand("copy");
      if (successful) {
        triggerCopyFeedback(fieldKey);
      } else {
        console.error("Fallback copy execution command failed");
      }
    } catch (err) {
      console.error("Unable to execute fallback textual snapshot inside DOM", err);
    }
    
    document.body.removeChild(textArea);
  };

  const triggerCopyFeedback = (fieldKey: string) => {
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(""), 2500);
  };

  // Reusable AI-style SVG Copy Icon matching ChatGPT/Gemini structural design
  const CopyIconComponent = ({ isCopied }: { isCopied: boolean }) => {
    if (isCopied) {
      return (
        <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-500 transition-all scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-9 h-9 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40 rounded-2xl p-6 text-sm font-semibold text-red-600 dark:text-red-400 max-w-4xl shadow-sm">
        {error || "Unable to retrieve subscriber profile specifications."}
      </div>
    );
  }

  return (
    <div className="font-['Figtree',sans-serif] space-y-8 transition-colors duration-200 leading-relaxed">
      
      {/* HEADER ROW FRAME */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Account Profile
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed font-medium">
          Manage your subscription credentials, home router configurations, and authenticated contact metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl items-start">
        
        {/* LEFT COMPONENT COLUMN STACK */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* PPPoE ROUTER AUTHENTICATION BLOCK */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 sm:p-7 shadow-sm space-y-6">
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3.5">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                Router PPPoE Provisioning
              </h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 font-medium">Authentication keys configured inside your home terminal router node.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* PPPOE USERNAME CARD */}
              <div className="bg-zinc-50/50 dark:bg-zinc-950/40 p-4 rounded-xl border border-zinc-100 dark:border-zinc-900/60 flex flex-col justify-between group">
                <div>
                  <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    PPPoE Username
                  </p>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 mt-1.5 font-mono break-all">
                    {profile.pppoe.username}
                  </h4>
                </div>
                <div className="mt-4 pt-2 border-t border-zinc-100/70 dark:border-zinc-800/50 flex justify-between items-center">
                  <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {copiedField === "pppoe_user" ? "Copied string!" : "Copy parameter"}
                  </span>
                  <button
                    onClick={() => executeCopyAction(profile.pppoe.username, "pppoe_user")}
                    className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 hover:border-emerald-200 dark:hover:border-emerald-800 shadow-sm transition active:scale-95"
                    title="Copy to clipboard"
                  >
                    <CopyIconComponent isCopied={copiedField === "pppoe_user"} />
                  </button>
                </div>
              </div>

              {/* PPPOE ACCESS PASSWORD CARD */}
              <div className="bg-zinc-50/50 dark:bg-zinc-950/40 p-4 rounded-xl border border-zinc-100 dark:border-zinc-900/60 flex flex-col justify-between group">
                <div>
                  <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    PPPoE Access Password
                  </p>
                  <div className="flex items-center justify-between gap-4 mt-1.5">
                    <span className="font-mono text-sm font-bold tracking-wide text-zinc-800 dark:text-zinc-200 break-all">
                      {showPassword ? profile.pppoe.password : "••••••••••••"}
                    </span>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs font-bold text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 select-none transition"
                    >
                      {showPassword ? "Hide" : "Reveal"}
                    </button>
                  </div>
                </div>
                <div className="mt-4 pt-2 border-t border-zinc-100/70 dark:border-zinc-800/50 flex justify-between items-center">
                  <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {copiedField === "pppoe_pass" ? "Copied pass!" : "Copy password"}
                  </span>
                  <button
                    onClick={() => executeCopyAction(profile.pppoe.password, "pppoe_pass")}
                    className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 hover:border-emerald-200 dark:hover:border-emerald-800 shadow-sm transition active:scale-95"
                    title="Copy to clipboard"
                  >
                    <CopyIconComponent isCopied={copiedField === "pppoe_pass"} />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* BILLING & CONTACT DATA CARD CONTAINER */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 sm:p-7 shadow-sm space-y-6">
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3.5">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                Billing & Contact Identity
              </h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 font-medium">Contact metadata verified for payment reconciliations and network notifications.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Primary Mobile Number
                </p>
                <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                  {profile.user.phone_number}
                </h4>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  M-PESA Reconciliation Wallet
                </p>
                <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                  {profile.user.mpesa_number}
                </h4>
              </div>

              <div className="sm:col-span-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 space-y-1">
                <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Physical Installation Address
                </p>
                <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  {profile.user.location} &bull; {profile.user.address}
                </h4>
              </div>
            </div>
          </div>

          {/* MANUAL M-PESA C2B PAYMENT GUIDE CARD */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 sm:p-7 shadow-sm space-y-4">
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                Offline Payment Guide (M-PESA Paybill)
              </h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 font-medium">
                Prefer to settle balances outside this browser interface? Use our manual Lipa Na M-PESA routing channel:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
              
              {/* PAYBILL BUSINESS NUMBER BLOCK */}
              <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-900 rounded-xl flex flex-col justify-between group">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">1. Business Number</span>
                  <span className="block mt-1 font-mono font-black text-sm text-emerald-600 dark:text-emerald-500">400200</span>
                </div>
                <div className="mt-3 pt-2 border-t border-zinc-200/50 dark:border-zinc-800/40 flex justify-between items-center">
                  <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500">
                    {copiedField === "c2b_paybill" ? "Copied!" : "Paybill code"}
                  </span>
                  <button
                    onClick={() => executeCopyAction("400200", "c2b_paybill")}
                    className="p-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 hover:border-emerald-200 dark:hover:border-emerald-800 transition shadow-sm active:scale-95"
                  >
                    <CopyIconComponent isCopied={copiedField === "c2b_paybill"} />
                  </button>
                </div>
              </div>
              
              {/* PAYBILL ACCOUNT NUMBER BLOCK */}
              <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-900 rounded-xl flex flex-col justify-between group">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">2. Account Number</span>
                  <span className="block mt-1 font-mono font-black text-sm text-zinc-800 dark:text-zinc-100 break-all">{profile.pppoe.username}</span>
                </div>
                <div className="mt-3 pt-2 border-t border-zinc-200/50 dark:border-zinc-800/40 flex justify-between items-center">
                  <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500">
                    {copiedField === "c2b_acc" ? "Copied!" : "Account text"}
                  </span>
                  <button
                    onClick={() => executeCopyAction(profile.pppoe.username, "c2b_acc")}
                    className="p-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 hover:border-emerald-200 dark:hover:border-emerald-800 transition shadow-sm active:scale-95"
                  >
                    <CopyIconComponent isCopied={copiedField === "c2b_acc"} />
                  </button>
                </div>
              </div>

              {/* PAYBILL AMOUNT INFORMATION BLOCK */}
              <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-900 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">3. Transaction Amount</span>
                  <span className="block mt-1 text-sm text-zinc-800 dark:text-zinc-100">Your Package Cost</span>
                </div>
                <div className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-4 text-right select-none font-medium italic">
                  Variable rate
                </div>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium leading-normal pt-1">
              <strong>Notice:</strong> Ensure your exact PPPoE username string is written inside the Account Field box. Our automated billing system checks FreeRADIUS credentials immediately to clear network constraints.
            </p>
          </div>

        </div>

        {/* RIGHT METRICS SIDE PANEL */}
        <div className="space-y-6">
          
          {/* USER STATUS BLOCK */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/40 dark:border-emerald-800/20 flex items-center justify-center text-emerald-600 dark:text-emerald-500 font-black text-lg shadow-sm">
                {profile.user.initials}
              </div>

              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                  {profile.user.full_name}
                </h3>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                  profile.user.status
                    ? "bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/30"
                    : "bg-red-50/60 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200/50 dark:border-red-800/30"
                }`}>
                  {profile.user.status ? "Link Active" : "Suspended"}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3 text-xs font-semibold">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 dark:text-zinc-500">Service Profile</span>
                <span className="text-zinc-800 dark:text-zinc-200 font-bold">{profile.pppoe.subscription_plan}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-400 dark:text-zinc-500">Hardware MAC Lock</span>
                <span className="font-mono text-zinc-700 dark:text-zinc-300 font-bold text-[11px]">
                  {profile.user.mac_address || "No MAC Assigned"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-400 dark:text-zinc-500">Allocated IP Session</span>
                <span className="font-mono text-zinc-500 dark:text-zinc-400 text-[11px]">
                  {profile.pppoe.ip_address || "0.0.0.0 (Offline)"}
                </span>
              </div>
            </div>
          </div>

          {/* PORTAL LOGOUT RUN ACTION BUTTON */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 shadow-sm">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200/60 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/10 text-red-600 dark:text-red-400 text-xs uppercase tracking-wider font-bold hover:bg-red-100 dark:hover:bg-red-950/30 transition active:scale-[0.99]"
            >
              Logout
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}