import { useEffect, useState, useMemo } from "react";
import {
  getMpesaConfig,
  createMpesaConfig,
  updateMpesaConfig,
  deleteMpesaConfig,
} from "../../api/mpesa";

import { 
  ShieldCheckIcon, 
  PencilSquareIcon, 
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
  ChevronRightIcon
} from "@heroicons/react/24/outline";

import type { MpesaConfigPayload } from "../../api/mpesa";

type MpesaEnvironment = "SANDBOX" | "PRODUCTION";

export default function Mpesa() {
  const [loading, setLoading] = useState(true);
  const [configs, setConfigs] = useState<any[]>([]); 
  const [isEditing, setIsEditing] = useState(false); 
  const [error, setError] = useState("");
  const [showSecrets, setShowSecrets] = useState<{ [key: string]: boolean }>({});

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [envFilter, setEnvFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
        setConfigs([data]);
        setForm({
          business_shortcode: data.business_shortcode,
          callback_url: data.callback_url,
          environment: data.environment as MpesaEnvironment,
          passkey: "",
          consumer_key: "",
          consumer_secret: "",
        });
      } else {
        setConfigs([]);
        setIsEditing(true);
      }
    } catch (err) {
      setConfigs([]);
      setIsEditing(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadConfig(); }, []);

  const toggleSecret = (field: string) => {
    setShowSecrets(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const filteredConfigs = useMemo(() => {
    return configs.filter(c => {
      const matchesSearch = c.business_shortcode.includes(searchTerm) || 
                            c.callback_url.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEnv = envFilter === "ALL" || c.environment === envFilter;
      return matchesSearch && matchesEnv;
    });
  }, [configs, searchTerm, envFilter]);

  const totalPages = Math.ceil(filteredConfigs.length / itemsPerPage);
  const paginatedConfigs = filteredConfigs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const exists = configs.length > 0;
      if (exists) {
        await updateMpesaConfig(form as MpesaConfigPayload);
      } else {
        await createMpesaConfig(form as MpesaConfigPayload);
      }
      alert("Configuration saved successfully");
      setIsEditing(false);
      loadConfig();
    } catch (err: any) {
      setError(err.message || "An error occurred while saving.");
    }
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure? This will disable automated M-Pesa payments.")) return;
    try {
      await deleteMpesaConfig();
      setConfigs([]);
      setIsEditing(true);
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
    <div className="max-w-6xl mx-auto pb-10 space-y-6 animate-fadeIn p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">M-Pesa Gateway</h1>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Daraja API Credentials Management</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20"
          >
            <PlusIcon className="w-4 h-4" />
            Add Configuration
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-xl flex justify-between items-center">
          <p className="text-red-700 text-xs font-bold uppercase">{error}</p>
          <button onClick={() => setError("")}><XMarkIcon className="w-4 h-4 text-red-400" /></button>
        </div>
      )}

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 flex flex-wrap gap-3 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search shortcode or URL..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-gray-900 border-none rounded-lg text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-gray-900 px-3 py-2 rounded-lg border-none">
          <FunnelIcon className="w-4 h-4 text-slate-400" />
          <select 
            className="bg-transparent dark:bg-gray-900 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
            value={envFilter}
            onChange={(e) => setEnvFilter(e.target.value)}
          >
            <option value="ALL">ALL ENVS</option>
            <option value="production">PRODUCTION</option>
            <option value="sandbox">SANDBOX</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-gray-900/50 border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Shortcode</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Environment</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Callback URL</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {paginatedConfigs.length > 0 ? paginatedConfigs.map((config, idx) => (
                <tr key={idx} className="hover:bg-blue-50/30 dark:hover:bg-blue-500/5 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-blue-600 text-sm">{config.business_shortcode}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${
                      config.environment === 'production' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      <GlobeAltIcon className="w-3 h-3 mr-1 inline" />
                      {config.environment}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[11px] text-slate-500 font-medium truncate max-w-[200px]">{config.callback_url}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => {
                          setForm({...config, passkey: "", consumer_key: "", consumer_secret: ""});
                          setIsEditing(true);
                        }} 
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={handleDelete} 
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic text-xs uppercase tracking-widest">No matching configurations found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="p-4 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Page {currentPage} of {totalPages || 1}</span>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-all"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-all"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* FORM SECTION */}
      {isEditing && (
        <section className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-blue-500/20 overflow-hidden animate-slideUp">
          <div className="p-5 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between bg-blue-50/30 dark:bg-blue-500/5">
            <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
              {configs.length > 0 ? "Edit Gateway" : "New Gateway"}
            </h2>
            <button onClick={() => setIsEditing(false)}>
               <XMarkIcon className="w-5 h-5 text-slate-400 hover:text-slate-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Shortcode</label>
                <input
                  className="w-full bg-slate-50 dark:bg-gray-900 border-none p-3 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="174379"
                  value={form.business_shortcode}
                  onChange={(e) => setForm({ ...form, business_shortcode: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Environment</label>
                <select
                  className="w-full bg-slate-50 dark:bg-gray-900 border-none p-3 rounded-lg text-xs font-bold outline-none cursor-pointer"
                  value={form.environment}
                  onChange={(e) => setForm({ ...form, environment: e.target.value as MpesaEnvironment })}
                >
                  <option value="sandbox">SANDBOX (TESTING)</option>
                  <option value="production">PRODUCTION (LIVE)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Passkey", key: "passkey" },
                { label: "Consumer Key", key: "consumer_key" },
                { label: "Consumer Secret", key: "consumer_secret" }
              ].map((field) => (
                <div key={field.key} className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{field.label}</label>
                  <div className="relative">
                    <input
                      className="w-full bg-slate-50 dark:bg-gray-900 border-none p-3 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 pr-10"
                      type={showSecrets[field.key] ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={(form as any)[field.key]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      required={configs.length === 0}
                    />
                    <button 
                      type="button"
                      onClick={() => toggleSecret(field.key)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500"
                    >
                      {showSecrets[field.key] ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Callback URL</label>
              <input
                className="w-full bg-slate-50 dark:bg-gray-900 border-none p-3 rounded-lg text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="https://api.yourdomain.com/mpesa/callback"
                value={form.callback_url}
                onChange={(e) => setForm({ ...form, callback_url: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="submit"
                className="flex-1 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest py-4 rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <ArrowPathIcon className="w-4 h-4" />
                {configs.length > 0 ? "Update Credentials" : "Save Gateway"}
              </button>
              <button 
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-8 bg-slate-100 dark:bg-gray-700 text-slate-500 dark:text-slate-300 font-black text-[10px] uppercase tracking-widest py-4 rounded-lg hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}