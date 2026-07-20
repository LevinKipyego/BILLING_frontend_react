import React, { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

import { BaseUrl } from "../../BaseUrl";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  // ==========================================
  // AUTH MESSAGE
  // ==========================================

  const authMessage =
    searchParams.get("message");

  const sessionExpired =
    authMessage === "session-expired";

  const authRequired =
    authMessage === "authentication-required";

  const loggedOut =
    authMessage === "logged-out";

  const sessionRevoked =
    authMessage === "session-revoked";

  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        `${BaseUrl}/api/login/`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data =
        await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Invalid email or password."
        );
      }

      if (
        !data?.tokens?.access ||
        !data?.tokens?.refresh
      ) {
        throw new Error(
          "Authentication failed."
        );
      }

      // ==========================================
      // SAVE TOKENS
      // ==========================================

      localStorage.setItem(
        "access_token",
        data.tokens.access
      );

      localStorage.setItem(
        "refresh_token",
        data.tokens.refresh
      );

      localStorage.setItem(
        "auth_ready",
        "true"
      );

      // Remove any previous logout notification
      localStorage.removeItem(
        "logout_event"
      );

      // Notify AuthWatcher
      window.dispatchEvent(
        new Event("auth-changed")
      );

      // ==========================================
      // REDIRECT
      // ==========================================

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err: any) {
      setError(
        err?.message ||
          "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#090d16] ">
      
      {/* LEFT SIDE - Centered Form Card */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-16 xl:px-24 z-10">
        <div className="w-full max-w-md bg-white dark:bg-[#111827]/40 p-8 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800/60 backdrop-blur-md">
          
          {/* Header */}
          <div className="mb-8">
            <div className="h-10 w-10 bg-indigo-600/10 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 border border-indigo-500/20">
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Admin Gateway
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
              Securely access your core dashboard manager.
            </p>
          </div>

          {/* SESSION EXPIRED MESSAGE */}
          {sessionExpired && !error && (
            <div className="mb-5 flex items-center gap-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-700 dark:text-amber-400 text-sm p-4">
              <AlertCircle size={18} className="shrink-0" />
              <span>Your session has expired. Please log in again to continue.</span>
            </div>
          )}

          {/* AUTHENTICATION REQUIRED MESSAGE */}
          {authRequired && !error && (
            <div className="mb-5 flex items-center gap-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-700 dark:text-amber-400 text-sm p-4">
              <AlertCircle size={18} className="shrink-0" />
              <span>Authentication required.</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-5 flex items-center gap-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-sm p-4">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Email Address
              </label>
              <div className="flex items-center bg-slate-50 dark:bg-[#111827]/60 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all duration-200 px-3.5 group">
                <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors mr-3" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-transparent py-3 text-sm outline-none text-slate-900 dark:text-white placeholder-slate-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Password
                </label>
                <Link to="/forgot-password" hidden={true} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="flex items-center bg-slate-50 dark:bg-[#111827]/60 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all duration-200 px-3.5 group">
                <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors mr-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-transparent py-3 text-sm outline-none text-slate-900 dark:text-white placeholder-slate-400"
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
                  Log in <ArrowRight size={16} className="ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-8 text-sm text-center text-slate-500 dark:text-slate-400">
            Don’t have an account?{" "}
            <Link to="/signup" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - DECORATIVE HERO BRANDING */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center bg-[#060913] text-white p-16 overflow-hidden">
        {/* Ambient background blur circles */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
        
        <div className="max-w-md relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-medium mb-6 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Live ISP Orchestration
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Manage your network effortlessly
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Monitor client MikroTik authentications, run automated billing hooks, and supervise active GenieACS server parameters inside a single interface.
          </p>
        </div>
      </div>
    </div>
  );
}