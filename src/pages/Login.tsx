import React, { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle, // Added for the session message
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Detect if redirected due to expired session
  const sessionExpired = searchParams.get("message") === "session-expired";
  const authRequired = searchParams.get("message") === "authentication-required";

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setLoading(true);

  try {
    const response = await fetch(
      "http://192.168.100.88:8000/api/vendors/login/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!response.ok) {
      throw new Error("Invalid email or password");
    }

    const data = await response.json();

    // ✅ SINGLE SOURCE OF TRUTH = JWT ONLY
    localStorage.setItem("access_token", data.access);
    localStorage.setItem(
      "access_token",
      data.tokens.access
    );

    localStorage.setItem(
      "refresh_token",
      data.tokens.refresh
    );


    // optional flag for UI stability
    localStorage.setItem("auth_ready", "true");

    navigate("/dashboard", { replace: true });
  } catch (err: any) {
    setError(err.message || "Unable to connect to server");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 dark:bg-[#0b0f19]">
      
      {/* LEFT SIDE - Centered Form */}
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          
          {/* THE CARD CONTAINER */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden">
            
            {/* Django-Style Header */}
            <div className="bg-gray-50 dark:bg-gray-900 px-8 py-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Admin Login
              </h1>
            </div>

            <div className="p-8">
              
              {/* SESSION EXPIRED MESSAGE */}
              {sessionExpired && !error && (
                <div className="mb-6 flex items-center gap-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm p-4 dark:bg-amber-900/20 dark:border-amber-900/30 dark:text-amber-400">
                  <AlertCircle size={18} />
                  <span>Your session has expired. Please log in again to continue.</span>
                </div>
              )}

              {/* AUTHENTICATION REQUIRED MESSAGE */}
              {authRequired && !error && (
                <div className="mb-6 flex items-center gap-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm p-4 dark:bg-yellow-900/20 dark:border-yellow-900/30 dark:text-yellow-400">
                  <AlertCircle size={18} />
                  <span>Authentication required.</span>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 flex items-center gap-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm p-4 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-400">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#111827] text-gray-900 dark:text-white pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <Link to="/forgot-password" hidden={true} className="text-xs text-blue-600 hover:underline">
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#111827] text-gray-900 dark:text-white pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-3 rounded-lg transition disabled:opacity-50 mt-4"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Log in <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <p className="mt-6 text-sm text-center text-gray-500 dark:text-gray-400">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-12">
        <div className="max-w-md">
          <h2 className="text-3xl font-semibold mb-4">
            Manage your network effortlessly
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed">
            Monitor MikroTik devices, automate billing, and control your ISP
            infrastructure — all in one place.
          </p>
        </div>
      </div>
    </div>
  );
}