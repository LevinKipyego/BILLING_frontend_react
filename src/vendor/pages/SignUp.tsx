import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { BaseUrl } from "../../BaseUrl";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BaseUrl}/api/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Signup failed");
      }

      navigate("/login", { replace: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#090d16] font-sans">
      
      {/* LEFT SIDE - FORM */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-16 xl:px-24 z-10">
        <div className="w-full max-w-md bg-white dark:bg-[#111827]/40 p-8 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800/60 backdrop-blur-md">
          
          {/* Header */}
          <div className="mb-8">
            <div className="h-10 w-10 bg-indigo-600/10 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 border border-indigo-500/20">
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Create your account
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
              Start managing your network infrastructure today.
            </p>
          </div>

          {/* Error Container */}
          {error && (
            <div className="mb-6 text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-xl p-4 animate-shake">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name */}
            <CardInput
              icon={User}
              label="Full name"
              value={name}
              onChange={setName}
              type="text"
              placeholder="John Doe"
            />

            {/* Phone + Email Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CardInput
                icon={Phone}
                label="Phone"
                value={phone}
                onChange={setPhone}
                type="tel"
                placeholder="254..."
              />

              <CardInput
                icon={Mail}
                label="Email"
                value={email}
                onChange={setEmail}
                type="email"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Password
              </label>

              <div className="flex items-center bg-slate-50 dark:bg-[#111827]/60 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all duration-200 px-3.5 group">
                <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors mr-3" />

                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-transparent py-3 text-sm outline-none text-slate-900 dark:text-white placeholder-slate-400"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors ml-2"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-medium py-3 rounded-xl shadow-lg shadow-indigo-600/20 dark:shadow-none transition-all duration-150 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create account <ArrowRight size={16} className="ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-8 text-sm text-center text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - DECORATIVE HERO BRANDING */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center bg-[#060913] text-white p-16 overflow-hidden">
        {/* Subtle background ambient mesh */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
        
        <div className="max-w-md relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-medium mb-6 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Next-Gen ISP Infrastructure
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Build your smart ISP platform
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Automate billing operations, seamless MikroTik orchestration, and granular GenieACS client device provision tracking inside a centralized visual control board.
          </p>
        </div>
      </div>
    </div>
  );
};

/* 🔹 Beautiful Reusable Card Input Component */
const CardInput = ({
  icon: Icon,
  label,
  value,
  onChange,
  type,
  placeholder,
}: any) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
      {label}
    </label>

    <div className="flex items-center bg-slate-50 dark:bg-[#111827]/60 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all duration-200 px-3.5 group">
      <Icon className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors mr-3" />

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="w-full bg-transparent py-3 text-sm outline-none text-slate-900 dark:text-white placeholder-slate-400"
      />
    </div>
  </div>
);

export default Signup;