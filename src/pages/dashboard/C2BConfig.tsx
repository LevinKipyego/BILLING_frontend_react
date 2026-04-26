import { useEffect, useState } from "react";
import {
  getMpesaC2BConfig,
  testMpesaConnection,
} from "../../api/mpesa";
import type { MpesaC2BConfig } from "../../types/mpesa";
import { 
  Cog6ToothIcon, CommandLineIcon, 
  GlobeAltIcon, CheckCircleIcon, ExclamationTriangleIcon, 
  BeakerIcon, ArrowPathIcon, LockClosedIcon, BuildingOfficeIcon,
  FingerPrintIcon, ServerIcon
} from "@heroicons/react/24/outline";

export default function MpesaConfig() {
  const [config, setConfig] = useState<MpesaC2BConfig | null>(null);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState("");

  function normalize(data: Partial<MpesaC2BConfig>): MpesaC2BConfig {
    return {
      vendor: data.vendor || "",
      shortcode: data.shortcode || "",
      business_name: data.business_name || "",
      c2b_type: data.c2b_type || "PayBill",
      validation_url: data.validation_url || "",
      confirmation_url: data.confirmation_url || "",
      is_live: data.is_live ?? false,
      enabled: data.enabled ?? true,
      environment: data.environment || "SANDBOX",
      created_at: data.created_at || "",
      updated_at: data.updated_at || "",
    };
  }

  async function load() {
    try {
      const res = await getMpesaC2BConfig();
      const data = Array.isArray(res) ? res[0] : res;
      setConfig(normalize(data || {}));
    } catch {
      setConfig(normalize({}));
    }
  }

  useEffect(() => { load(); }, []);

  async function handleTest() {
    setTesting(true);
    setMessage("");
    try {
      const res = await testMpesaConnection();
      setMessage(res.success ? "Gateway Connection Active ✅" : "Gateway Offline ❌");
    } catch {
      setMessage("Connection request failed ❌");
    } finally {
      setTesting(false);
      setTimeout(() => setMessage(""), 5000);
    }
  }

  if (!config) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-4 md:p-6 lg:p-12 font-['Figtree',sans-serif]">
      
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-2">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30 shrink-0">
            <Cog6ToothIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
              Mpesa <span className="text-blue-600">C2B Portal</span>
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Integration Management</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${config.is_live ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
            <ServerIcon className="w-3.5 h-3.5" />
            {config.environment} Mode
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        
        {/* DATA DISPLAY AREA */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50 dark:border-gray-700/50">
              <LockClosedIcon className="w-5 h-5 text-gray-400" />
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Read-Only Configuration</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <ViewField label="Business Name" value={config.business_name} icon={<BuildingOfficeIcon/>} />
              <ViewField label="Shortcode" value={config.shortcode} icon={<CommandLineIcon/>} />
              <ViewField label="C2B Type" value={config.c2b_type} icon={<ArrowPathIcon/>} />
              <ViewField label="System Status" value={config.enabled ? "Active" : "Disabled"} icon={<CheckCircleIcon/>} />
              
              <div className="md:col-span-2 space-y-8">
                <ViewField label="Validation URL" value={config.validation_url} icon={<GlobeAltIcon/>} isFullWidth />
                <ViewField label="Confirmation URL" value={config.confirmation_url} icon={<GlobeAltIcon/>} isFullWidth />
              </div>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-in fade-in zoom-in-95 ${message.includes('Active') ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20'}`}>
               <CheckCircleIcon className="w-4 h-4" />
               {message}
            </div>
          )}
        </div>

        {/* SIDEBAR SUMMARY */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 bg-slate-50/50 dark:bg-gray-900 flex items-center justify-between">
              <h3 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Connection Check</h3>
              <div className={`w-2 h-2 rounded-full ${config.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
            </div>
            
            <div className="p-6 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed mb-6">
                Ping the Mpesa gateway to ensure endpoints are responding correctly.
              </p>
              <button onClick={handleTest} disabled={testing} className="w-full flex items-center justify-center gap-3 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 font-black py-4 rounded-xl text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all">
                <BeakerIcon className={`w-4 h-4 ${testing && 'animate-spin'}`} />
                {testing ? "Testing..." : "Test Gateway"}
              </button>
            </div>
          </div>

          <div className="p-7 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-200 dark:shadow-none">
            <div className="flex gap-4">
              <ExclamationTriangleIcon className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-2">Notice</p>
                <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
                  Parameters are locked. Contact your system administrator to modify integration settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ViewField = ({ label, value, icon, isFullWidth }: any) => (
  <div className={`space-y-2 ${isFullWidth ? 'w-full' : ''}`}>
    <div className="flex items-center gap-2 ml-1">
      <div className="text-gray-400 w-3.5 h-3.5 shrink-0">{icon}</div>
      <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em]">{label}</label>
    </div>
    <div className="bg-slate-50 dark:bg-gray-900/50 p-4 rounded-xl">
      <p className="text-xs font-bold text-gray-900 dark:text-white break-all">
        {value || '---'}
      </p>
    </div>
  </div>
);