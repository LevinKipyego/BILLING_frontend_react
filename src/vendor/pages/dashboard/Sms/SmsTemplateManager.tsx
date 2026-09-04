import React, { useState, useEffect, useCallback } from "react";
import type {
  SMSProvider,
  SMSMessage,
  SystemSMSEvent,
  SMSMessageCreatePayload,
} from "./types/sms";
import {
  fetchSMSProviders,
  fetchSMSTemplates,
  createSMSTemplate,
  deleteSMSTemplate,
} from "./api/sms";

const SYSTEM_EVENTS: { label: string; value: SystemSMSEvent }[] = [
  { label: "M-Pesa Payment Success", value: "PAYMENT_SUCCESS" },
  { label: "Voucher Code Generated", value: "VOUCHER_ISSUED" },
  { label: "Smart TV Connected", value: "TV_ACTIVATED" },
  { label: "Access Expiring Soon", value: "EXPIRY_WARNING" },
];

/**
 * Utility to convert UTC timestamps into relative local time strings
 */
const formatRelativeTime = (utcDateString?: string): string => {
  if (!utcDateString) return "—";

  const normalizedUtcString = utcDateString.includes("T")
    ? utcDateString
    : utcDateString.replace(" ", "T") + "Z";

  const date = new Date(normalizedUtcString);

  if (isNaN(date.getTime())) {
    return utcDateString;
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 30) return "just now";
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes > 1 ? "s" : ""} ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hr${diffInHours > 1 ? "s" : ""} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} mo${diffInMonths > 1 ? "s" : ""} ago`;

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} yr${diffInYears > 1 ? "s" : ""} ago`;
};

/**
 * Truncates text to the first specified number of words
 */
const truncateWords = (text: string = "", wordLimit: number = 8): string => {
  if (!text) return "—";
  const words = text.trim().split(/\s+/);
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "...";
};

export const SmsTemplateManager: React.FC = () => {
  const [providers, setProviders] = useState<SMSProvider[]>([]);
  const [templates, setTemplates] = useState<SMSMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const [formData, setFormData] = useState<SMSMessageCreatePayload>({
    provider: 0,
    title: "",
    event: "PAYMENT_SUCCESS",
    content:
      "Hi {name}, payment of KES {amount} received. Voucher: {voucher_code}",
    is_active: true,
  });

  // Load providers and templates from backend APIs
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [providersData, templatesData] = await Promise.all([
        fetchSMSProviders(),
        fetchSMSTemplates(),
      ]);
      setProviders(providersData);
      setTemplates(templatesData);

      // Automatically select first provider ID as default
      const firstProviderId = providersData[0]?.id;
      if (typeof firstProviderId === "number") {
        setFormData((prev) => ({
          ...prev,
          provider: prev.provider || firstProviderId,
        }));
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to load SMS templates or providers."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.provider) {
      alert("Please select a valid SMS Gateway Provider.");
      return;
    }

    setSubmitting(true);
    try {
      await createSMSTemplate(formData);
      setIsCreating(false);
      setFormData({
        provider: providers[0]?.id || 0,
        title: "",
        event: "PAYMENT_SUCCESS",
        content:
          "Hi {name}, payment of KES {amount} received. Voucher: {voucher_code}",
        is_active: true,
      });
      await loadData();
    } catch (err: any) {
      alert(
        err?.response?.data?.detail ||
          "Failed to save template. Make sure the provider is valid."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      try {
        await deleteSMSTemplate(id);
        await loadData();
      } catch (err: any) {
        alert("Failed to delete template.");
      }
    }
  };

  // Resolves human-readable label for provider dropdown option
  const getProviderLabel = (p: SMSProvider) => {
    const providerName = p.provider_type || p.provider_type || `Provider #${p.id}`;
    const extraDetail = p.sender_id || p.shortcode ? ` (${p.shortcode || p.sender_id})` : "";
    return `${providerName}${extraDetail}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mr-3"></div>
        <span>Loading templates...</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto text-slate-800 dark:text-slate-200">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-gray-700 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-medium text-slate-900 dark:text-white">
            SMS Message Templates
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure automated SMS triggers and system notification templates.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm rounded-lg transition-colors shadow-sm"
        >
          {isCreating ? "Cancel" : "+ New Template"}
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={loadData}
            className="underline hover:text-red-500 font-semibold text-xs"
          >
            Retry
          </button>
        </div>
      )}

      {/* Create Template Form */}
      {isCreating && (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg p-5 sm:p-6 space-y-4 shadow-sm"
        >
          <h3 className="text-base font-medium text-slate-900 dark:text-white mb-2">
            Create System SMS Template
          </h3>

          <div className="flex flex-col space-y-1">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Template Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              placeholder="e.g. M-Pesa Receipt SMS"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dynamic SMS Gateway Provider Selection */}
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                SMS Gateway Provider
              </label>
              <select
                value={formData.provider}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    provider: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {providers.length === 0 ? (
                  <option value={0}>No active providers configured</option>
                ) : (
                  providers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {getProviderLabel(p)}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                System Trigger Event
              </label>
              <select
                value={formData.event}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    event: e.target.value as SystemSMSEvent,
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {SYSTEM_EVENTS.map((ev) => (
                  <option key={ev.value} value={ev.value}>
                    {ev.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              SMS Content Body
            </label>
            <textarea
              rows={3}
              required
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full px-3 py-2 bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              💡 Supported Placeholders:{" "}
              <code className="text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-1 py-0.5 rounded">
                {"{amount}"}
              </code>{" "}
              <code className="text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-1 py-0.5 rounded">
                {"{voucher_code}"}
              </code>{" "}
              <code className="text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-1 py-0.5 rounded">
                {"{expires_at}"}
              </code>{" "}
              <code className="text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-1 py-0.5 rounded">
                {"{mac_address}"}
              </code>
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Template"}
            </button>
          </div>
        </form>
      )}

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-gray-800 rounded-lg">
            No SMS templates found. Click "+ New Template" to create one.
          </div>
        ) : (
          templates.map((tpl) => (
            <div
              key={tpl.id}
              className="flex flex-col justify-between bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg p-4 sm:p-5 shadow-sm hover:border-indigo-500/50 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-slate-900 dark:text-white text-sm sm:text-base">
                    {tpl.title}
                  </h3>
                  <span className="shrink-0 px-2 py-0.5 text-[10px] font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded border border-indigo-500/20">
                    {tpl.event_display || tpl.event}
                  </span>
                </div>

                {/* Content Snippet Preview with Tooltip */}
                <div
                  className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-gray-800/60 p-3 rounded-lg font-mono border border-slate-100 dark:border-gray-800 leading-relaxed"
                  title={tpl.content}
                >
                  {truncateWords(tpl.content, 12)}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-4 border-t border-slate-100 dark:border-gray-800 text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex flex-col">
                  <span>
                    Provider: {tpl.provider_name || `#${tpl.provider}`}
                  </span>
                  {(tpl as any).created_at && (
                    <span
                      className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5"
                      title={(tpl as any).created_at}
                    >
                      Updated {formatRelativeTime((tpl as any).created_at)}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(tpl.id)}
                  className="px-2 py-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-500/10 rounded font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SmsTemplateManager;