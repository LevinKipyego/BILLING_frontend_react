import { useEffect, useState, useCallback } from "react";
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
  GlobeAltIcon
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

  // 1. Optimized Data Loading with Error Handling
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
      setError("Failed to fetch configurations. Please check your connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 2. Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    
    // Auto-switch port if SSL is toggled
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
      setError("Could not save connection. Verify your API credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this MikroTik API configuration?")) return;
    try {
      await deleteMikrotikConnection(id);
      setConnections(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError("Failed to delete the connection.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <CpuChipIcon className="w-8 h-8 text-blue-600" />
            API Configurations
          </h1>
          <p className="text-sm text-gray-500">Manage API access to your MikroTik routers.</p>
        </div>
        <button 
          onClick={loadData}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
        >
          <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm flex items-center gap-3">
          <ShieldExclamationIcon className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ---------------- CREATE FORM (LEFT SIDE) ---------------- */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <PlusIcon className="w-5 h-5 text-blue-600" />
              Add Connection
            </h2>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Device Alias</label>
              <select
                name="mikrotik"
                value={form.mikrotik}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:border-blue-500 outline-none bg-gray-50/50"
              >
                <option value="">Select Device</option>
                {devices.map((d) => <option key={d.id} value={d.id}>{d.identity_name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">IP/Host</label>
                <input name="host" placeholder="192.168.88.1" value={form.host} onChange={handleChange} required className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:border-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Port</label>
                <input name="port" type="number" value={form.port} onChange={handleChange} className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:border-blue-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
              <input name="username" placeholder="api_user" value={form.username} onChange={handleChange} required className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:border-blue-500" />
            </div>

            <div className="space-y-1 relative">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <input name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={handleChange} required className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:border-blue-500 pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-8 text-gray-400">
                {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl">
              <span className="text-xs font-bold text-blue-700">Use SSL Security</span>
              <input type="checkbox" name="use_ssl" checked={form.use_ssl} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50">
              {loading ? "Saving..." : "Save Configuration"}
            </button>
          </form>
        </div>

        {/* ---------------- LIST (RIGHT SIDE) ---------------- */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Router</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Connection</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Security</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {connections.map((c) => (
                    <tr key={c.id} className="hover:bg-blue-50/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <ServerIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                          </div>
                          <span className="font-bold text-gray-700 text-sm">{c.mikrotik}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-600">{c.host}</p>
                        <p className="text-[10px] text-gray-400">Port {c.port}</p>
                      </td>
                      <td className="px-6 py-4">
                        {c.use_ssl ? (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg w-fit">
                            <ShieldCheckIcon className="w-3.5 h-3.5" /> SSL Encrypted
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg w-fit">
                            <GlobeAltIcon className="w-3.5 h-3.5" /> Standard (API)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDelete(c.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all">
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!connections.length && !loading && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                           <CpuChipIcon className="w-12 h-12 text-gray-200" />
                           <p className="text-gray-400 text-sm font-medium">No API connections found.</p>
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