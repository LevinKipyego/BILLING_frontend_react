import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ArrowLeftIcon,
  CpuChipIcon,
  CheckBadgeIcon
} from "@heroicons/react/24/outline";

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
    <div className="flex min-h-screen bg-white">
      {/* LEFT SIDE: Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-12 xl:px-24">
        
        {/* Back to Home */}
        <Link to="/" className="group mb-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
          <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Create Vendor Account
          </h1>
          <p className="mt-2 text-gray-500">
            Join the elite ISP vendors managing with VendHub.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100 flex items-center gap-3">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold">!</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Phone</label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  placeholder="254..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Email</label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Business Location</label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="City, Country"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Password</label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-12 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all"
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
            className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:bg-blue-300"
          >
            {loading ? "Creating Account..." : "Create Vendor Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-blue-600 hover:underline underline-offset-4">
            Sign in here
          </Link>
        </p>
      </div>

      {/* RIGHT SIDE: Branding/Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 items-center justify-center relative overflow-hidden p-12 text-white">
        {/* Abstract Background patterns */}
        <div className="absolute top-[-10%] right-[-10%] h-96 w-96 rounded-full bg-blue-500 blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] h-96 w-96 rounded-full bg-indigo-600 blur-3xl opacity-50" />

        <div className="relative z-10 max-w-md">
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
            <CpuChipIcon className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold leading-tight">
            Scale your ISP business with automation.
          </h2>
          <div className="mt-8 space-y-6">
            <FeatureItem text="Automated M-Pesa Verification" />
            <FeatureItem text="Cloud MikroTik Management" />
            <FeatureItem text="Encrypted API Storage" />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3">
    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
      <CheckBadgeIcon className="h-4 w-4 text-white" />
    </div>
    <span className="text-lg text-blue-100 font-medium">{text}</span>
  </div>
);

export default Signup;