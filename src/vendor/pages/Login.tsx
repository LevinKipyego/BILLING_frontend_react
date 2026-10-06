
// src/pages/auth/Login.tsx

import AppFooter from "./AppFooter";

import React, { useState } from "react";

import {
  useNavigate,
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Github,
  Chrome,
  ArrowRight,
  Wifi,
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


  // ============================================================
  // QUERY PARAMETERS
  // ============================================================

  const authMessage = searchParams.get("message");

  const sessionExpired =
    authMessage === "session-expired";

  const authRequired =
    authMessage === "authentication-required";


  // ============================================================
  // EMAIL VERIFICATION
  // ============================================================

  const isVerified =
    searchParams.get("verified") === "true";

  const verificationError =
    searchParams.get("error");


  const getVerificationErrorMessage = (
    code: string | null
  ) => {
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


  const verificationErrorMessage =
    getVerificationErrorMessage(
      verificationError
    );


  // ============================================================
  // LOGIN
  // ============================================================

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
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.detail ||
            "Login failed. Please check your credentials."
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

      localStorage.removeItem(
        "logout_event"
      );

      localStorage.setItem(
        "onboarding_complete",
        String(data.vendor.is_onboarded)
      );

      window.dispatchEvent(
        new Event("auth-changed")
      );

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
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b0f19] dark:text-slate-100">

      <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6">

        <div className="w-full max-w-[440px]">

          {/* =====================================================
              BRAND
          ====================================================== */}

          <div className="mb-8">

            <Link
              to="/"
              className="inline-flex items-center gap-2.5"
            >

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
                <Wifi className="h-4.5 w-4.5 text-white" />
              </div>

              <span className="text-base font-semibold text-slate-900 dark:text-white">
                Veego
              </span>

            </Link>

          </div>


          {/* =====================================================
              HEADING
          ====================================================== */}

          <div className="mb-7">

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[10px] font-semibold text-blue-600 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-400">

              <ShieldCheck className="h-3.5 w-3.5" />

              Administrator access

            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Sign in to your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Manage your ISP network, customers,
              billing, and services from one place.
            </p>

          </div>


          {/* =====================================================
              STATUS MESSAGES
          ====================================================== */}

          <div className="mb-5 space-y-3">

            {isVerified && !error && (
              <StatusMessage
                type="success"
                icon={CheckCircle2}
                message="Your email has been verified successfully! You can now sign in."
              />
            )}

            {verificationErrorMessage && !error && (
              <StatusMessage
                type="error"
                icon={AlertCircle}
                message={verificationErrorMessage}
              />
            )}

            {sessionExpired && !error && (
              <StatusMessage
                type="warning"
                icon={AlertCircle}
                message="Your session has expired. Please sign in again."
              />
            )}

            {authRequired && !error && (
              <StatusMessage
                type="warning"
                icon={AlertCircle}
                message="Authentication is required to continue."
              />
            )}

            {error && (
              <StatusMessage
                type="error"
                icon={AlertCircle}
                message={error}
              />
            )}

          </div>


          {/* =====================================================
              LOGIN FORM
          ====================================================== */}

          <form
            onSubmit={handleSubmit}
            className="
              rounded-xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
              dark:border-slate-800
              dark:bg-[#111827]
              sm:p-6
            "
          >

            {/* Email */}

            <div className="space-y-2">

              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                className="
                  block
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  bg-white
                  px-3.5
                  text-sm
                  text-slate-900
                  outline-none
                  transition-all
                  placeholder:text-slate-400
                  focus:border-blue-600
                  focus:ring-2
                  focus:ring-blue-600/10
                  dark:border-slate-700
                  dark:bg-[#0d1117]
                  dark:text-white
                  dark:placeholder:text-slate-500
                  dark:focus:border-blue-500
                  dark:focus:ring-blue-500/10
                "
              />

            </div>


            {/* Password */}

            <div className="mt-5 space-y-2">

              <div className="flex items-center justify-between gap-3">

                <label
                  htmlFor="password"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>

                <Link
                  to="#"
                  className="text-[11px] font-medium text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400"
                >
                  Forgot password?
                </Link>

              </div>


              <div className="relative">

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                  className="
                    block
                    h-11
                    w-full
                    rounded-lg
                    border
                    border-slate-300
                    bg-white
                    pl-3.5
                    pr-12
                    text-sm
                    text-slate-900
                    outline-none
                    transition-all
                    placeholder:text-slate-400
                    focus:border-blue-600
                    focus:ring-2
                    focus:ring-blue-600/10
                    dark:border-slate-700
                    dark:bg-[#0d1117]
                    dark:text-white
                    dark:placeholder:text-slate-500
                    dark:focus:border-blue-500
                    dark:focus:ring-blue-500/10
                  "
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
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
                mt-6
                flex
                h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-blue-600
                px-4
                text-sm
                font-semibold
                text-white
                shadow-sm
                shadow-blue-600/20
                transition-all
                hover:bg-blue-700
                hover:shadow-md
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
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}

            </button>


            {/* Divider */}

            <div className="relative my-5 flex items-center">

              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

              <span className="px-3 text-[9px] font-medium uppercase tracking-wider text-slate-400">
                or continue with
              </span>

              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

            </div>


            {/* Social buttons */}

            <div className="grid grid-cols-2 gap-3">

              <button
                type="button"
                className="
                  flex
                  h-10
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border
                  border-slate-300
                  bg-white
                  px-3
                  text-xs
                  font-medium
                  text-slate-700
                  transition-colors
                  hover:bg-slate-50
                  dark:border-slate-700
                  dark:bg-[#0d1117]
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
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border
                  border-slate-300
                  bg-white
                  px-3
                  text-xs
                  font-medium
                  text-slate-700
                  transition-colors
                  hover:bg-slate-50
                  dark:border-slate-700
                  dark:bg-[#0d1117]
                  dark:text-slate-300
                  dark:hover:bg-slate-800
                "
              >
                <Chrome className="h-4 w-4" />
                Google
              </button>

            </div>

          </form>


          {/* =====================================================
              NAVIGATION LINKS
          ====================================================== */}

          <div className="mt-5 flex flex-col items-center gap-2 text-xs sm:flex-row sm:justify-between">

            <p className="text-slate-500 dark:text-slate-400">

              New here?{" "}

              <Link
                to="/signup"
                className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                Create an account
              </Link>

            </p>


            <Link
              to="/"
              className="font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            >
              ← Main page
            </Link>

          </div>


          {/* Security */}

          <div className="mt-6 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-600">

            <ShieldCheck className="h-3.5 w-3.5" />

            Secure administrator access

          </div>


          {/* Footer */}

          <div className="mt-5">

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

        </div>

      </div>

    </main>
  );
}


/* ===============================================================
   STATUS MESSAGE
=============================================================== */

interface StatusMessageProps {
  type: "success" | "error" | "warning";
  icon: React.ElementType;
  message: string;
}

const StatusMessage = ({
  type,
  icon: Icon,
  message,
}: StatusMessageProps) => {

  const styles = {
    success: `
      border-emerald-200
      bg-emerald-50
      text-emerald-800
      dark:border-emerald-800/60
      dark:bg-emerald-950/20
      dark:text-emerald-300
    `,

    error: `
      border-rose-200
      bg-rose-50
      text-rose-700
      dark:border-rose-800/60
      dark:bg-rose-950/20
      dark:text-rose-300
    `,

    warning: `
      border-amber-200
      bg-amber-50
      text-amber-800
      dark:border-amber-800/60
      dark:bg-amber-950/20
      dark:text-amber-300
    `,
  };

  return (
    <div
      className={[
        "flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-xs",
        styles[type],
      ].join(" ")}
    >

      <Icon className="mt-0.5 h-4 w-4 shrink-0" />

      <span className="leading-5">
        {message}
      </span>

    </div>
  );
};
