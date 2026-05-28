
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
    environment: "SANDBOX" as MpesaEnvironment,
  });

  async function loadConfig() {
    setLoading(true);
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
      const matchesSearch = (c.business_shortcode || "").includes(searchTerm) || 
                            (c.callback_url || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEnv = envFilter === "ALL" || (c.environment || "").toUpperCase() === envFilter.toUpperCase();
      return matchesSearch && matchesEnv;
    });
  }, [configs, searchTerm, envFilter]);

  const totalPages = Math.ceil(filteredConfigs.length / itemsPerPage);
  const paginatedConfigs = filteredConfigs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset pagination on search modifications
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, envFilter]);

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
    <div className="flex items-center justify-center h-64 dark:bg-gray-900 min-h-screen">
      <ArrowPathIcon className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-10 space-y-4 md:space-y-6 animate-fadeIn p-3 md:p-8 dark:bg-gray-900 min-h-screen transition-colors">
      
      {/* Header Container */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
            M-Pesa Gateway
          </h1>
          <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-tight">
            Daraja API Credentials Management
          </p>
        </div>
        {!isEditing && configs.length === 0 && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-black text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-md transition-all outline-none"
          >
            <PlusIcon className="w-4 h-4 stroke-[3]" />
            <span>Add Configuration</span>
          </button>
        )}
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-900/20 border-l-4 border-rose-500 p-3 rounded-lg flex justify-between items-center mx-1 animate-shake">
          <p className="text-rose-700 dark:text-rose-400 text-[10px] font-black uppercase">{error}</p>
          <button onClick={() => setError("")}><XMarkIcon className="w-4 h-4 text-rose-400" /></button>
        </div>
      )}

      {/* DETACHED FILTER PANEL STRUCTURE */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:max-w-xs">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search shortcode or URL..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700/80 rounded-lg text-xs font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-2xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-700/80 w-full sm:w-auto shadow-2xs">
            <FunnelIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <select 
              className="bg-transparent dark:bg-gray-800 text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-white outline-none cursor-pointer w-full"
              value={envFilter}
              onChange={(e) => setEnvFilter(e.target.value)}
            >
              <option value="ALL">ALL ENVS</option>
              <option value="PRODUCTION">PRODUCTION</option>
              <option value="SANDBOX">SANDBOX</option>
            </select>
          </div>
        </div>
        
        <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center sm:text-right w-full sm:w-auto">
          {filteredConfigs.length} Gateways Found
        </div>
      </div>

      {/* FIXED POSITION FORM OVERLAY POPUP */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs animate-fadeIn">
          <section className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 dark:border-gray-700/80 overflow-hidden animate-scaleUp max-h-[92vh] flex flex-col">
            
            <div className="p-4 md:p-5 border-b border-slate-100 dark:border-gray-700/60 bg-slate-50/50 dark:bg-gray-800/80 flex items-center justify-between sticky top-0 z-10">
              <h2 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-[0.2em] flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5 text-blue-600 stroke-[2.5]" />
                {configs.length > 0 ? "Edit Gateway Parameters" : "Provision New M-Pesa Gateway"}
              </h2>
              <button onClick={() => setIsEditing(false)} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-md">
                <XMarkIcon className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Business Shortcode</label>
                  <input
                    className="w-full bg-slate-50 dark:bg-gray-900/50 border border-transparent focus:ring-2 focus:ring-blue-500 p-3 rounded-lg text-xs font-bold text-slate-700 dark:text-white outline-none"
                    placeholder="174379"
                    value={form.business_shortcode}
                    onChange={(e) => setForm({ ...form, business_shortcode: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Environment</label>
                  <select
                    className="w-full bg-slate-50 dark:bg-gray-900/50 border border-transparent focus:ring-2 focus:ring-blue-500 p-3 rounded-lg text-xs font-bold text-slate-700 dark:text-white outline-none cursor-pointer"
                    value={form.environment}
                    onChange={(e) => setForm({ ...form, environment: e.target.value as MpesaEnvironment })}
                  >
                    <option value="SANDBOX">SANDBOX (TESTING)</option>
                    <option value="PRODUCTION">PRODUCTION (LIVE)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Passkey", key: "passkey" },
                  { label: "Consumer Key", key: "consumer_key" },
                  { label: "Consumer Secret", key: "consumer_secret" }
                ].map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{field.label}</label>
                    <div className="relative">
                      <input
                        className="w-full bg-slate-50 dark:bg-gray-900/50 border border-transparent focus:ring-2 focus:ring-blue-500 p-3 rounded-lg text-xs font-bold text-slate-700 dark:text-white outline-none pr-10"
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

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Callback URL</label>
                <input
                  className="w-full bg-slate-50 dark:bg-gray-900/50 border border-transparent focus:ring-2 focus:ring-blue-500 p-3 rounded-lg text-xs font-mono text-slate-700 dark:text-white outline-none"
                  placeholder="https://api.yourdomain.com/mpesa/callback"
                  value={form.callback_url}
                  onChange={(e) => setForm({ ...form, callback_url: e.target.value })}
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-gray-700/60 flex items-center justify-end gap-3 bg-white dark:bg-gray-800 sticky bottom-0">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-700/60 transition-all outline-none"
                >
                  Dismiss
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-black text-white font-black rounded-lg shadow-md transition-all uppercase text-xs tracking-widest flex items-center gap-2 outline-none"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                  <span>{configs.length > 0 ? "Update Credentials" : "Save Gateway"}</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* 1. INDEPENDENT VIEW CARDS FOR MOBILE DISPLAY */}
      <div className="block md:hidden space-y-3 mx-1">
        {paginatedConfigs.length > 0 ? paginatedConfigs.map((config, idx) => (
          <div 
            key={idx}
            className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700/80 rounded-xl p-4 space-y-3.5 shadow-2xs hover:border-slate-300 dark:hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="block font-mono font-bold text-base text-blue-600 dark:text-blue-400 tracking-tight">
                  {config.business_shortcode}
                </span>
                <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-mono font-medium break-all">
                  URL: {config.callback_url}
                </span>
              </div>
              <div className="flex-shrink-0">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase border ${
                  (config.environment || "").toLowerCase() === 'production' 
                    ? 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900/30' 
                    : 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30'
                }`}>
                  <GlobeAltIcon className="w-3 h-3" />
                  {config.environment}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-gray-700/50">
              <button 
                onClick={() => {
                  setForm({...config, passkey: "", consumer_key: "", consumer_secret: ""});
                  setIsEditing(true);
                }} 
                className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-md"
              >
                <PencilSquareIcon className="w-3.5 h-3.5" />
                <span>Modify</span>
              </button>
              <button 
                onClick={handleDelete}
                className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-black uppercase text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 rounded-md"
              >
                <TrashIcon className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )) : (
          <div className="py-12 text-center space-y-2 bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700/80">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No matching records found.</p>
          </div>
        )}
      </div>

      {/* 2. DESKTOP SYSTEM VIEW HOUSING TERMINAL */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-xs border border-slate-100 dark:border-slate-700 overflow-hidden mx-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-gray-900/50 text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black border-b border-slate-100 dark:border-slate-700/50">
                <th className="px-6 py-4.5">Shortcode</th>
                <th className="px-6 py-4.5">Environment Mode</th>
                <th className="px-6 py-4.5">Callback Endpoint Pipeline</th>
                <th className="px-8 py-4.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {paginatedConfigs.length > 0 ? paginatedConfigs.map((config, idx) => (
                <tr key={idx} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                  <td className="px-6 py-4 font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                    {config.business_shortcode}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase border ${
                      (config.environment || "").toLowerCase() === 'production' 
                        ? 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900/30' 
                        : 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30'
                    }`}>
                      <GlobeAltIcon className="w-3.5 h-3.5" />
                      {config.environment}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-500 dark:text-slate-400 truncate max-w-[240px]">
                    {config.callback_url}
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => {
                          setForm({...config, passkey: "", consumer_key: "", consumer_secret: ""});
                          setIsEditing(true);
                        }} 
                        className="p-2 text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                      >
                        <PencilSquareIcon className="w-4 h-4 stroke-[2]" />
                      </button>
                      <button 
                        onClick={handleDelete} 
                        className="p-2 text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                      >
                        <TrashIcon className="w-4 h-4 stroke-[2]" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-slate-400 dark:text-slate-500 uppercase text-[10px] tracking-widest font-black">
                    No active integration records linked.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Housing Module */}
      {filteredConfigs.length > 0 && (
        <div className="px-5 md:px-8 py-4 border border-slate-150 dark:border-slate-700 rounded-lg flex items-center justify-between bg-white dark:bg-gray-800 mx-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {currentPage} / {totalPages || 1}
          </span>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 border border-slate-200 dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-900 disabled:opacity-20 transition-all dark:text-white outline-none"
            >
              <ChevronLeftIcon className="w-4 h-4 stroke-[3]" />
            </button>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 border border-slate-200 dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-900 disabled:opacity-20 transition-all dark:text-white outline-none"
            >
              <ChevronRightIcon className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}