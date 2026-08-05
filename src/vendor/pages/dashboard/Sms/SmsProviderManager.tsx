import React, { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import type { SMSProvider, SMSProviderType, TestSMSPayload, TestSMSResponse } from "./types/sms";
import {
  fetchSMSProviders,
  createSMSProvider,
  updateSMSProvider,
  deleteSMSProvider,
  toggleActiveSMSProvider,
  testSMSProvider, // Ensure testSMSProvider function is exported from ./api/sms
} from "./api/sms";

const PROVIDER_DEFAULTS: Record<SMSProviderType, string> = {
  BYTEWAVE: import.meta.env.VITE_BYTEWAVE || "https://portal.bytewavenetworks.com/api/http/sms/send",
  AFRICAS_TALKING: import.meta.env.VITE_AFRICAS_TALKING || "https://api.africastalking.com/version1/messaging",
  TWILIO: import.meta.env.VITE_TWILIO || "https://api.twilio.com/2010-04-01/Accounts",
  GENERIC_HTTP: import.meta.env.VITE_GENERIC_HTTP || "",
};

export const SMSProviderManager: React.FC = () => {
  const [providers, setProviders] = useState<SMSProvider[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showToken, setShowToken] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Testing State
  const [testPayload, setTestPayload] = useState<TestSMSPayload>({
    recipient: "",
    message: "Test message from SMS Gateway Manager.",
  });
  const [selectedTestProvider, setSelectedTestProvider] = useState<number | string>("");
  const [testing, setTesting] = useState<boolean>(false);
  const [testResponse, setTestResponse] = useState<TestSMSResponse | null>(null);

  const [formData, setFormData] = useState<SMSProvider>({
    provider_type: "BYTEWAVE",
    sender_id: "",
    api_token: "",
    api_url: PROVIDER_DEFAULTS.BYTEWAVE,
    is_active: true,
  });

  const loadProviders = async () => {
    setLoading(true);
    try {
      const data = await fetchSMSProviders();
      setProviders(data);
      if (data.length > 0 && !selectedTestProvider) {
        const active = data.find((p) => p.is_active) || data[0];
        if (active.id) setSelectedTestProvider(active.id);
      }
    } catch (err: any) {
      showFeedback("error", err?.message || "Failed to load SMS providers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const showFeedback = (type: "success" | "error", text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name === "provider_type") {
      const selectedType = value as SMSProviderType;
      setFormData((prev) => ({
        ...prev,
        provider_type: selectedType,
        api_url: PROVIDER_DEFAULTS[selectedType] || prev.api_url,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleEdit = (provider: SMSProvider) => {
    if (provider.id) {
      setEditingId(provider.id);
      setFormData({
        provider_type: provider.provider_type,
        sender_id: provider.sender_id,
        api_token: "", // Kept blank unless updating token
        api_url: provider.api_url,
        is_active: provider.is_active,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      provider_type: "BYTEWAVE",
      sender_id: "",
      api_token: "",
      api_url: PROVIDER_DEFAULTS.BYTEWAVE,
      is_active: true,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        const payload = { ...formData };
        if (!payload.api_token) delete payload.api_token;

        await updateSMSProvider(editingId, payload);
        showFeedback("success", "SMS provider updated successfully.");
      } else {
        await createSMSProvider(formData);
        showFeedback("success", "SMS provider created successfully.");
      }

      handleCancelEdit();
      loadProviders();
    } catch (err: any) {
      showFeedback("error", err?.message || "Operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await toggleActiveSMSProvider(id);
      showFeedback("success", "Gateway activated successfully.");
      loadProviders();
    } catch (err: any) {
      showFeedback("error", "Failed to switch active gateway.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this gateway?")) return;
    try {
      await deleteSMSProvider(id);
      showFeedback("success", "Gateway deleted.");
      loadProviders();
    } catch (err: any) {
      showFeedback("error", "Failed to delete configuration.");
    }
  };

  const handleRunTest = async (e: FormEvent) => {
    e.preventDefault();
    if (!testPayload.recipient || !testPayload.message) {
      showFeedback("error", "Recipient number and message are required for testing.");
      return;
    }
    setTesting(true);
    setTestResponse(null);

    try {
      const providerId = selectedTestProvider ? Number(selectedTestProvider) : undefined;
      const res = await testSMSProvider(testPayload, providerId);
      setTestResponse(res);
      if (res.success) {
        showFeedback("success", "Test SMS dispatched successfully.");
      } else {
        showFeedback("error", res.message || "Test message failed.");
      }
    } catch (err: any) {
      setTestResponse({
        success: false,
        message: err?.message || "An unexpected error occurred during testing.",
      });
      showFeedback("error", err?.message || "Test failed.");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">SMS Gateway Management</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Configure, activate, and test API SMS gateways.</p>
        </div>
      </div>

      {/* Alert Messaging */}
      {feedback && (
        <div
          className={`p-4 mb-6 rounded-lg text-sm flex items-center justify-between border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60"
              : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60"
          }`}
        >
          <span>{feedback.text}</span>
          <button
            onClick={() => setFeedback(null)}
            className="ml-4 font-bold hover:opacity-75"
          >
            ✕
          </button>
        </div>
      )}

      {/* Configuration Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl p-5 sm:p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
          {editingId ? "Edit SMS Gateway" : "Add SMS Gateway"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Provider Type
              </label>
              <select
                name="provider_type"
                value={formData.provider_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                <option value="BYTEWAVE">Bytewave Networks</option>
                <option value="AFRICAS_TALKING">Africa's Talking</option>
                <option value="TWILIO">Twilio</option>
                <option value="GENERIC_HTTP">Custom HTTP Gateway</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Sender ID / Shortcode
              </label>
              <input
                type="text"
                name="sender_id"
                value={formData.sender_id}
                onChange={handleInputChange}
                placeholder="e.g. VegoNet"
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              API Endpoint URL
            </label>
            <input
              type="url"
              name="api_url"
              value={formData.api_url}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              API Token / Secret Key{" "}
              {editingId && <span className="normal-case font-normal text-slate-500 dark:text-slate-400">(Leave blank to retain current)</span>}
            </label>
            <div className="flex gap-2">
              <input
                type={showToken ? "text" : "password"}
                name="api_token"
                value={formData.api_token}
                onChange={handleInputChange}
                required={!editingId}
                placeholder="Paste API Secret / Token"
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="px-4 py-2 text-sm font-medium border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                {showToken ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 dark:bg-slate-800"
              />
              <span>Set as default active gateway</span>
            </label>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? "Saving..." : editingId ? "Update Configuration" : "Save Gateway"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Configured Gateways List */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200">Configured Gateways</h3>
        {loading ? (
          <div className="p-6 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            Loading gateways...
          </div>
        ) : providers.length === 0 ? (
          <div className="p-6 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            No SMS gateways configured yet.
          </div>
        ) : (
          <div className="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">Sender ID</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {providers.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                      {p.provider_type_display || p.provider_type}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{p.sender_id}</td>
                    <td className="px-4 py-3">
                      {p.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Active Default
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                      {!p.is_active && p.id && (
                        <button
                          onClick={() => handleToggleActive(p.id!)}
                          title="Set as active default gateway"
                          className="p-1.5 inline-flex items-center justify-center text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors"
                        >
                          {/* Active Power/Check Icon Replacement */}
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(p)}
                        title="Edit configuration"
                        className="p-1.5 inline-flex items-center justify-center text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      {p.id && (
                        <button
                          onClick={() => handleDelete(p.id!)}
                          title="Delete provider"
                          className="p-1.5 inline-flex items-center justify-center text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Testing Interface */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Test SMS Dispatch
          </h3>
          <span className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-medium px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-800">
            Interactive Test Console
          </span>
        </div>

        <form onSubmit={handleRunTest} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Target Gateway
              </label>
              <select
                value={selectedTestProvider}
                onChange={(e) => setSelectedTestProvider(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Use Active Default Gateway</option>
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.provider_type_display || p.provider_type} ({p.sender_id}) {p.is_active ? "— Active" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Recipient Phone Number
              </label>
              <input
                type="text"
                value={testPayload.recipient}
                onChange={(e) => setTestPayload((prev) => ({ ...prev, recipient: e.target.value }))}
                placeholder="e.g. +254712345678"
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Test Message Body
            </label>
            <textarea
              rows={2}
              value={testPayload.message}
              onChange={(e) => setTestPayload((prev) => ({ ...prev, message: e.target.value }))}
              required
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={testing}
            className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg transition-colors disabled:opacity-50"
          >
            {testing ? "Dispatching Test SMS..." : "Send Test SMS"}
          </button>
        </form>

        {/* Live Response Payload Visualizer */}
        {testResponse && (
          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Gateway Response Dump
            </h4>
            <div className="p-3 bg-slate-950 text-emerald-400 rounded-lg font-mono text-xs overflow-x-auto">
              <pre>{JSON.stringify(testResponse, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};