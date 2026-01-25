import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ArrowLeftIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  KeyIcon
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
        throw new Error("Invalid email or password. Please try again.");
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("vendor_id", data.vendor_id);

      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* LEFT SIDE: Login Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-12 xl:px-24">
        
        {/* Navigation Actions */}
        <div className="flex justify-between items-center mb-12">
          <Link to="/" className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <Link to="/signup" className="text-sm font-bold text-blue-600 hover:underline">
            Create an Account
          </Link>
        </div>

        <div className="mb-10">
          <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6 lg:hidden">
             <CpuChipIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Welcome Back
          </h1>
          <p className="mt-2 text-gray-500">
            Sign in to manage your MikroTik network and payments.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100 flex items-center gap-3 animate-shake">
            <ShieldCheckIcon className="w-5 h-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Email Address</label>
            <div className="relative">
              <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="admin@yourisp.com"
                className="w-full rounded-xl border border-gray-200 py-3.5 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Password</label>
              <Link to="/forgot-password" size-sm className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 py-3.5 pl-10 pr-12 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:bg-blue-300 disabled:shadow-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In to Dashboard"
            )}
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500 lg:hidden">
          Don't have an account?{" "}
          <Link to="/signup" className="font-bold text-blue-600 hover:underline">Sign up</Link>
        </p>
      </div>

      {/* RIGHT SIDE: Visual/Marketing */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 items-center justify-center relative overflow-hidden p-12">
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', size: '20px 20px', backgroundSize: '40px 40px' }} />
        
        <div className="relative z-10 max-w-md text-center">
          <div className="inline-flex p-4 rounded-3xl bg-blue-600/20 border border-blue-500/30 mb-8 backdrop-blur-sm">
            <KeyIcon className="h-12 w-12 text-blue-500" />
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-6">
            Secure Access to your Infrastructure.
          </h2>
          <p className="text-slate-400 text-lg">
            Monitor traffic, manage M-Pesa callbacks, and update service plans with enterprise-grade security.
          </p>
          
          <div className="mt-12 flex justify-center gap-4">
             <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px] text-white font-bold">
                    V{i}
                  </div>
                ))}
             </div>
             <p className="text-slate-400 text-sm flex items-center">Joined by 500+ ISP Vendors</p>
          </div>
        </div>
      </div>
    </div>
  );
}