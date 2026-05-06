import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://192.168.100.88:8000/api/vendors/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, location, password }),
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 dark:bg-[#0b0f19]">

      {/* LEFT SIDE */}
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Create your account
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Start managing your network today
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name */}
            <LineInput
              icon={User}
              label="Full name"
              value={name}
              onChange={setName}
              type="text"
              placeholder="John Doe"
            />

            {/* Phone + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <LineInput
                icon={Phone}
                label="Phone"
                value={phone}
                onChange={setPhone}
                type="tel"
                placeholder="254..."
              />

              <LineInput
                icon={Mail}
                label="Email"
                value={email}
                onChange={setEmail}
                type="email"
                placeholder="you@example.com"
              />
            </div>

            {/* Location */}
            <LineInput
              icon={MapPin}
              label="Location"
              value={location}
              onChange={setLocation}
              type="text"
              placeholder="City / HQ"
            />

            {/* Password */}
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">
                Password
              </label>

              <div className="flex items-center border-b border-gray-300 dark:border-gray-700 focus-within:border-blue-600 transition mt-1">
                <Lock className="w-4 h-4 text-gray-400 mr-3" />

                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-transparent py-2 text-sm outline-none text-gray-900 dark:text-white"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create account <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-sm text-center text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-12">
        <div className="max-w-md">
          <h2 className="text-3xl font-semibold mb-4">
            Build your ISP platform
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed">
            Automate billing, control MikroTik devices, and monitor your
            infrastructure from a single dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

/* 🔹 Reusable Line Input */
const LineInput = ({
  icon: Icon,
  label,
  value,
  onChange,
  type,
  placeholder,
}: any) => (
  <div>
    <label className="text-sm text-gray-600 dark:text-gray-400">
      {label}
    </label>

    <div className="flex items-center border-b border-gray-300 dark:border-gray-700 focus-within:border-blue-600 transition mt-1">
      <Icon className="w-4 h-4 text-gray-400 mr-3" />

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="w-full bg-transparent py-2 text-sm outline-none text-gray-900 dark:text-white"
      />
    </div>
  </div>
);

export default Signup;