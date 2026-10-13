import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  getMpesaConfig,
  createMpesaConfig,
  updateMpesaConfig,
  deleteMpesaConfig,
  testMpesaConfig,
} from "../../api/mpesa";
import type { MpesaConfigPayload } from "../../api/mpesa";

import { 
  ShieldCheckIcon, 
  TrashIcon, 
  GlobeAltIcon, 
  ArrowPathIcon,
  PlusIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CommandLineIcon,
  PaperAirplaneIcon,
  ChevronDownIcon,
  PencilSquareIcon,
  LockClosedIcon,
  ServerIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
  LinkIcon
} from "@heroicons/react/24/outline";
import { apiFetch } from "../../api/client";
type MpesaEnvironment = "SANDBOX" | "PRODUCTION";
type FormSection = "credentials" | "security" | "callback" | null;

export default function Mpesa() {
  const [loading, setLoading] = useState<boolean>(true);
  const [configs, setConfigs] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showSecrets, setShowSecrets] = useState<{ [key: string]: boolean }>({});
  const [registeringC2B, setRegisteringC2B] = useState<boolean>(false);

  // Form Section Accordion State
  const [formSection, setFormSection] = useState<FormSection>("credentials");

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [envFilter, setEnvFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form State (Updated with initiator_name and is_url_registered)
  const [form, setForm] = useState({
    business_shortcode: "",
    initiator_name: "",
    passkey: "",
    consumer_key: "",
    consumer_secret: "",
    b2c_security_credential: "",
    callback_url: "",
    environment: "SANDBOX" as MpesaEnvironment,
    is_url_registered: false,
  });

  // STK Push Tester Terminal State
  const [activeTestConfig, setActiveTestConfig] = useState<any>(null);
  const [testPhoneNumber, setTestPhoneNumber] = useState("");
  const [testAmount, setTestAmount] = useState("1");
  const [testIsSandbox, setTestIsSandbox] = useState(true);
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [testError, setTestError] = useState("");

  const loadConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMpesaConfig();
      if (data && data.business_shortcode) {
        setConfigs([data]);
        setForm({
          business_shortcode: data.business_shortcode || "",
          initiator_name: data.initiator_name || "",
          callback_url: data.callback_url || "",
          environment: (data.environment as MpesaEnvironment) || "SANDBOX",
          passkey: "",
          consumer_key: "",
          consumer_secret: "",
          b2c_security_credential: data.b2c_security_credential || "",
          is_url_registered: data.is_url_registered || false,
        });
      } else {
        setConfigs([]);
        setIsEditing(true);
      }
    } catch (err: any) {
      setConfigs([]);
      setIsEditing(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const toggleSecret = (field: string) => {
    setShowSecrets((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const filteredConfigs = useMemo(() => {
    return configs.filter((c) => {
      const matchesSearch =
        (c.business_shortcode || "").includes(searchTerm) ||
        (c.callback_url || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEnv =
        envFilter === "ALL" || (c.environment || "").toUpperCase() === envFilter.toUpperCase();
      return matchesSearch && matchesEnv;
    });
  }, [configs, searchTerm, envFilter]);

  const totalPages = Math.ceil(filteredConfigs.length / itemsPerPage);
  const paginatedConfigs = filteredConfigs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, envFilter]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    try {
      const exists = configs.length > 0;
      if (exists) {
        await updateMpesaConfig(form as MpesaConfigPayload);
      } else {
        await createMpesaConfig(form as MpesaConfigPayload);
      }
      setIsEditing(false);
      setSuccessMessage("Configuration saved successfully.");
      loadConfig();
    } catch (err: any) {
      setError(err?.message || "An error occurred while saving configuration.");
    }
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure? This will disable automated M-Pesa payments.")) return;
    setError(null);
    setSuccessMessage(null);
    try {
      await deleteMpesaConfig();
      setConfigs([]);
      setIsEditing(true);
      setSuccessMessage("Configuration deleted.");
    } catch (err: any) {
      setError(err?.message || "Failed to delete configuration.");
    }
  }

  
    // Handle C2B URL Registration trigger using apiFetch
    const handleRegisterC2BUrls = async () => {
      setError(null);
      setSuccessMessage(null);
      setRegisteringC2B(true);
      try {
        await apiFetch('/v1/c2b/register_url/', {
          method: 'POST',
        });

        setSuccessMessage("C2B validation and confirmation URLs registered successfully!");
        loadConfig(); // Reload to update is_url_registered status
      } catch (err: any) {
        setError(err?.message || "Failed to register C2B URLs.");
      } finally {
        setRegisteringC2B(false);
      }
  };

  const openTesterTerminal = (config: any) => {
    setActiveTestConfig(config);
    setTestIsSandbox((config.environment || "SANDBOX").toUpperCase() !== "PRODUCTION");
    setTestPhoneNumber("");
    setTestAmount("1");
    setTestResult(null);
    setTestError("");
  };

  const handleRunStkTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTestConfig) return;

    setTestLoading(true);
    setTestResult(null);
    setTestError("");

    const payload = {
      business_shortcode: activeTestConfig.business_shortcode,
      phone_number: testPhoneNumber.trim(),
      amount: testAmount.trim(),
      is_sandbox: testIsSandbox,
    };

    try {
      const data = await testMpesaConfig(payload as any);
      setTestResult(data);
    } catch (err: any) {
      setTestError(err?.message || "Execution request failed.");
    } finally {
      setTestLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[350px] text-slate-400">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500 mr-2.5"></div>
        <span className="text-xs sm:text-sm">Loading M-Pesa gateway parameters...</span>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-[1600px] mx-auto text-slate-800 dark:text-slate-200">
      
      {/* Top Header & Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-gray-700 pb-3.5">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheckIcon className="h-5 w-5 text-indigo-500" />
            M-Pesa Gateway
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage Daraja API credentials, callback pipelines, C2B URL registrations, and STK push configurations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadConfig}
            className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800 transition flex items-center gap-1.5"
          >
            <ArrowPathIcon className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </button>
          {!isEditing && configs.length === 0 && (
            <button
              onClick={() => {
                setIsEditing(true);
                setFormSection("credentials");
              }}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5 shadow-sm"
            >
              <PlusIcon className="h-3.5 w-3.5" />
              <span>Add Configuration</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-xs sm:text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="underline hover:text-red-500 font-medium text-xs ml-3">
            Dismiss
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm flex items-center justify-between">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} className="underline hover:text-emerald-500 font-medium text-xs ml-3">
            Dismiss
          </button>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg p-3.5 sm:p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:max-w-xs">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search shortcode or callback URL..."
              className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-gray-700 w-full sm:w-auto">
            <FunnelIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <select
              className="bg-transparent text-xs sm:text-sm text-slate-700 dark:text-slate-200 outline-none cursor-pointer w-full"
              value={envFilter}
              onChange={(e) => setEnvFilter(e.target.value)}
            >
              <option value="ALL">All Environments</option>
              <option value="PRODUCTION">Production</option>
              <option value="SANDBOX">Sandbox</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400">
          Showing {filteredConfigs.length} gateway record(s)
        </div>
      </div>

      {/* --- ACCORDION CONFIG FORM MODAL --- */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3.5 dark:border-gray-800 dark:bg-gray-900/50">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {configs.length > 0 ? "Update Gateway" : "Provision New"}
                </span>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {configs.length > 0 ? "Edit M-Pesa Configuration" : "New M-Pesa Integration Setup"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-gray-800"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-4 sm:p-5 space-y-3">
              <div className="rounded-lg border border-slate-200 dark:border-gray-800 overflow-hidden divide-y divide-slate-200 dark:divide-gray-800">
                
                {/* 1. Credentials Section */}
                <div>
                  <button
                    type="button"
                    onClick={() => setFormSection(formSection === "credentials" ? null : "credentials")}
                    className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-gray-800/50"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                        <ServerIcon className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                          1. Core Credentials & Environment
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {form.business_shortcode ? `Shortcode: ${form.business_shortcode}` : "Enter shortcode, initiator name & environment"}
                        </p>
                      </div>
                    </div>
                    <ChevronDownIcon className={`h-4 w-4 text-slate-400 transition-transform ${formSection === "credentials" ? "rotate-180" : ""}`} />
                  </button>

                  {formSection === "credentials" && (
                    <div className="space-y-3 px-4 pb-4 pt-1">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Business Shortcode <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500"
                          placeholder="e.g. 174379"
                          value={form.business_shortcode}
                          onChange={(e) => setForm({ ...form, business_shortcode: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Initiator Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500"
                          placeholder="e.g. testapi"
                          value={form.initiator_name}
                          onChange={(e) => setForm({ ...form, initiator_name: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Environment Mode <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500"
                          value={form.environment}
                          onChange={(e) => setForm({ ...form, environment: e.target.value as MpesaEnvironment })}
                        >
                          <option value="SANDBOX">SANDBOX (Testing)</option>
                          <option value="PRODUCTION">PRODUCTION (Live)</option>
                        </select>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => setFormSection("security")}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition flex items-center gap-1"
                        >
                          <span>Continue to Security</span>
                          <ArrowRightIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Security Section */}
                <div>
                  <button
                    type="button"
                    onClick={() => setFormSection(formSection === "security" ? null : "security")}
                    className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-gray-800/50"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                        <LockClosedIcon className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                          2. API Keys & Secrets
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {form.passkey ? "Passkey provided" : "Passkey, consumer keys & security credentials"}
                        </p>
                      </div>
                    </div>
                    <ChevronDownIcon className={`h-4 w-4 text-slate-400 transition-transform ${formSection === "security" ? "rotate-180" : ""}`} />
                  </button>

                  {formSection === "security" && (
                    <div className="space-y-3 px-4 pb-4 pt-1">
                      {[
                        { label: "Passkey", key: "passkey" },
                        { label: "Consumer Key", key: "consumer_key" },
                        { label: "Consumer Secret", key: "consumer_secret" },
                        { label: "B2C Security Credential", key: "b2c_security_credential" },
                      ].map((field) => (
                        <div key={field.key}>
                          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                            {field.label} {configs.length === 0 && <span className="text-red-500">*</span>}
                          </label>
                          <div className="relative">
                            <input
                              type={showSecrets[field.key] ? "text" : "password"}
                              className="w-full px-3 py-2 pr-10 bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500"
                              placeholder="••••••••••••"
                              value={(form as any)[field.key]}
                              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                              required={configs.length === 0}
                            />
                            <button
                              type="button"
                              onClick={() => toggleSecret(field.key)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500"
                            >
                              {showSecrets[field.key] ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="flex items-center justify-between pt-2">
                        <button
                          type="button"
                          onClick={() => setFormSection("credentials")}
                          className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 font-medium"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormSection("callback")}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition flex items-center gap-1"
                        >
                          <span>Continue to Callback</span>
                          <ArrowRightIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Callback URL Section */}
                <div>
                  <button
                    type="button"
                    onClick={() => setFormSection(formSection === "callback" ? null : "callback")}
                    className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-gray-800/50"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                        <GlobeAltIcon className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                          3. Callback Endpoint
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {form.callback_url ? "URL configured" : "Set transaction callback URL"}
                        </p>
                      </div>
                    </div>
                    <ChevronDownIcon className={`h-4 w-4 text-slate-400 transition-transform ${formSection === "callback" ? "rotate-180" : ""}`} />
                  </button>

                  {formSection === "callback" && (
                    <div className="space-y-3 px-4 pb-4 pt-1">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Callback URL <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg text-xs font-mono text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500"
                          placeholder="https://api.yourdomain.com/mpesa/callback"
                          value={form.callback_url}
                          onChange={(e) => setForm({ ...form, callback_url: e.target.value })}
                          required
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-gray-800">
                        <button
                          type="button"
                          onClick={() => setFormSection("security")}
                          className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 font-medium"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition shadow-sm"
                        >
                          {configs.length > 0 ? "Update Gateway" : "Save Configuration"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- STK PUSH TESTER TERMINAL MODAL --- */}
      {activeTestConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3.5 dark:border-gray-800 dark:bg-gray-900/50">
              <div className="flex items-center gap-2">
                <CommandLineIcon className="h-4 w-4 text-emerald-500" />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  STK Push Diagnostic Terminal
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveTestConfig(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-gray-800"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleRunStkTest} className="p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-800/60 rounded-lg border border-slate-200 dark:border-gray-700 text-xs">
                <span>
                  Shortcode: <strong className="font-mono text-indigo-600 dark:text-indigo-400">{activeTestConfig.business_shortcode}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold uppercase ${testIsSandbox ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                    Sandbox
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={!testIsSandbox}
                      onChange={(e) => setTestIsSandbox(!e.target.checked)}
                    />
                    <div className="w-8 h-4 bg-indigo-600 peer-focus:outline-none rounded-full peer dark:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                  <span className={`text-[10px] font-semibold uppercase ${!testIsSandbox ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'}`}>
                    Live
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="254712345678"
                    value={testPhoneNumber}
                    onChange={(e) => setTestPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Amount (KES) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="1"
                    value={testAmount}
                    onChange={(e) => setTestAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              {testError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-600 dark:text-red-400">
                  {testError}
                </div>
              )}

              {testResult && (
                <div className="space-y-1">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Response Payload</span>
                  <pre className="p-3 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-lg overflow-x-auto max-h-40 border border-slate-800 leading-relaxed">
                    {JSON.stringify(testResult, null, 2)}
                  </pre>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setActiveTestConfig(null)}
                  className="px-3 py-1.5 border border-slate-300 dark:border-gray-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-50 dark:hover:bg-gray-800 transition"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={testLoading}
                  className={`px-4 py-1.5 text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5 shadow-sm ${
                    testIsSandbox ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {testLoading ? <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" /> : <PaperAirplaneIcon className="h-3.5 w-3.5" />}
                  <span>{testLoading ? "Executing..." : "Trigger STK Push"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Configurations Hybrid Card List (Mobile) & Table (Desktop) */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
        
        {/* MOBILE VIEW: Clean, non-bulky stacked cards */}
        <div className="block md:hidden divide-y divide-slate-200 dark:divide-gray-800">
          {paginatedConfigs.length > 0 ? (
            paginatedConfigs.map((config, idx) => (
              <div key={idx} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-medium block">Shortcode / Initiator</span>
                    <span className="font-mono font-semibold text-sm text-slate-900 dark:text-white">
                      {config.business_shortcode} <span className="text-xs text-slate-500">({config.initiator_name || 'N/A'})</span>
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${
                    (config.environment || "").toLowerCase() === 'production'
                      ? 'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400'
                      : 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400'
                  }`}>
                    <GlobeAltIcon className="h-3 w-3" />
                    {config.environment}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-medium block">Callback Pipeline</span>
                  <span className="font-mono text-xs text-slate-600 dark:text-slate-300 break-all bg-slate-50 dark:bg-gray-800/50 p-1.5 rounded block mt-0.5">
                    {config.callback_url}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                    config.is_url_registered ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  }`}>
                    <CheckBadgeIcon className="h-3.5 w-3.5" />
                    {config.is_url_registered ? 'C2B URLs Registered' : 'C2B URLs Unregistered'}
                  </span>

                  <button
                    onClick={handleRegisterC2BUrls}
                    disabled={config.is_url_registered || registeringC2B}
                    className={`px-3 py-1 rounded text-xs font-medium transition flex items-center gap-1 ${
                      config.is_url_registered
                        ? 'bg-slate-100 dark:bg-gray-800 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                    }`}
                  >
                    <LinkIcon className="h-3.5 w-3.5" />
                    {registeringC2B ? 'Registering...' : config.is_url_registered ? 'URLs Registered' : 'Register C2B URLs'}
                  </button>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-gray-800/60 text-xs font-medium">
                  <button
                    onClick={() => openTesterTerminal(config)}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                  >
                    <CommandLineIcon className="h-3.5 w-3.5" /> Test STK
                  </button>
                  <button
                    onClick={() => {
                      setForm({ ...config, passkey: "", consumer_key: "", consumer_secret: "" });
                      setFormSection("credentials");
                      setIsEditing(true);
                    }}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                  >
                    <PencilSquareIcon className="h-3.5 w-3.5" /> Modify
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-red-600 dark:text-red-400 hover:underline inline-flex items-center gap-1"
                  >
                    <TrashIcon className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs italic">
              No active M-Pesa gateway configuration found.
            </div>
          )}
        </div>

        {/* DESKTOP VIEW: Clean high-density table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-800 dark:text-slate-200">
            <thead className="bg-slate-50 dark:bg-gray-800/60 text-[10px] text-slate-400 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3.5">Shortcode / Initiator</th>
                <th className="px-4 py-3.5">Environment</th>
                <th className="px-4 py-3.5">Callback Pipeline</th>
                <th className="px-4 py-3.5">C2B Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
              {paginatedConfigs.length > 0 ? (
                paginatedConfigs.map((config, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-gray-800/40 transition">
                    <td className="px-4 py-3 font-mono font-medium text-slate-900 dark:text-white">
                      {config.business_shortcode}
                      <span className="block text-[11px] text-slate-500 font-normal">Init: {config.initiator_name || 'N/A'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${
                        (config.environment || "").toLowerCase() === 'production'
                          ? 'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400'
                          : 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400'
                      }`}>
                        <GlobeAltIcon className="h-3 w-3" />
                        {config.environment}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
                      {config.callback_url}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                          config.is_url_registered ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}>
                          <CheckBadgeIcon className="h-3 w-3" />
                          {config.is_url_registered ? 'Registered' : 'Unregistered'}
                        </span>
                        <button
                          onClick={handleRegisterC2BUrls}
                          disabled={config.is_url_registered || registeringC2B}
                          className={`px-2.5 py-1 rounded text-[11px] font-medium transition flex items-center gap-1 ${
                            config.is_url_registered
                              ? 'bg-slate-100 dark:bg-gray-800 text-slate-400 cursor-not-allowed'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                          }`}
                        >
                          <LinkIcon className="h-3 w-3" />
                          {registeringC2B ? 'Registering...' : config.is_url_registered ? 'Registered' : 'Register C2B'}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right space-x-3">
                      <button
                        onClick={() => openTesterTerminal(config)}
                        className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium text-xs inline-flex items-center gap-1"
                      >
                        <CommandLineIcon className="h-3.5 w-3.5" /> Test STK
                      </button>
                      <button
                        onClick={() => {
                          setForm({ ...config, passkey: "", consumer_key: "", consumer_secret: "" });
                          setFormSection("credentials");
                          setIsEditing(true);
                        }}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium text-xs inline-flex items-center gap-1"
                      >
                        <PencilSquareIcon className="h-3.5 w-3.5" /> Modify
                      </button>
                      <button
                        onClick={handleDelete}
                        className="text-red-600 dark:text-red-400 hover:underline font-medium text-xs inline-flex items-center gap-1"
                      >
                        <TrashIcon className="h-3.5 w-3.5" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-400 text-xs italic">
                    No active M-Pesa gateway configuration found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredConfigs.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-200 dark:border-gray-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Page {currentPage} of {totalPages || 1}
            </span>
            <div className="flex gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-2.5 py-1 border border-slate-300 dark:border-gray-700 rounded hover:bg-slate-50 dark:hover:bg-gray-800 disabled:opacity-30 transition flex items-center gap-1"
              >
                <ChevronLeftIcon className="h-3.5 w-3.5" />
                <span>Prev</span>
              </button>
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-2.5 py-1 border border-slate-300 dark:border-gray-700 rounded hover:bg-slate-50 dark:hover:bg-gray-800 disabled:opacity-30 transition flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRightIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}