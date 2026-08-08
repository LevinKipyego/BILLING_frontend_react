import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Router,
  CreditCard,
  MessageSquare,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Server,
} from "lucide-react";

type OnboardingStep = 1 | 2 | 3;

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState<OnboardingStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form States
  const [mikrotik, setMikrotik] = useState({
    name: "",
    host: "",
    apiPort: "8728",
    username: "",
    password: "",
  });

  const [mpesa, setMpesa] = useState({
    shortcode: "",
    consumerKey: "",
    consumerSecret: "",
    passkey: "",
    env: "sandbox",
  });

  const [sms, setSms] = useState({
    apiKey: "",
    partnerId: "",
    senderId: "",
  });

  const handleNextStep = () => {
    setError(null);
    if (step === 1) {
      if (!mikrotik.host || !mikrotik.username || !mikrotik.password) {
        setError("Please fill in all required MikroTik fields.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!mpesa.shortcode || !mpesa.consumerKey || !mpesa.consumerSecret) {
        setError("Please complete all required M-Pesa configuration fields.");
        return;
      }
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setError(null);
    if (step > 1) {
      setStep((prev) => (prev - 1) as OnboardingStep);
    }
  };

  const handleCompleteSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!sms.apiKey || !sms.partnerId) {
      setError("Please provide your SMS Gateway credentials.");
      return;
    }

    setIsSubmitting(true);

    try {
      // API call to persist configurations on your backend
      const response = await fetch("/#", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          mikrotik,
          mpesa,
          sms,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Failed to complete onboarding.");
      }

      // Mark onboarding complete in local storage
      localStorage.setItem("onboarding_complete", "true");

      // Notify AuthWatcher via storage event / custom event
      window.dispatchEvent(new Event("auth-changed"));

      // Navigate to operational dashboard
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.message || "An error occurred during onboarding.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-100 flex flex-col items-center justify-center p-4 select-none">
      <div className="w-full max-w-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-2">
            <Server className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">System Onboarding</h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Configure your core connections before entering the platform to prevent RouterOS API and M-Pesa runtime exceptions.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 gap-2 border-b border-slate-800 pb-4 text-xs font-medium">
          <div
            className={`flex items-center gap-2 pb-1 border-b-2 transition-colors ${
              step === 1
                ? "border-blue-500 text-blue-400"
                : step > 1
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-500"
            }`}
          >
            <Router className="w-4 h-4" />
            <span>1. MikroTik</span>
          </div>

          <div
            className={`flex items-center gap-2 pb-1 border-b-2 transition-colors ${
              step === 2
                ? "border-blue-500 text-blue-400"
                : step > 2
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-500"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>2. M-Pesa</span>
          </div>

          <div
            className={`flex items-center gap-2 pb-1 border-b-2 transition-colors ${
              step === 3
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-500"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>3. SMS Gateway</span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Card Body */}
        <div className="border border-slate-800 rounded-xl p-6 bg-[#121721] shadow-2xl space-y-5">
          
          {/* STEP 1: MIKROTIK ROUTER SETUP */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h2 className="text-sm font-semibold text-slate-200">Primary RouterOS API Settings</h2>
                <p className="text-xs text-slate-400">Required for customer bandwidth control and PPPoE/Hotspot sessions.</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block mb-1 text-slate-300">Router Name / Alias</label>
                  <input
                    type="text"
                    placeholder="Core-Router-01"
                    className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                    value={mikrotik.name}
                    onChange={(e) => setMikrotik({ ...mikrotik, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block mb-1 text-slate-300">IP / Hostname *</label>
                    <input
                      type="text"
                      placeholder="192.168.88.1 or domain"
                      className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                      value={mikrotik.host}
                      onChange={(e) => setMikrotik({ ...mikrotik, host: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-300">API Port</label>
                    <input
                      type="text"
                      placeholder="8728"
                      className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                      value={mikrotik.apiPort}
                      onChange={(e) => setMikrotik({ ...mikrotik, apiPort: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block mb-1 text-slate-300">API User *</label>
                    <input
                      type="text"
                      placeholder="admin"
                      className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                      value={mikrotik.username}
                      onChange={(e) => setMikrotik({ ...mikrotik, username: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-300">API Password *</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                      value={mikrotik.password}
                      onChange={(e) => setMikrotik({ ...mikrotik, password: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: MPESA CONFIGURATION */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h2 className="text-sm font-semibold text-slate-200">Safaricom M-Pesa Integration</h2>
                <p className="text-xs text-slate-400">Enables automated C2B payments & STK Push subscription renewals.</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block mb-1 text-slate-300">Paybill / Till Number *</label>
                    <input
                      type="text"
                      placeholder="400000"
                      className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                      value={mpesa.shortcode}
                      onChange={(e) => setMpesa({ ...mpesa, shortcode: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-300">Environment</label>
                    <select
                      className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                      value={mpesa.env}
                      onChange={(e) => setMpesa({ ...mpesa, env: e.target.value })}
                    >
                      <option value="sandbox">Sandbox (Testing)</option>
                      <option value="production">Production</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-slate-300">Consumer Key *</label>
                  <input
                    type="text"
                    placeholder="Enter Safaricom Consumer Key"
                    className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                    value={mpesa.consumerKey}
                    onChange={(e) => setMpesa({ ...mpesa, consumerKey: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-300">Consumer Secret *</label>
                  <input
                    type="password"
                    placeholder="Enter Safaricom Consumer Secret"
                    className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                    value={mpesa.consumerSecret}
                    onChange={(e) => setMpesa({ ...mpesa, consumerSecret: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-300">Online Passkey (STK Push)</label>
                  <input
                    type="password"
                    placeholder="Optional for C2B only, required for STK"
                    className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                    value={mpesa.passkey}
                    onChange={(e) => setMpesa({ ...mpesa, passkey: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SMS GATEWAY SETUP */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h2 className="text-sm font-semibold text-slate-200">SMS Gateway Credentials</h2>
                <p className="text-xs text-slate-400">Used for sending hotspot vouchers, payment receipts, and expiry notices.</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block mb-1 text-slate-300">Partner ID / User ID *</label>
                  <input
                    type="text"
                    placeholder="e.g., 2041"
                    className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                    value={sms.partnerId}
                    onChange={(e) => setSms({ ...sms, partnerId: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-300">API Key *</label>
                  <input
                    type="password"
                    placeholder="Enter Gateway API Key"
                    className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                    value={sms.apiKey}
                    onChange={(e) => setSms({ ...sms, apiKey: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-300">Sender ID / Header</label>
                  <input
                    type="text"
                    placeholder="e.g., VEEGOSTEMS"
                    className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                    value={sms.senderId}
                    onChange={(e) => setSms({ ...sms, senderId: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 border border-slate-700 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
              >
                Continue <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCompleteSetup}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  "Saving Configurations..."
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Complete Setup
                  </>
                )}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}