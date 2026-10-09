import React, {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  Activity,
  Check,
  ChevronDown,
  CircleAlert,
  Eye,
  EyeOff,
  FlaskConical,
  
  Mail,
  MessageSquare,
  
  Radio,
  RefreshCw,
  Send,
  ShieldCheck,
  
  X,
} from "lucide-react";

import type {
  SMSProvider,
  SMSProviderType,
  TestSMSPayload,
  TestSMSResponse,
} from "./types/sms";

import {
  fetchSMSProviders,
  createSMSProvider,
  updateSMSProvider,
  deleteSMSProvider,
  toggleActiveSMSProvider,
  toggleSMSProviderFeature,
  testSMSProvider,
} from "./api/sms";

const PROVIDER_DEFAULTS: Record<SMSProviderType, string> = {
  BYTEWAVE:
    import.meta.env.VITE_BYTEWAVE ||
    "https://portal.bytewavenetworks.com/api/http/sms/send",
  AFRICAS_TALKING:
    import.meta.env.VITE_AFRICAS_TALKING ||
    "https://api.africastalking.com/version1/messaging",
  TALKSASA:
    import.meta.env.VITE_TALKSASA || "https://api.talksasa.com/v1/send/",
  TWILIO:
    import.meta.env.VITE_TWILIO ||
    "https://api.twilio.com/2010-04-01/Accounts",
  GENERIC_HTTP: import.meta.env.VITE_GENERIC_HTTP || "",
};

const DEFAULT_FORM_STATE: SMSProvider = {
  provider_type: "BYTEWAVE",
  sender_id: "",
  api_token: "",
  api_url: PROVIDER_DEFAULTS.BYTEWAVE,
  is_active: true,
  allow_hotspot_password_recovery: true,
  allow_hotspot_purchase_receipts: true,
  allow_pppoe_welcome_sms: true,
  allow_payment_receipts: true,
  allow_expiry_reminders: true,
  allow_bulk_promotions: false,
  allow_renew_message: false,
  allow_DS_message: false,
  allow_cancel_message: false,
};

type FormSection = "gateway" | "credentials" | "notifications" | null;
type TestSection = "gateway" | "recipient" | "message" | null;

const inputClass =
  "h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none transition focus:border-slate-400 dark:border-gray-700 dark:bg-gray-900 dark:text-slate-100 dark:focus:border-gray-500 sm:text-[13px]";

const labelClass =
  "mb-1 block text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500";

const SectionRow = ({
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
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-expanded={open}
    className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50/50 dark:hover:bg-gray-800/40"
  >
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500 dark:bg-gray-800 dark:text-slate-300">
      {complete ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : icon}
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

const FeatureToggle = ({
  name,
  label,
  description,
  checked,
  onChange,
}: {
  name: keyof SMSProvider;
  label: string;
  description: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => (
  <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-slate-200 p-3 transition hover:bg-slate-50/50 dark:border-gray-800 dark:hover:bg-gray-800/40">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
    />
    <span className="min-w-0">
      <span className="block text-xs font-medium text-slate-900 dark:text-white">
        {label}
      </span>
      <span className="mt-0.5 block text-[10px] leading-4 text-slate-500 dark:text-slate-400">
        {description}
      </span>
    </span>
  </label>
);

export const SMSProviderManager: React.FC = () => {
  const [providers, setProviders] = useState<SMSProvider[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showToken, setShowToken] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formSection, setFormSection] = useState<FormSection>("gateway");
  const [testSection, setTestSection] = useState<TestSection>("recipient");
  const [formData, setFormData] = useState<SMSProvider>(DEFAULT_FORM_STATE);

  const [testPayload, setTestPayload] = useState<TestSMSPayload>({
    recipient: "",
    message: "Test message from SMS Gateway Manager.",
  });
  const [selectedTestProvider, setSelectedTestProvider] = useState<number | string>("");
  const [testing, setTesting] = useState(false);
  const [testResponse, setTestResponse] = useState<TestSMSResponse | null>(null);

  const showFeedback = (type: "success" | "error", text: string) => {
    setFeedback({ type, text });
    window.setTimeout(() => setFeedback(null), 4000);
  };

  const loadProviders = async () => {
    setLoading(true);
    try {
      const data = await fetchSMSProviders();
      setProviders(data);
      if (data.length > 0 && !selectedTestProvider) {
        const active = data.find((provider) => provider.is_active) || data[0];
        if (active.id) setSelectedTestProvider(active.id);
      }
    } catch (err: any) {
      showFeedback("error", err?.message || "Failed to load SMS providers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProviders();
  }, []);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = event.target;
    const checked = (event.target as HTMLInputElement).checked;

    if (name === "provider_type") {
      const selectedType = value as SMSProviderType;
      setFormData((previous) => ({
        ...previous,
        provider_type: selectedType,
        api_url: PROVIDER_DEFAULTS[selectedType] || previous.api_url,
      }));
      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (provider: SMSProvider) => {
    if (!provider.id) return;

    setEditingId(provider.id);
    setFormData({
      provider_type: provider.provider_type,
      sender_id: provider.sender_id,
      api_token: "",
      api_url: provider.api_url,
      is_active: provider.is_active,
      allow_hotspot_password_recovery:
        provider.allow_hotspot_password_recovery ?? true,
      allow_hotspot_purchase_receipts:
        provider.allow_hotspot_purchase_receipts ?? true,
      allow_pppoe_welcome_sms: provider.allow_pppoe_welcome_sms ?? true,
      allow_payment_receipts: provider.allow_payment_receipts ?? true,
      allow_expiry_reminders: provider.allow_expiry_reminders ?? true,
      allow_bulk_promotions: provider.allow_bulk_promotions ?? false,
      allow_renew_message: provider.allow_renew_message ?? false,
      allow_DS_message: provider.allow_DS_message ?? false,
      allow_cancel_message: provider.allow_cancel_message ?? false,
    });
    setFormSection("gateway");
    setShowToken(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ ...DEFAULT_FORM_STATE });
    setFormSection("gateway");
    setShowToken(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        const payload = { ...formData };
        if (!payload.api_token) delete payload.api_token;
        await updateSMSProvider(editingId, payload);
        showFeedback("success", "SMS provider configuration updated.");
      } else {
        await createSMSProvider(formData);
        showFeedback("success", "SMS provider created successfully.");
      }

      handleCancelEdit();
      await loadProviders();
    } catch (err: any) {
      showFeedback("error", err?.message || "Operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await toggleActiveSMSProvider(id);
      showFeedback("success", "Default gateway updated.");
      await loadProviders();
    } catch (err: any) {
      showFeedback("error", err?.message || "Failed to switch active gateway.");
    }
  };

  const handleQuickFeatureToggle = async (
    id: number,
    feature:
      | keyof Pick<
          SMSProvider,
          | "is_active"
          | "allow_hotspot_password_recovery"
          | "allow_hotspot_purchase_receipts"
          | "allow_pppoe_welcome_sms"
          | "allow_payment_receipts"
          | "allow_expiry_reminders"
          | "allow_bulk_promotions"
        >
      | "allow_renew_message"
      | "allow_DS_message"
      | "allow_cancel_message",
    currentValue: boolean,
  ) => {
    try {
      await (toggleSMSProviderFeature as (
        providerId: number,
        providerFeature: keyof SMSProvider,
        value: boolean,
      ) => Promise<SMSProvider>)(id, feature as keyof SMSProvider, !currentValue);
      showFeedback("success", "Preference updated.");
      await loadProviders();
    } catch (err: any) {
      showFeedback("error", err?.message || "Failed to update feature toggle.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this gateway configuration?")) {
      return;
    }

    try {
      await deleteSMSProvider(id);
      showFeedback("success", "Gateway deleted.");
      await loadProviders();
    } catch (err: any) {
      showFeedback("error", err?.message || "Failed to delete configuration.");
    }
  };

  const handleRunTest = async (event: FormEvent) => {
    event.preventDefault();
    if (!testPayload.recipient.trim() || !testPayload.message.trim()) {
      showFeedback("error", "Recipient number and message body are required.");
      return;
    }

    setTesting(true);
    setTestResponse(null);

    try {
      const providerId = selectedTestProvider
        ? Number(selectedTestProvider)
        : undefined;
      const response = await testSMSProvider(testPayload, providerId);
      setTestResponse(response);

      if (response.success) {
        showFeedback("success", "Test SMS dispatched successfully.");
      } else {
        showFeedback("error", response.message || "Test message failed.");
      }
    } catch (err: any) {
      const response: TestSMSResponse = {
        success: false,
        message: err?.message || "An unexpected error occurred during testing.",
      };
      setTestResponse(response);
      showFeedback("error", response.message || "Test failed.");
    } finally {
      setTesting(false);
    }
  };

  const toggleFormSection = (section: Exclude<FormSection, null>) => {
    setFormSection((current) => (current === section ? null : section));
  };

  const toggleTestSection = (section: Exclude<TestSection, null>) => {
    setTestSection((current) => (current === section ? null : section));
  };

  return (
    <div className="space-y-3 font-sans text-slate-800 dark:text-slate-200">
      {/* Header Surface Container */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg px-4 sm:px-5 py-3.5 shadow-sm">
        <div className="min-w-0">
          <h2 className="text-sm sm:text-base font-medium text-slate-900 dark:text-white">
            SMS Gateway Manager
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
            Configure messaging provider endpoints, active features, and delivery tests.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadProviders()}
          disabled={loading}
          className="w-full sm:w-auto h-9 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-slate-300 px-3 rounded-lg text-xs font-medium hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          role="status"
          className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-xs ${
            feedback.type === "success"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400"
          }`}
        >
          <span>{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="shrink-0 p-0.5 opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Progressive Form Surface */}
      <section className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-gray-800 px-4 py-3.5 sm:px-5">
          <div>
            <h3 className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white">
              {editingId ? "Edit Gateway Configuration" : "Add New SMS Gateway"}
            </h3>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              Expand a section below to configure your integration settings.
            </p>
          </div>
          {editingId ? (
            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium border border-blue-500/20">
              Editing
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-600 text-white  font-medium border border-blue-500/20">
              New 
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="divide-y divide-slate-100 dark:divide-gray-800">
            {/* Gateway Identity Accordion */}
            <div>
              <SectionRow
                title="Gateway Details"
                description={`${formData.provider_type.replaceAll("_", " ")} · Sender ID: ${formData.sender_id || "Not set"}`}
                open={formSection === "gateway"}
                complete={Boolean(formData.sender_id && formData.provider_type)}
                onClick={() => toggleFormSection("gateway")}
                icon={<Radio className="h-3.5 w-3.5" />}
              />
              {formSection === "gateway" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 px-4 pb-4 sm:px-5 pt-1">
                  <div>
                    <label className={labelClass}>Provider Type</label>
                    <select
                      name="provider_type"
                      value={formData.provider_type}
                      onChange={handleInputChange}
                      className={inputClass}
                    >
                      <option value="BYTEWAVE">Bytewave Networks</option>
                      <option value="AFRICAS_TALKING">Africa's Talking</option>
                      <option value="TALKSASA">Talksasa</option>
                      <option value="TWILIO">Twilio</option>
                      <option value="GENERIC_HTTP">Custom HTTP Gateway</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Sender ID / Shortcode</label>
                    <input
                      name="sender_id"
                      value={formData.sender_id}
                      onChange={handleInputChange}
                      placeholder="e.g. VeegoNet"
                      required
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>API Endpoint URL</label>
                    <input
                      type="url"
                      name="api_url"
                      value={formData.api_url}
                      onChange={handleInputChange}
                      placeholder="https://provider.example/api/send"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Credentials Accordion */}
            <div>
              <SectionRow
                title="API Credentials"
                description={
                  editingId && !formData.api_token
                    ? "Saved secret retained unless replaced"
                    : formData.api_token
                    ? "Secret entered"
                    : "Add API secret or access token"
                }
                open={formSection === "credentials"}
                complete={Boolean(editingId || formData.api_token)}
                onClick={() => toggleFormSection("credentials")}
                icon={<ShieldCheck className="h-3.5 w-3.5" />}
              />
              {formSection === "credentials" && (
                <div className="px-4 pb-4 sm:px-5 pt-1 space-y-3">
                  <div>
                    <label className={labelClass}>API Token / Secret Key</label>
                    <div className="flex gap-2">
                      <input
                        type={showToken ? "text" : "password"}
                        name="api_token"
                        value={formData.api_token}
                        onChange={handleInputChange}
                        required={!editingId}
                        autoComplete="new-password"
                        placeholder={
                          editingId ? "Leave blank to retain saved secret" : "Paste API secret"
                        }
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={() => setShowToken((prev) => !prev)}
                        className="h-9 px-3 border border-slate-200 dark:border-gray-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5 shrink-0"
                      >
                        {showToken ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        <span>{showToken ? "Hide" : "Show"}</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-[11px] text-amber-700 dark:text-amber-400">
                    <CircleAlert className="h-4 w-4 shrink-0 mt-0.5" />
                    <p>
                      <strong>Security Note:</strong> Never paste secrets into shared logs.
                      Leaving this field blank during edits retains your active token.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Notification Rules Accordion */}
            <div>
              <SectionRow
                title="Notification Rules"
                description="Configure automated dispatch categories"
                open={formSection === "notifications"}
                complete
                onClick={() => toggleFormSection("notifications")}
                icon={<MessageSquare className="h-3.5 w-3.5" />}
              />
              {formSection === "notifications" && (
                <div className="space-y-4 px-4 pb-4 sm:px-5 pt-1">
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/40 p-3">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="mt-0.5 h-4 w-4 rounded text-amber-500 focus:ring-amber-500"
                    />
                    <div>
                      <span className="block text-xs font-medium text-slate-900 dark:text-white">
                        Set as Default Gateway
                      </span>
                      <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                        Primary provider used for general automated system broadcasts.
                      </span>
                    </div>
                  </label>

                  <div>
                    <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.07em] text-amber-600 dark:text-amber-400">
                      Hotspot
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <FeatureToggle
                        name="allow_hotspot_password_recovery"
                        label="Password Recovery"
                        description="Send hotspot password codes."
                        checked={Boolean(formData.allow_hotspot_password_recovery)}
                        onChange={handleInputChange}
                      />
                      <FeatureToggle
                        name="allow_hotspot_purchase_receipts"
                        label="Purchase Confirmations"
                        description="Send hotspot purchase receipts."
                        checked={Boolean(formData.allow_hotspot_purchase_receipts)}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.07em] text-emerald-600 dark:text-emerald-400">
                      PPPoE & Billing
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <FeatureToggle
                        name="allow_pppoe_welcome_sms"
                        label="PPPoE Welcome SMS"
                        description="Send welcome details upon account creation."
                        checked={Boolean(formData.allow_pppoe_welcome_sms)}
                        onChange={handleInputChange}
                      />
                      <FeatureToggle
                        name="allow_payment_receipts"
                        label="Payment Receipts"
                        description="Send payment confirmation alerts."
                        checked={Boolean(formData.allow_payment_receipts)}
                        onChange={handleInputChange}
                      />
                      <FeatureToggle
                        name="allow_expiry_reminders"
                        label="Expiry Reminders"
                        description="Warn subscribers prior to expiry."
                        checked={Boolean(formData.allow_expiry_reminders)}
                        onChange={handleInputChange}
                      />
                      <FeatureToggle
                        name="allow_renew_message"
                        label="Renewal Alerts"
                        description="Send service renewal notices."
                        checked={Boolean(formData.allow_renew_message)}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.07em] text-blue-600 dark:text-blue-400">
                      System & Promotions
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <FeatureToggle
                        name="allow_bulk_promotions"
                        label="Bulk Promotions"
                        description="Allow promotional message blasts."
                        checked={Boolean(formData.allow_bulk_promotions)}
                        onChange={handleInputChange}
                      />
                      <FeatureToggle
                        name="allow_DS_message"
                        label="Disconnect Reminders"
                        description="Send timeout/disconnect notifications."
                        checked={Boolean(formData.allow_DS_message)}
                        onChange={handleInputChange}
                      />
                      <FeatureToggle
                        name="allow_cancel_message"
                        label="Cancellation Alerts"
                        description="Notify subscribers upon cancellation."
                        checked={Boolean(formData.allow_cancel_message)}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center px-4 py-3 border-t border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-900">
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {editingId ? "Changes apply to this gateway." : "Gateway settings can be adjusted later."}
            </p>
            <div className="flex gap-2">
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="h-9 px-3.5 border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-medium hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
               className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Saving..." : editingId ? "Update " : "Save Gateway"}
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Configured Gateways Surface Table/Card */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden border border-slate-200 dark:border-gray-700">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center">
          <h3 className="text-xs font-medium text-slate-900 dark:text-white uppercase tracking-wider">
            Configured Gateways ({providers.length})
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs font-mono">Loading gateways...</div>
        ) : providers.length === 0 ? (
          <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
            No SMS gateways configured yet.
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="overflow-x-auto hidden sm:block">
              <table className="w-full text-left text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                <thead className="bg-slate-50 dark:bg-gray-800/60 text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-400 uppercase tracking-[0.07em]">
                  <tr>
                    <th className="p-3.5 font-medium">Provider</th>
                    <th className="p-3.5 font-medium">Sender ID</th>
                    <th className="p-3.5 font-medium">Status</th>
                    <th className="p-3.5 font-medium">Password Recovery</th>
                    <th className="p-3.5 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
                  {providers.map((provider) => (
                    <tr
                      key={provider.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-gray-800/40 transition-colors"
                    >
                      <td className="p-3.5 font-medium text-slate-900 dark:text-white">
                        {provider.provider_type_display || provider.provider_type}
                      </td>
                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">
                        {provider.sender_id}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                            provider.is_active
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                              : "bg-slate-100 dark:bg-gray-800 text-slate-500 border-slate-200 dark:border-gray-700"
                          }`}
                        >
                          {provider.is_active ? "Active Default" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {provider.id && (
                          <button
                            type="button"
                            onClick={() =>
                              void handleQuickFeatureToggle(
                                provider.id!,
                                "allow_hotspot_password_recovery",
                                provider.allow_hotspot_password_recovery,
                              )
                            }
                            className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                              provider.allow_hotspot_password_recovery
                                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                                : "bg-slate-100 dark:bg-gray-800 text-slate-500 border-slate-200 dark:border-gray-700"
                            }`}
                          >
                            {provider.allow_hotspot_password_recovery ? "Enabled" : "Disabled"}
                          </button>
                        )}
                      </td>
                      <td className="p-3.5 text-right space-x-3">
                        {!provider.is_active && provider.id && (
                          <button
                            type="button"
                            onClick={() => void handleToggleActive(provider.id!)}
                            className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-xs"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleEdit(provider)}
                          className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-xs"
                        >
                          Edit
                        </button>
                        {provider.id && (
                          <button
                            type="button"
                            onClick={() => void handleDelete(provider.id!)}
                            className="text-red-600 dark:text-red-400 hover:underline font-medium text-xs"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="block sm:hidden divide-y divide-slate-200 dark:divide-gray-800">
              {providers.map((provider) => (
                <div key={provider.id} className="p-3.5 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white text-xs">
                        {provider.provider_type_display || provider.provider_type}
                      </h4>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                        Sender: {provider.sender_id}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                        provider.is_active
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                          : "bg-slate-100 dark:bg-gray-800 text-slate-500 border-slate-200 dark:border-gray-700"
                      }`}
                    >
                      {provider.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px] pt-2 border-t border-slate-100 dark:border-gray-800">
                    <button
                      type="button"
                      onClick={() =>
                        provider.id &&
                        void handleQuickFeatureToggle(
                          provider.id,
                          "allow_hotspot_password_recovery",
                          provider.allow_hotspot_password_recovery,
                        )
                      }
                      className="text-[10px] font-medium text-slate-500 dark:text-slate-400"
                    >
                      Recovery:{" "}
                      <strong className="text-slate-800 dark:text-slate-200">
                        {provider.allow_hotspot_password_recovery ? "On" : "Off"}
                      </strong>
                    </button>
                    <div className="space-x-2">
                      {!provider.is_active && provider.id && (
                        <button
                          type="button"
                          onClick={() => void handleToggleActive(provider.id!)}
                          className="!text-blue-600 dark:text-blue-400 font-medium"
                        >
                          Default
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleEdit(provider)}
                        className="text-blue-600 dark:text-blue-400 font-medium"
                      >
                        Edit
                      </button>
                      {provider.id && (
                        <button
                          type="button"
                          onClick={() => void handleDelete(provider.id!)}
                          className="text-red-600 dark:text-red-400 font-medium"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Progressive Test Console Surface Container */}
      <section className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3.5 sm:px-5 border-b border-slate-100 dark:border-gray-800">
          <FlaskConical className="h-4 w-4 text-amber-500" />
          <h3 className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white">
            Test SMS Dispatch
          </h3>
        </div>

        <form onSubmit={handleRunTest}>
          <div className="divide-y divide-slate-100 dark:divide-gray-800">
            <div>
              <SectionRow
                title="Target Gateway"
                description={
                  selectedTestProvider
                    ? providers.find((p) => String(p.id) === String(selectedTestProvider))?.provider_type_display ||
                      providers.find((p) => String(p.id) === String(selectedTestProvider))?.provider_type ||
                      "Selected Provider"
                    : "Use Active Default Gateway"
                }
                open={testSection === "gateway"}
                onClick={() => toggleTestSection("gateway")}
                icon={<Radio className="h-3.5 w-3.5" />}
              />
              {testSection === "gateway" && (
                <div className="px-4 pb-4 sm:px-5 pt-1">
                  <label className={labelClass}>Gateway to Test</label>
                  <select
                    value={selectedTestProvider}
                    onChange={(e) => setSelectedTestProvider(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Use Active Default Gateway</option>
                    {providers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.provider_type_display || p.provider_type} ({p.sender_id})
                        {p.is_active ? " — Active" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div>
              <SectionRow
                title="Recipient Phone Number"
                description={testPayload.recipient || "Enter target phone number"}
                open={testSection === "recipient"}
                complete={Boolean(testPayload.recipient.trim())}
                onClick={() => toggleTestSection("recipient")}
                icon={<Send className="h-3.5 w-3.5" />}
              />
              {testSection === "recipient" && (
                <div className="px-4 pb-4 sm:px-5 pt-1">
                  <label className={labelClass}>Recipient</label>
                  <input
                    type="tel"
                    value={testPayload.recipient}
                    onChange={(e) =>
                      setTestPayload((prev) => ({ ...prev, recipient: e.target.value }))
                    }
                    placeholder="e.g. 254712345678"
                    required
                    className={inputClass}
                  />
                </div>
              )}
            </div>

            <div>
              <SectionRow
                title="Test Message"
                description={testPayload.message || "Enter test SMS body"}
                open={testSection === "message"}
                complete={Boolean(testPayload.message.trim())}
                onClick={() => toggleTestSection("message")}
                icon={<Mail className="h-3.5 w-3.5" />}
              />
              {testSection === "message" && (
                <div className="px-4 pb-4 sm:px-5 pt-1">
                  <label className={labelClass}>Message Body</label>
                  <textarea
                    rows={2}
                    value={testPayload.message}
                    onChange={(e) =>
                      setTestPayload((prev) => ({ ...prev, message: e.target.value }))
                    }
                    required
                    maxLength={500}
                    className="w-full rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-900 outline-none transition focus:border-slate-400 dark:border-gray-700 dark:bg-gray-900 dark:text-slate-100 dark:focus:border-gray-500"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end p-3.5 border-t border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-900">
            <button
              type="submit"
              disabled={testing || loading || providers.length === 0}
              className="h-9 bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {testing ? (
                <>
                  <Activity className="h-3.5 w-3.5 animate-pulse" />
                  <span>Dispatching...</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Send Test SMS</span>
                </>
              )}
            </button>
          </div>
        </form>

        {testResponse && (
          <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-gray-800">
            <div className="flex items-center gap-2 font-mono text-[11px] mb-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  testResponse.success ? "bg-emerald-500" : "bg-red-500"
                }`}
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {testResponse.success ? "Dispatch Succeeded" : "Dispatch Failed"}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs mb-2">{testResponse.message}</p>
            <pre className="p-3 bg-slate-950 text-emerald-400 rounded-lg text-[10px] overflow-x-auto font-mono">
              {JSON.stringify(testResponse, null, 2)}
            </pre>
          </div>
        )}
      </section>
    </div>
  );
};