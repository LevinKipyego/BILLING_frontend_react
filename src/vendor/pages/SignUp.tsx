
// src/pages/auth/Signup.tsx

import React, { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import {
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  MailCheck,
  ArrowRight,
  CheckCircle2,
  Wifi,
  CreditCard,
  Router,
  Activity,
  UserPlus,
} from "lucide-react";

import { BaseUrl } from "../../BaseUrl";


interface VendorData {
  name: string;
  email: string;
  status: string;
  is_verified: boolean;
}


interface SignupResponse {
  message: string;
  vendor: VendorData;
}


const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] =
    useState<SignupResponse | null>(null);


  // ============================================================
  // SIGNUP
  // ============================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BaseUrl}/api/signup/`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.detail ||
            "Signup failed."
        );
      }

      setSuccessData(data);

    } catch (err: any) {
      setError(
        err?.message ||
          err?.detail ||
          "Unable to connect to the server."
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100">

      <div className="min-h-screen grid lg:grid-cols-[0.9fr_1.1fr]">

        {/* =====================================================
            LEFT PRODUCT PANEL
        ====================================================== */}

        <section className="hidden lg:flex relative overflow-hidden bg-white dark:bg-[#0f1520] border-r border-slate-200 dark:border-slate-800">

          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">

            <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />

            <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl" />

          </div>


          <div className="relative flex w-full flex-col justify-between p-10 xl:p-14">

            {/* Brand */}
            <div>

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


            {/* Main content */}
            <div className="max-w-md">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[10px] font-medium text-blue-600 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-400">

                <UserPlus className="h-3.5 w-3.5" />

                ISP Management Platform

              </div>


              <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-slate-900 dark:text-white xl:text-5xl">

                Build and manage your ISP operation from one place.

              </h1>


              <p className="mt-5 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-400">

                Create your administrator account and get access to
                network management, customer services, billing,
                and operational tools.

              </p>


              {/* Capability list */}
              <div className="mt-8 space-y-3">

                <SignupBenefit
                  icon={Router}
                  title="Network management"
                  description="Manage MikroTik infrastructure and network services."
                />

                <SignupBenefit
                  icon={CreditCard}
                  title="M-Pesa billing"
                  description="Connect subscriptions and payments in one workflow."
                />

                <SignupBenefit
                  icon={Activity}
                  title="Operational visibility"
                  description="Monitor customers, sessions, and network activity."
                />

              </div>

            </div>


            {/* Bottom */}
            <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-600">

              <ShieldCheck className="h-3.5 w-3.5" />

              Secure administrator registration

            </div>

          </div>

        </section>


        {/* =====================================================
            RIGHT FORM AREA
        ====================================================== */}

        <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-10">

          <div className="w-full max-w-md">

            {/* Mobile brand */}
            <div className="mb-8 lg:hidden">

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


            {/* Form heading */}
            <div className="mb-7">

              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400">
                Administrator account
              </p>

              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Set up your administrator account to start managing
                your ISP platform.
              </p>

            </div>


            {/* Error */}
            {error && (
              <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/20 dark:text-rose-300">

                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                <span className="leading-5">
                  {error}
                </span>

              </div>
            )}


            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* Name */}
              <MinimalInput
                label="Full name"
                value={name}
                onChange={setName}
                type="text"
                placeholder="John Doe"
                autoComplete="name"
              />


              {/* Phone */}
              <MinimalInput
                label="Phone number"
                value={phone}
                onChange={setPhone}
                type="tel"
                placeholder="254712345678"
                autoComplete="tel"
              />


              {/* Email */}
              <MinimalInput
                label="Email address"
                value={email}
                onChange={setEmail}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
              />


              {/* Password */}
              <PasswordInput
                label="Password"
                value={password}
                onChange={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                autoComplete="new-password"
              />


              {/* Confirm password */}
              <PasswordInput
                label="Confirm password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                showPassword={showConfirmPassword}
                setShowPassword={setShowConfirmPassword}
                autoComplete="new-password"
              />


              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                  mt-5
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
                  <span
                    className="
                      h-4
                      w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-white/40
                      border-t-white
                    "
                  />
                ) : (
                  <>
                    Create account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}

              </button>

            </form>


            {/* Login */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-5">

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Already have an account?
              </p>

              <Link
                to="/login"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign in
              </Link>

            </div>


            {/* Security note */}
            <div className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-600">

              <ShieldCheck className="h-3.5 w-3.5" />

              Your account information is securely handled.

            </div>

          </div>

        </section>

      </div>


      {/* =====================================================
          SUCCESS MODAL
      ====================================================== */}

      {successData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#111827]">

            {/* Success header */}
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-6 dark:border-slate-800 dark:bg-slate-900/50 sm:px-6">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                  <MailCheck className="h-5 w-5" />
                </div>

                <div>

                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    Check your email
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {successData.message}
                  </p>

                </div>

              </div>

            </div>


            {/* Account details */}
            <div className="p-5 sm:p-6">

              <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900/40">

                <AccountDetail
                  label="Account name"
                  value={successData.vendor.name}
                />

                <AccountDetail
                  label="Email"
                  value={successData.vendor.email}
                />

                <div className="flex items-center justify-between gap-4">

                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Account status
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 text-[9px] font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">

                    <span className="h-1.5 w-1.5 rounded-full bg-current" />

                    {successData.vendor.status}

                  </span>

                </div>

              </div>


              {/* Verification notice */}
              <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-blue-200 bg-blue-50/70 px-3.5 py-3 dark:border-blue-900/50 dark:bg-blue-950/20">

                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />

                <p className="text-[10px] leading-4 text-blue-700 dark:text-blue-300">
                  Follow the instructions sent to your email to
                  complete the account setup.
                </p>

              </div>


              {/* Login button */}
              <button
                onClick={() =>
                  navigate("/login", { replace: true })
                }
                className="
                  mt-5
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
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-600/30
                  dark:bg-blue-600
                  dark:hover:bg-blue-500
                "
              >
                Go to Sign in
                <ArrowRight className="h-4 w-4" />
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
};


/* ===============================================================
   SIGNUP BENEFIT
=============================================================== */

interface SignupBenefitProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const SignupBenefit = ({
  icon: Icon,
  title,
  description,
}: SignupBenefitProps) => (
  <div className="flex items-start gap-3">

    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

      <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />

    </div>

    <div>

      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
        {title}
      </p>

      <p className="mt-0.5 text-[10px] leading-4 text-slate-500 dark:text-slate-500">
        {description}
      </p>

    </div>

  </div>
);


/* ===============================================================
   ACCOUNT DETAIL
=============================================================== */

interface AccountDetailProps {
  label: string;
  value: string;
}

const AccountDetail = ({
  label,
  value,
}: AccountDetailProps) => (
  <div className="flex items-start justify-between gap-4">

    <span className="shrink-0 text-[11px] text-slate-500 dark:text-slate-400">
      {label}
    </span>

    <span className="min-w-0 truncate text-right text-[11px] font-semibold text-slate-800 dark:text-slate-200">
      {value}
    </span>

  </div>
);


/* ===============================================================
   MINIMAL INPUT
=============================================================== */

interface MinimalInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type: string;
  placeholder: string;
  autoComplete?: string;
}

const MinimalInput = ({
  label,
  value,
  onChange,
  type,
  placeholder,
  autoComplete,
}: MinimalInputProps) => (
  <div className="space-y-1.5">

    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
      {label}
    </label>

    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      required
      className="
        h-10.5
        w-full
        rounded-lg
        border
        border-slate-300
        bg-white
        px-3
        text-sm
        text-slate-900
        outline-none
        transition-all
        placeholder:text-slate-400
        focus:border-blue-600
        focus:ring-2
        focus:ring-blue-600/10
        dark:border-slate-700
        dark:bg-[#111827]
        dark:text-white
        dark:placeholder:text-slate-500
        dark:focus:border-blue-500
        dark:focus:ring-blue-500/10
      "
    />

  </div>
);


/* ===============================================================
   PASSWORD INPUT
=============================================================== */

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  setShowPassword: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  autoComplete?: string;
}

const PasswordInput = ({
  label,
  value,
  onChange,
  showPassword,
  setShowPassword,
  autoComplete,
}: PasswordInputProps) => (
  <div className="space-y-1.5">

    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
      {label}
    </label>

    <div className="relative">

      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="••••••••"
        autoComplete={autoComplete}
        required
        className="
          h-10.5
          w-full
          rounded-lg
          border
          border-slate-300
          bg-white
          pl-3
          pr-10
          text-sm
          text-slate-900
          outline-none
          transition-all
          placeholder:text-slate-400
          focus:border-blue-600
          focus:ring-2
          focus:ring-blue-600/10
          dark:border-slate-700
          dark:bg-[#111827]
          dark:text-white
          dark:placeholder:text-slate-500
          dark:focus:border-blue-500
          dark:focus:ring-blue-500/10
        "
      />

      <button
        type="button"
        onClick={() =>
          setShowPassword((prev) => !prev)
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
          h-10.5
          w-10
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
);


export default Signup;
