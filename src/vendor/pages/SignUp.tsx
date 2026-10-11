import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Eye,
  EyeOff,
  LockKeyhole,
  MailCheck,
  Router,
  ShieldCheck,
  Wifi,
  UserRound,
  ChevronDown,
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

type FormSection = "personal" | "security" | null;

const inputClass =
  "block w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-600 sm:text-[13px]";

const labelClass =
  "mb-1 block text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500";

const cardClass =
  "rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#111827]";

function SectionRow({
  title,
  description,
  open,
  complete,
  onClick,
  icon,
}: {
  title: string;
  description: string;
  open: boolean;
  complete?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
        {complete ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-medium text-slate-900 dark:text-white">
          {title}
        </span>
        <span className="mt-0.5 block truncate text-[10px] text-slate-500 dark:text-slate-400">
          {description}
        </span>
      </span>
      <ChevronDown
        className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
          open ? "rotate-180" : ""
        }`}
      />
    </button>
  );
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
  const [successData, setSuccessData] = useState<SignupResponse | null>(null);

  // Accordion state
  const [formSection, setFormSection] = useState<FormSection>("personal");

  const toggleFormSection = (section: Exclude<FormSection, null>) => {
    setFormSection((current) => (current === section ? null : section));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please check both password fields.");
      setFormSection("security");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BaseUrl}/api/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || data.detail || "Signup failed. Please try again.");
      }
      setSuccessData(data);
    } catch (err: any) {
      setError(err?.message || err?.detail || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b1120] dark:text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="relative hidden overflow-hidden border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0f172a] lg:flex">
          <div className="pointer-events-none absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative flex w-full flex-col justify-between p-10 xl:p-14">
            <Link to="/" className="inline-flex w-fit items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
                <Wifi className="h-5 w-5 text-white" />
              </span>
              <span className="text-lg font-bold tracking-tight">Veego</span>
            </Link>

            <div className="my-12 max-w-lg">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
                <UserRound className="h-3.5 w-3.5" />
                ISP MANAGEMENT PLATFORM
              </span>
              <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
                Your network.
                <span className="block text-blue-600 dark:text-blue-400">One clear view.</span>
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-slate-500 dark:text-slate-400">
                Create your administrator account and bring network operations, customer services,
                and billing into one streamlined workspace.
              </p>

              <div className="mt-9 space-y-5">
                {[
                  { icon: Router, title: "Network management", text: "Manage routers and network services." },
                  { icon: CreditCard, title: "M-Pesa billing", text: "Keep subscriptions and payments connected." },
                  { icon: Activity, title: "Operational visibility", text: "See customer sessions and network activity." },
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                      <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
              <ShieldCheck className="h-4 w-4" />
              Secure administrator registration
            </p>
          </div>
        </aside>

        <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 lg:px-10 xl:px-14">
          <div className="w-full max-w-xl">
            <Link to="/" className="mb-8 inline-flex items-center gap-2.5 lg:hidden">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
                <Wifi className="h-4.5 w-4.5 text-white" />
              </span>
              <span className="font-bold">Veego</span>
            </Link>

            <div className="mb-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
                Get started
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Create your account
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                Complete the sections below to set up your Veego administrator account.
              </p>
            </div>

            {error && (
              <div role="alert" className="mb-5 flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className={`${cardClass} overflow-hidden`}>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                
                {/* 1. Personal Information Section */}
                <div>
                  <SectionRow
                    title="1. Personal Information"
                    description={name ? `Name: ${name}` : "Full name, phone, and email"}
                    open={formSection === "personal"}
                    complete={Boolean(name.trim() && email.trim() && phone.trim())}
                    onClick={() => toggleFormSection("personal")}
                    icon={<UserRound className="h-3.5 w-3.5" />}
                  />
                  {formSection === "personal" && (
                    <div className="space-y-3.5 px-4 pb-4 pt-1 sm:px-5">
                      <div>
                        <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                        <input className={inputClass} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Jane Wanjiku" autoComplete="name" required />
                      </div>
                      <div>
                        <label className={labelClass}>Phone Number <span className="text-red-500">*</span></label>
                        <input className={inputClass} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="254712345678" autoComplete="tel" required />
                        <p className="mt-1 text-[10px] text-slate-400">Include country code, e.g. 254.</p>
                      </div>
                      <div>
                        <label className={labelClass}>Email Address <span className="text-red-500">*</span></label>
                        <input className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => setFormSection("security")}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 text-xs font-medium text-white transition hover:bg-blue-700"
                        >
                          Continue to Security <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Password & Security Section */}
                <div>
                  <SectionRow
                    title="2. Password & Security"
                    description={password ? "Password configured" : "Set account password"}
                    open={formSection === "security"}
                    complete={Boolean(password && confirmPassword && password === confirmPassword)}
                    onClick={() => toggleFormSection("security")}
                    icon={<LockKeyhole className="h-3.5 w-3.5" />}
                  />
                  {formSection === "security" && (
                    <div className="space-y-3.5 px-4 pb-4 pt-1 sm:px-5">
                      <div>
                        <label className={labelClass}>Password <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <input className={`${inputClass} pr-10`} type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" autoComplete="new-password" required />
                          <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Confirm Password <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <input className={`${inputClass} pr-10`} type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Enter it again" autoComplete="new-password" required />
                          <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} aria-label={showConfirmPassword ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {password && confirmPassword && (
                        <p className={`flex items-center gap-1.5 text-xs ${password === confirmPassword ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {password === confirmPassword ? "Passwords match" : "Passwords do not match"}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => setFormSection("personal")}
                          className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400"
                        >
                          Back
                        </button>

                        <button
                          type="submit"
                          disabled={loading}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {loading ? (
                            <>
                              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                              Creating account...
                            </>
                          ) : (
                            <>Create account <ArrowRight className="h-3.5 w-3.5" /></>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3 text-center dark:border-slate-800 dark:bg-slate-900/40">
                <p className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Your account information is securely handled.
                </p>
              </div>
            </form>

            <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Sign in</Link>
            </p>
          </div>
        </section>
      </div>

      {successData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" className="w-full max-w-md overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#111827]">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-5 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"><MailCheck className="h-4.5 w-4.5" /></span>
                <div>
                  <h2 className="text-sm font-semibold">Check your email</h2>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{successData.message}</p>
                </div>
              </div>
            </div>
            <div className="p-5">
              <div className="space-y-3 rounded-lg border border-slate-200 p-3.5 dark:border-slate-800 dark:bg-slate-900/40 text-xs">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500 dark:text-slate-400">Account name</span>
                  <span className="font-medium">{successData.vendor.name}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500 dark:text-slate-400">Email</span>
                  <span className="font-medium">{successData.vendor.email}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500 dark:text-slate-400">Status</span>
                  <span className="inline-flex items-center gap-1.5 rounded bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />{successData.vendor.status}
                  </span>
                </div>
              </div>
              <div className="mt-3.5 flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                Follow the instructions sent to your email to complete account setup.
              </div>
              <button onClick={() => navigate("/login", { replace: true })} className="mt-4 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 text-xs font-medium text-white transition hover:bg-blue-700">
                Go to sign in <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Signup;