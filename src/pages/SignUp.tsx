import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ArrowLeftIcon,
  CpuChipIcon,
  CheckBadgeIcon,
  BoltIcon
} from "@heroicons/react/24/outline";

const Signup = () => {
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://192.168.100.88:8000/api/vendors/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, location, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "NODE_CREATION_FAILED: Validation error.");
      }

      navigate("/login", { replace: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0a0f18] selection:bg-blue-500/30">
      {/* 1. LEFT SIDE: REGISTRATION HUB */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-[50%] lg:px-16 xl:px-24 bg-white dark:bg-[#0a0f18] shadow-2xl z-10 border-r border-slate-100 dark:border-slate-800">
        
        {/* Breadcrumb / Action */}
        <Link to="/" className="group mb-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-colors italic">
          <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Abort_To_Mainframe
        </Link>

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 py-1 px-3 rounded-md bg-blue-500/10 border border-blue-500/20 mb-6">
            <BoltIcon className="w-3 h-3 text-blue-500" />
            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest italic">New_Node_Provisioning</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic leading-none mb-4">
            Register_Vendor
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Initialize your encrypted credentials for the ISP management cluster.
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-2xl bg-red-500/10 p-4 text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 border border-red-500/20 flex items-center gap-3 italic animate-shake">
            <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-red-500 text-white">!</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Identity Block */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic">Operator_Identity</label>
            <div className="relative group">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Full Name / Tech Lead"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 py-4 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:opacity-30"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Contact: Phone */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic">Comms_Line</label>
              <div className="relative group">
                <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="tel"
                  placeholder="254..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 py-4 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:opacity-30"
                  required
                />
              </div>
            </div>

            {/* Contact: Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic">Signal_Address</label>
              <div className="relative group">
                <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  placeholder="operator@net.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 py-4 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:opacity-30"
                  required
                />
              </div>
            </div>
          </div>

          {/* Logistics: Location */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic">Business_Coordinates</label>
            <div className="relative group">
              <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="HQ Location / City"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 py-4 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:opacity-30"
                required
              />
            </div>
          </div>

          {/* Security: Password */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic">Access_Cipher</label>
            <div className="relative group">
              <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 py-4 pl-12 pr-12 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:opacity-30"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-blue-600 py-5 text-[11px] font-black uppercase tracking-[0.3em] text-white shadow-2xl shadow-blue-500/30 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 italic"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Initializing_Account...
              </>
            ) : (
              "Deploy_New_Node"
            )}
          </button>
        </form>

        <p className="mt-10 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
          Active_Operator?{" "}
          <Link to="/login" className="text-blue-600 hover:text-blue-500 transition-colors underline underline-offset-8">
            Return_To_Station
          </Link>
        </p>
      </div>

      {/* 2. RIGHT SIDE: THE CORE VISUAL */}
      <div className="hidden lg:flex lg:w-[50%] bg-slate-900 dark:bg-black items-center justify-center relative overflow-hidden p-12">
        {/* Tech Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(#3b82f6 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }} />
        
        {/* Decorative HUD Elements */}
        <div className="absolute top-10 right-10 w-40 h-40 border border-white/5 rounded-full flex items-center justify-center animate-spin-slow">
           <div className="w-20 h-20 border-t border-blue-500/40 rounded-full" />
        </div>

        <div className="relative z-10 max-w-md">
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-blue-600/10 backdrop-blur-3xl border border-blue-500/30 shadow-2xl">
            <CpuChipIcon className="h-10 w-10 text-blue-500" />
          </div>
          <h2 className="text-5xl font-black leading-[0.9] text-white uppercase italic tracking-tighter mb-8">
            Scale Your <br/>
            <span className="text-blue-600">Infrastructure</span> <br/>
            Automatically_
          </h2>
          
          <div className="mt-12 space-y-4">
            <FeatureItem text="Automated_M-Pesa_Sync" />
            <FeatureItem text="Distributed_Router_Control" />
            <FeatureItem text="Zero-Trust_API_Vault" />
          </div>

          <div className="mt-20 p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
             <div className="flex justify-between items-center mb-4">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Node_Status: Online</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             </div>
             <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 w-2/3 animate-pulse" />
             </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
};

const FeatureItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-4 group">
    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500 transition-colors">
      <CheckBadgeIcon className="h-5 w-5 text-blue-500 group-hover:text-white" />
    </div>
    <span className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] italic group-hover:text-white transition-colors">{text}</span>
  </div>
);

export default Signup;