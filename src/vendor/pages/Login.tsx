import AppFooter from "./AppFooter";
import React, { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Github,
  Chrome,
} from "lucide-react";

import { BaseUrl } from "../../BaseUrl";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // QUERY PARAMETERS FROM BACKEND
  // ==========================================

  const authMessage = searchParams.get("message");
  const sessionExpired = authMessage === "session-expired";
  const authRequired = authMessage === "authentication-required";

  // Email Verification Callbacks
  const isVerified = searchParams.get("verified") === "true";
  const verificationError = searchParams.get("error");

  // Map backend verification error codes to human-readable text
  const getVerificationErrorMessage = (code: string | null) => {
    switch (code) {
      case "link-expired":
        return "Your email verification link has expired. Please sign in or register again.";
      case "invalid-token":
        return "Invalid email verification token. Please check your link.";
      case "missing-token":
        return "Verification token is missing. Please click the full link in your email.";
      default:
        return null;
    }
  };

  const verificationErrorMessage = getVerificationErrorMessage(verificationError);

  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${BaseUrl}/api/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || data.detail || "Login failed. Please check your credentials.");
      }

      if (!data?.tokens?.access || !data?.tokens?.refresh) {
        throw new Error("Authentication failed.");
      }

      localStorage.setItem("access_token", data.tokens.access);
      localStorage.setItem("refresh_token", data.tokens.refresh);
      localStorage.setItem("auth_ready", "true");

      localStorage.removeItem("logout_event");

      // Store onboarding status from backend response
      localStorage.setItem("onboarding_complete", String(data.vendor.is_onboarded));
      
      window.dispatchEvent(new Event("auth-changed"));

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err: any) {
      setError(err?.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-[#0d1117] dark:text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-8 sm:px-6">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Sign in to Admin Gateway
          </h1>

          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            Manage your ISP network and services
          </p>
        </div>

        {/* ==========================================
            STATUS MESSAGES
        ========================================== */}

        <div className="mb-5 space-y-3">

          {/* Email Verified Success Banner */}
          {isVerified && !error && (
            <div className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-xs text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/20 dark:text-emerald-300">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Your email has been verified successfully! You can now sign in.
              </span>
            </div>
          )}

          {/* Email Verification Error Banner */}
          {verificationErrorMessage && !error && (
            <div className="flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs text-rose-700 dark:border-rose-800/60 dark:bg-rose-950/20 dark:text-rose-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{verificationErrorMessage}</span>
            </div>
          )}

          {sessionExpired && !error && (
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs text-amber-800 dark:border-amber-800/60 dark:bg-amber-950/20 dark:text-amber-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Your session has expired. Please sign in again.
              </span>
            </div>
          )}

          {authRequired && !error && (
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs text-amber-800 dark:border-amber-800/60 dark:bg-amber-950/20 dark:text-amber-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Authentication is required to continue.
              </span>
            </div>
          )}

          {/* Direct API Error Banner */}
          {error && (
            <div className="flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs text-rose-700 dark:border-rose-800/60 dark:bg-rose-950/20 dark:text-rose-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

        </div>

        {/* ==========================================
            LOGIN FORM
        ========================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border border-slate-200 p-5 dark:border-slate-700 sm:p-6"
        >

          {/* Email */}

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="
                h-11
                w-full
                rounded-lg
                border
                border-slate-300
                bg-transparent
                px-3.5
                text-sm
                text-slate-900
                outline-none
                transition-colors
                placeholder:text-slate-400
                focus:border-blue-600
                dark:border-slate-700
                dark:text-white
                dark:placeholder:text-slate-500
                dark:focus:border-blue-500
              "
            />
          </div>

          {/* Password */}

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label
                htmlFor="password"
                className="text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Password
              </label>

              <Link
                to="#"
                className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  bg-transparent
                  pl-3.5
                  pr-11
                  text-sm
                  text-slate-900
                  outline-none
                  transition-colors
                  placeholder:text-slate-400
                  focus:border-blue-600
                  dark:border-slate-700
                  dark:text-white
                  dark:placeholder:text-slate-500
                  dark:focus:border-blue-500
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
                className="
                  absolute
                  right-0
                  top-0
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  text-slate-400
                  transition-colors
                  hover:text-slate-700
                  dark:hover:text-slate-200
                "
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="
              flex
              h-11
              w-full
              items-center
              justify-center
              rounded-lg
              bg-blue-600
              px-4
              text-sm
              font-semibold
              text-white
              transition-colors
              hover:bg-blue-700
              focus:outline-none
              focus:ring-2
              focus:ring-blue-600/30
              disabled:cursor-not-allowed
              disabled:opacity-60
              dark:bg-blue-600
              dark:hover:bg-blue-500
            "
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              "Sign in"
            )}
          </button>

          {/* Divider */}

          <div className="relative flex items-center py-1">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />

            <span className="px-3 text-[10px] font-medium uppercase tracking-wider text-slate-400">
              or continue with
            </span>

            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>

          {/* ==========================================
              SOCIAL LOGIN ILLUSION
          ========================================== */}

          <div className="grid grid-cols-2 gap-3">

            <button
              type="button"
              className="
                flex
                h-10
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-slate-300
                bg-transparent
                px-3
                text-xs
                font-medium
                text-slate-700
                transition-colors
                hover:bg-slate-50
                dark:border-slate-700
                dark:text-slate-300
                dark:hover:bg-slate-800
              "
            >
              <Github className="h-4 w-4" />
              GitHub
            </button>

            <button
              type="button"
              className="
                flex
                h-10
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-slate-300
                bg-transparent
                px-3
                text-xs
                font-medium
                text-slate-700
                transition-colors
                hover:bg-slate-50
                dark:border-slate-700
                dark:text-slate-300
                dark:hover:bg-slate-800
              "
            >
              <Chrome className="h-4 w-4" />
              Google
            </button>

          </div>

        </form>

        {/* ==========================================
            SIGN UP / NAVIGATION LINKS
        ========================================== */}

        <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            New here?{" "}
            <Link
              to="/signup"
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Create an account
            </Link>
          </p>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Main Page?{" "}
            <Link
              to="/"
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Go to main page
            </Link>
          </p>
        </div>

        {/* Footer */}

        <p className="mt-8 text-center text-[10px] text-slate-400 dark:text-slate-600">
          Secure administrator access
        </p>

        <AppFooter
          compact
          appName="VeeGO"
          description="ISP billing and network management."
          version="1.0.0"
          links={[
            {
              label: "Privacy",
              href: "#",
            },
            {
              label: "Terms",
              href: "#",
            },
            {
              label: "Contact",
              href: "#",
            },
          ]}
        />

      </div>
    </main>
  );
}