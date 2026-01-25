import { useEffect, useState } from "react";
import {
  getMpesaConfig,
  createMpesaConfig,
  updateMpesaConfig,
  deleteMpesaConfig, // Ensure this is exported in your api/mpesa.ts
} from "../../api/mpesa";

import { 
  ShieldCheckIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  GlobeAltIcon, 
  ArrowPathIcon,
  PlusIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

import type { MpesaConfigPayload } from "../../api/mpesa";

// Define the environment type for strict TS checks
type MpesaEnvironment = "sandbox" | "production";

export default function Mpesa() {
  const [loading, setLoading] = useState(true);
  const [exists, setExists] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    business_shortcode: "",
    passkey: "",
    consumer_key: "",
    consumer_secret: "",
    callback_url: "",
    environment: "sandbox" as MpesaEnvironment,
  });

  async function loadConfig() {
    try {
      const data = await getMpesaConfig();
      if (data && data.business_shortcode) {
        setExists(true);
        setForm({
          business_shortcode: data.business_shortcode,
          callback_url: data.callback_url,
          environment: data.environment as MpesaEnvironment,
          passkey: "",
          consumer_key: "",
          consumer_secret: "",
        });
      } else {
        setExists(false);
        setIsEditing(true); // Open form if no config exists
      }
    } catch (err) {
      setExists(false);
      setIsEditing(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadConfig();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      if (exists) {
        await updateMpesaConfig(form as MpesaConfigPayload);
      } else {
        await createMpesaConfig(form as MpesaConfigPayload);
        setExists(true);
      }
      
      alert("Configuration saved successfully");
      setIsEditing(false); // Close form on success
      
      // Clear sensitive fields from memory
      setForm((f) => ({
        ...f,
        passkey: "",
        consumer_key: "",
        consumer_secret: "",
      }));
    } catch (err: any) {
      setError(err.message || "An error occurred while saving.");
    }
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure? This will disable automated M-Pesa payments.")) return;
    
    try {
      await deleteMpesaConfig();
      setExists(false);
      setIsEditing(true);
      setForm({
        business_shortcode: "",
        passkey: "",
        consumer_key: "",
        consumer_secret: "",
        callback_url: "",
        environment: "sandbox",
      });
      alert("Configuration deleted.");
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <ArrowPathIcon className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-10 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <ShieldCheckIcon className="w-8 h-8 text-green-600" />
            M-Pesa Gateway
          </h1>
          <p className="text-gray-500 mt-1">Manage Daraja API credentials for your automated payment system.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm flex justify-between items-center">
          <p className="text-red-700 text-sm font-medium">{error}</p>
          <button onClick={() => setError("")}><XMarkIcon className="w-5 h-5 text-red-400" /></button>
        </div>
      )}

      {/* Configuration Table / Status View */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <h3 className="font-bold text-gray-700 uppercase text-xs tracking-wider">Active Credentials</h3>
          {!exists && (
            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-bold uppercase">
              Action Required
            </span>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-widest">
              <tr>
                <th className="px-6 py-3">Shortcode</th>
                <th className="px-6 py-3">Environment</th>
                <th className="px-6 py-3">Callback URL</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {exists ? (
                <tr className="hover:bg-gray-50/20 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-blue-600">{form.business_shortcode}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                      form.environment === 'production' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      <GlobeAltIcon className="w-3.5 h-3.5" />
                      {form.environment.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-[200px]">{form.callback_url}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handleDelete}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-400 italic text-sm">
                    No gateway configured. Please fill in the details below.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Section */}
      {(isEditing || !exists) && (
        <section className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-slideUp">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              {exists ? <ArrowPathIcon className="w-5 h-5 text-blue-500" /> : <PlusIcon className="w-5 h-5 text-green-500" />}
              {exists ? "Update Gateway Credentials" : "Configure New Gateway"}
            </h2>
            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              AES-256 ENCRYPTED STORAGE
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">Business Shortcode</label>
                <input
                  className="w-full border-gray-200 focus:ring-2 focus:ring-blue-500 p-3 rounded-xl border transition-all outline-none"
                  placeholder="e.g. 174379"
                  value={form.business_shortcode}
                  onChange={(e) => setForm({ ...form, business_shortcode: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">Environment</label>
                <select
                  className="w-full border-gray-200 focus:ring-2 focus:ring-blue-500 p-3 rounded-xl border bg-white transition-all outline-none"
                  value={form.environment}
                  onChange={(e) => setForm({ ...form, environment: e.target.value as MpesaEnvironment })}
                >
                  <option value="sandbox">Sandbox (Testing)</option>
                  <option value="production">Production (Live)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Passkey", key: "passkey" },
                { label: "Consumer Key", key: "consumer_key" },
                { label: "Consumer Secret", key: "consumer_secret" }
              ].map((field) => (
                <div key={field.key} className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">{field.label}</label>
                  <input
                    className="w-full border-gray-200 focus:ring-2 focus:ring-blue-500 p-3 rounded-xl border transition-all outline-none"
                    type="password"
                    placeholder="••••••••••••"
                    value={(form as any)[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    required={!exists}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">Callback URL</label>
              <input
                className="w-full border-gray-200 focus:ring-2 focus:ring-blue-500 p-3 rounded-xl border font-mono text-sm outline-none"
                placeholder="https://your-api.com/mpesa/callback"
                value={form.callback_url}
                onChange={(e) => setForm({ ...form, callback_url: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button className={`flex-1 font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-white ${
                exists ? "bg-blue-600 hover:bg-blue-700 shadow-blue-100" : "bg-green-600 hover:bg-green-700 shadow-green-100"
              }`}>
                {exists ? <ArrowPathIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
                {exists ? "Update Credentials" : "Initialize Gateway"}
              </button>
              
              {exists && (
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-4 bg-gray-100 text-gray-500 font-bold rounded-xl hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>
      )}
    </div>
  );
}