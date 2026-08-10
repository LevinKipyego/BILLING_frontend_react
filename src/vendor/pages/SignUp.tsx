import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  MailCheck,
  ArrowRight,
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
  const [successData, setSuccessData] = useState<SignupResponse | null>(null);

  // ==========================================
  // SIGNUP
  // ==========================================

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
        throw new Error(data.message || data.detail || "Signup failed.");
      }

      setSuccessData(data);
    } catch (err: any) {
      setError(err?.message || err?.detail || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-[#0d1117] dark:text-slate-100 relative">
      <div
        className="
          mx-auto
          flex
          min-h-screen
          w-full
          max-w-md
          flex-col
          justify-center
          px-4
          py-8
          sm:px-6
          sm:py-10
        "
      >
        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-7 text-center">
          <div
            className="
              mx-auto
              mb-4
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              border-slate-200
              text-slate-700
              dark:border-slate-700
              dark:text-slate-300
            "
          >
            <ShieldCheck className="h-5 w-5" />
          </div>

          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Create your account
          </h1>

          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            Set up your administrator account
          </p>
        </div>

        {/* ==========================================
            FORM OUTLINE
        ========================================== */}

        <div
          className="
            w-full
            rounded-xl
            border
            border-slate-200
            p-5
            dark:border-slate-700
            sm:p-6
          "
        >
          {/* Error */}

          {error && (
            <div
              className="
                mb-5
                flex
                items-start
                gap-2.5
                rounded-lg
                border
                border-rose-200
                bg-rose-50
                px-3.5
                py-3
                text-xs
                text-rose-700
                dark:border-rose-800/60
                dark:bg-rose-950/20
                dark:text-rose-300
              "
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ==========================================
                FULL NAME
            ========================================== */}

            <MinimalInput
              label="Full name"
              value={name}
              onChange={setName}
              type="text"
              placeholder="John Doe"
              autoComplete="name"
            />

            {/* ==========================================
                PHONE
            ========================================== */}

            <MinimalInput
              label="Phone number"
              value={phone}
              onChange={setPhone}
              type="tel"
              placeholder="254712345678"
              autoComplete="tel"
            />

            {/* ==========================================
                EMAIL
            ========================================== */}

            <MinimalInput
              label="Email address"
              value={email}
              onChange={setEmail}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
            />

            {/* ==========================================
                PASSWORD
            ========================================== */}

            <PasswordInput
              label="Password"
              value={password}
              onChange={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              autoComplete="new-password"
            />

            {/* ==========================================
                CONFIRM PASSWORD
            ========================================== */}

            <PasswordInput
              label="Confirm password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              showPassword={showConfirmPassword}
              setShowPassword={setShowConfirmPassword}
              autoComplete="new-password"
            />

            {/* ==========================================
                SUBMIT
            ========================================== */}

            <button
              type="submit"
              disabled={loading}
              className="
                mt-2
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
                "Create account"
              )}
            </button>
          </form>
        </div>

        {/* ==========================================
            LOGIN LINK
        ========================================== */}

        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="
              font-medium
              text-blue-600
              hover:underline
              dark:text-blue-400
            "
          >
            Sign in
          </Link>
        </p>

        {/* ==========================================
            FOOTER
        ========================================== */}

        <p className="mt-7 text-center text-[10px] text-slate-400 dark:text-slate-600">
          Secure administrator registration
        </p>
      </div>

      {/* ==========================================
          SUCCESS MODAL CARD
      ========================================== */}

      {successData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div
            className="
              w-full
              max-w-md
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-xl
              dark:border-slate-800
              dark:bg-[#161b22]
              sm:p-8
            "
          >
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <MailCheck className="h-7 w-7" />
            </div>

            <h2 className="text-center text-xl font-bold text-slate-900 dark:text-white">
              Check your email
            </h2>

            <p className="mt-2 text-center text-xs text-slate-600 dark:text-slate-300">
              {successData.message}
            </p>

            <div className="mt-6 space-y-2.5 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs dark:border-slate-800/80 dark:bg-slate-900/50">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Account Name:
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {successData.vendor.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Email:
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {successData.vendor.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Account Status:
                </span>
                <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                  {successData.vendor.status}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate("/login", { replace: true })}
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
                transition-colors
                hover:bg-blue-700
                focus:outline-none
                focus:ring-2
                focus:ring-blue-600/30
                dark:bg-blue-600
                dark:hover:bg-blue-500
              "
            >
              <span>Go to Sign in</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

/* ==================================================
   MINIMAL INPUT
================================================== */

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
}: MinimalInputProps) => {
  return (
    <div className="space-y-2">
      <label
        className="
          block
          text-xs
          font-medium
          text-slate-700
          dark:text-slate-300
        "
      >
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
  );
};

/* ==================================================
   PASSWORD INPUT
================================================== */

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  autoComplete?: string;
}

const PasswordInput = ({
  label,
  value,
  onChange,
  showPassword,
  setShowPassword,
  autoComplete,
}: PasswordInputProps) => {
  return (
    <div className="space-y-2">
      <label
        className="
          block
          text-xs
          font-medium
          text-slate-700
          dark:text-slate-300
        "
      >
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
          aria-label={showPassword ? "Hide password" : "Show password"}
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
  );
};

export default Signup;