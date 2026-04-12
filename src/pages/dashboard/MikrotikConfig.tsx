import { useEffect, useState, useCallback, useMemo } from "react";
import {
  ServerIcon,
  PlusIcon,
  TrashIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  ArrowPathIcon,
  CpuChipIcon,
  EyeIcon,
  EyeSlashIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  LockClosedIcon
} from "@heroicons/react/24/outline";

// API & Types
import {
  listMikrotikConnections,
  createMikrotikConnection,
  deleteMikrotikConnection,
} from "../../api/mikrotikConfigurations";
import { fetchMikrotiks } from "../../api/devices";
import type {
  MikrotikConnection,
  MikrotikConnectionCreate,
} from "../../types/mikrotikConfiguration";
import type { MikrotikDevice } from "../../types/device";

export default function MikrotikConnectionsPage() {
  const [connections, setConnections] = useState<MikrotikConnection[]>([]);
  const [devices, setDevices] = useState<MikrotikDevice[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const initialFormState: MikrotikConnectionCreate = {
    mikrotik: "",
    host: "",
    port: 8728,
    username: "",
    password: "",
    hotspot_server: "",
    use_ssl: false,
    enabled: true,
  };

  const [form, setForm] = useState<MikrotikConnectionCreate>(initialFormState);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [connRes, deviceRes] = await Promise.all([
        listMikrotikConnections(),
        fetchMikrotiks(),
      ]);
      setConnections(Array.isArray(connRes) ? connRes : []);
      setDevices(Array.isArray(deviceRes) ? deviceRes : []);
    } catch (err: any) {
      setError("Failed to fetch configurations. System link unstable.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Search filter logic
  const filteredConnections = useMemo(() => {
    return connections.filter(c => 
      c.host.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.mikrotik.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [connections, searchQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    
    if (name === "use_ssl") {
      setForm(prev => ({ ...prev, use_ssl: val as boolean, port: val ? 8729 : 8728 }));
    } else {
      setForm(prev => ({ ...prev, [name]: val }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createMikrotikConnection(form);
      setForm(initialFormState);
      await loadData();
    } catch (err) {
      setError("Authorization sequence failed. Verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Decommission this API connection?")) return;
    try {
      await deleteMikrotikConnection(id);
      setConnections(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError("Decommissioning failed.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* 1. TOP HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600/10 dark:bg-blue-600/20 rounded-xl text-blue-600 dark:text-blue-400 shadow-inner">
            <CpuChipIcon className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">API_Configurations</h1>
            <div className="flex items-center gap-2 mt-0.5">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active_Node_Registry</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search Host / Alias..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none w-full md:w-64 transition-all"
            />
          </div>
          <button 
            onClick={loadData}
            className="p-2.5 bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-gray-800 transition-all shadow-sm"
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 italic animate-bounce">
          <ShieldExclamationIcon className="w-5 h-5" />
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ---------------- 2. CREATE FORM (STATION) ---------------- */}
        <div className="lg:col-span-4">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 space-y-5 sticky top-6 transition-all">
            <div className="flex items-center gap-2 border-b border-slate-50 dark:border-slate-700 pb-4 mb-2">
              <PlusIcon className="w-5 h-5 text-blue-600" />
              <h2 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-[0.2em] italic">Register_Connection</h2>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Device_Alias</label>
              <select
                name="mikrotik"
                value={form.mikrotik}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white appearance-none"
              >
                <option value="">Select Device</option>
                {devices.map((d) => <option key={d.id} value={d.id}>{d.identity_name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-8 space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Host_Endpoint</label>
                <input name="host" placeholder="10.0.0.20" value={form.host} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-slate-700 p-3 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white placeholder:opacity-30" />
              </div>
              <div className="col-span-4 space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Port</label>
                <input name="port" type="number" value={form.port} onChange={handleChange} className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-slate-700 p-3 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Username</label>
              <input name="username" placeholder="sys_admin" value={form.username} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-slate-700 p-3 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white" />
            </div>

            <div className="space-y-1.5 relative">
              <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Password</label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 opacity-50" />
                <input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={form.password} 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-slate-700 pl-10 pr-10 p-3 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors">
                  {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-600/5 dark:bg-blue-600/10 rounded-lg border border-blue-600/10">
              <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest italic">Encrypted_SSL</span>
              <input type="checkbox" name="use_ssl" checked={form.use_ssl} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded-md border-slate-300 dark:border-slate-600 bg-transparent focus:ring-0 cursor-pointer" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 italic">
              {loading ? "Syncing..." : "Commit_Configuration"}
            </button>
          </form>
        </div>

        {/* ---------------- 3. LIST VIEW (GRID) ---------------- */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-gray-900/50 border-b border-slate-100 dark:border-slate-700">
                    <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Router_Node</th>
                    <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Network_Path</th>
                    <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Security_Layer</th>
                    <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                  {filteredConnections.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-gray-900/40 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 bg-slate-100 dark:bg-gray-700 rounded-lg group-hover:scale-110 transition-all shadow-inner">
                            <ServerIcon className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-blue-600" />
                          </div>
                          <span className="font-black text-slate-800 dark:text-white text-xs tracking-tight italic uppercase">{c.mikrotik}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-xs font-black text-slate-600 dark:text-slate-300 italic">{c.host}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Port_ {c.port}</p>
                      </td>
                      <td className="px-6 py-5">
                        {c.use_ssl ? (
                          <div className="flex items-center gap-2 text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full w-fit uppercase italic tracking-widest">
                            <ShieldCheckIcon className="w-3.5 h-3.5" /> SSL_Secured
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-[9px] font-black text-amber-600 dark:text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full w-fit uppercase italic tracking-widest">
                            <GlobeAltIcon className="w-3.5 h-3.5" /> API_Standard
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => handleDelete(c.id)} 
                          className="p-2.5 text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!filteredConnections.length && !loading) && (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                           <div className="p-4 bg-slate-50 dark:bg-gray-900 rounded-full">
                              <CpuChipIcon className="w-10 h-10 text-slate-200 dark:text-slate-700" />
                           </div>
                           <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] italic">No_System_Links_Found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}