import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  KeyIcon,
  BoltIcon
} from "@heroicons/react/24/outline";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://192.168.100.88:8000/api/vendors/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("AUTH_FAILURE: Invalid credentials detected.");
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("vendor_id", data.vendor_id);

      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.message || "Connection to Auth Server failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0a0f18] selection:bg-blue-500/30">
      
      {/* 1. LEFT SIDE: AUTH STATION */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-[45%] lg:px-16 xl:px-24 bg-white dark:bg-[#0a0f18] relative z-10 border-r border-slate-100 dark:border-slate-800 shadow-2xl">
        
        {/* Navigation Actions */}
        <div className="flex justify-between items-center mb-16">
          <Link to="/" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-colors italic">
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Return_to_Hub
          </Link>
          <Link to="/signup" className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 hover:text-blue-500 transition-colors italic">
            Create_New_Node
          </Link>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
               <CpuChipIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] italic">Access_Terminal</span>
          </div>
          
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic leading-none mb-4">
            Authorized_Entry
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Establish a secure link to your MikroTik orchestration dashboard.
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-2xl bg-red-500/10 p-4 text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 border border-red-500/20 flex items-center gap-3 italic animate-in fade-in zoom-in duration-300">
            <ShieldCheckIcon className="w-5 h-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1 italic">
              Credential_Identifier
            </label>
            <div className="relative group">
              <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="email"
                placeholder="admin@isp_node.net"
                className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 py-4 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:opacity-30"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 italic">
                Secret_Key
              </label>
              <Link to="/forgot-password" size-sm className="text-[10px] font-black uppercase tracking-[0.1em] text-blue-600 hover:text-blue-500 italic">
                Reset_Key?
              </Link>
            </div>
            <div className="relative group">
              <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 py-4 pl-12 pr-12 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:opacity-30"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                Validating_Access...
              </>
            ) : (
              <>
                Initialize_Dashboard <ArrowRightIcon className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-12 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 lg:hidden italic">
          New_Vendor?{" "}
          <Link to="/signup" className="text-blue-600 hover:text-blue-500">Register_here</Link>
        </p>
      </div>

      {/* 2. RIGHT SIDE: THE INFRASTRUCTURE VIEW */}
      <div className="hidden lg:flex lg:w-[55%] bg-slate-900 dark:bg-black items-center justify-center relative overflow-hidden p-12">
        {/* Background Tech Grid Layer */}
        <div className="absolute inset-0 z-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(#3b82f6 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />
        
        {/* Animated Scanning Line */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent h-40 w-full -top-40 animate-scan pointer-events-none" />

        <div className="relative z-10 max-w-lg">
          <div className="inline-flex p-5 rounded-[2.5rem] bg-blue-600/10 border border-blue-500/20 mb-10 backdrop-blur-xl shadow-2xl">
            <KeyIcon className="h-14 w-14 text-blue-500" />
          </div>
          
          <h2 className="text-5xl font-black text-white leading-[0.9] mb-8 uppercase italic tracking-tighter">
            System_Link <br/>
            <span className="text-blue-600">Established.</span>
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <BoltIcon className="w-6 h-6 text-blue-500 shrink-0" />
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed italic">
                Monitor global traffic, manage M-Pesa automated callbacks, and update service plans in real-time.
              </p>
            </div>
            
            <div className="flex items-center gap-6 mt-12 p-1">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] text-blue-500 font-black italic shadow-xl">
                      ID_{i}
                    </div>
                  ))}
               </div>
               <div className="space-y-1">
                  <p className="text-white text-[10px] font-black uppercase tracking-widest italic">500+_active_nodes</p>
                  <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest italic flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live_Telemetry_Active
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          from { top: -10% }
          to { top: 110% }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
      `}</style>
    </div>
  );
}