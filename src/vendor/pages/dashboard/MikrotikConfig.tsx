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
  LockClosedIcon,
  LinkIcon,
  UserIcon,
  KeyIcon,
  PencilSquareIcon,
  ClipboardIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

// API & Types
import {
  listMikrotikConnections,
  createMikrotikConnection,
  updateMikrotikConnection,
  deleteMikrotikConnection,
} from "../../api/mikrotikConfigurations";
import { fetchMikrotiks } from "../../api/devices";
import type {
  MikrotikConnection,
  MikrotikConnectionCreate,
} from "../../types/mikrotikConfiguration";
import type { MikrotikDevice } from "../../types/device";

type ExtendedMikrotikConnectionCreate = MikrotikConnectionCreate & {
  hotspot_login_url?: string;
};

export default function MikrotikConnectionsPage() {
  const [connections, setConnections] = useState<MikrotikConnection[]>([]);
  const [devices, setDevices] = useState<MikrotikDevice[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal toggle state and editing configuration tracker
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Compound key string state to target distinct fields: e.g., "id-username" or "id-password"
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [visibleCredentials, setVisibleCredentials] = useState<{ [key: string]: boolean }>({});

  const initialFormState: ExtendedMikrotikConnectionCreate = {
    mikrotik: "",
    host: "",
    port: 8728,
    username: "",
    password: "",
    hotspot_server: "",
    hotspot_login_url: "",
    use_ssl: false,
    enabled: true,
  };

  const [form, setForm] = useState<ExtendedMikrotikConnectionCreate>(initialFormState);

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

  const toggleRowCredentialVisibility = (id: string) => {
    setVisibleCredentials(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Modern clipboard fallback controller to support unsecure HTTP network environments
  const handleCopyToClipboard = (id: string, field: string, textToCopy: string) => {
    if (!textToCopy || textToCopy === "---") return;
    const targetKey = `${id}-${field}`;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          setCopiedKey(targetKey);
          setTimeout(() => setCopiedKey(null), 1500);
        })
        .catch(() => fallbackCopyEngine(textToCopy, targetKey));
    } else {
      fallbackCopyEngine(textToCopy, targetKey);
    }
  };

  // Synchronous procedural fallback selection range model copier
  const fallbackCopyEngine = (text: string, targetKey: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; 
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      setCopiedKey(targetKey);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch (err) {
      setError("Clipboard interaction context restricted by environment policies.");
    }
    document.body.removeChild(textArea);
  };

  const handleEditInit = (connection: MikrotikConnection) => {
    setEditingId(connection.id);
    setForm({
      mikrotik: connection.mikrotik,
      host: connection.host,
      port: connection.port,
      username: connection.username,
      password: (connection as any).password || "",
      hotspot_server: connection.hotspot_server || "",
      hotspot_login_url: (connection as any).hotspot_login_url || "",
      use_ssl: connection.use_ssl,
      enabled: connection.enabled,
    });
    setIsModalOpen(true);
  };

  const handleCancelFormExchange = () => {
    setEditingId(null);
    setForm(initialFormState);
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await updateMikrotikConnection(editingId, form);
        setEditingId(null);
      } else {
        await createMikrotikConnection(form as any);
      }
      setForm(initialFormState);
      setIsModalOpen(false);
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
      if (editingId === id) handleCancelFormExchange();
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
            <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">API  Configurations</h1>
            <div className="flex items-center gap-2 mt-0.5">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Save your Mikrotik Configurations</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search Host" 
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
          
          <button
            onClick={() => { setEditingId(null); setForm(initialFormState); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black uppercase tracking-wider italic shadow-md transition-all active:scale-[0.98]"
          >
            <PlusIcon className="w-4 h-4" />Add
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 italic animate-bounce">
          <ShieldExclamationIcon className="w-5 h-5" />
          Error: {error}
        </div>
      )}

      {/* ---------------- 2. MODAL FORM OVERLAY DIALOG ---------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg p-6 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-2">
                {editingId ? <PencilSquareIcon className="w-5 h-5 text-amber-500" /> : <PlusIcon className="w-5h-5 text-blue-600" />}
                <h2 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-[0.2em] italic">
                  {editingId ? "Update_Configuration" : "Register_Connection"}
                </h2>
              </div>
              <button 
                type="button" 
                onClick={handleCancelFormExchange}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-gray-700 transition-all"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder={editingId ? "Leave blank to keep unchanged" : "••••••••"} 
                    value={form.password} 
                    onChange={handleChange} 
                    required={!editingId} 
                    className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-slate-700 pl-10 pr-10 p-3 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white" 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors">
                    {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Hotspot_Server</label>
                <input name="hotspot_server" placeholder="hs-prof1" value={form.hotspot_server || ""} onChange={handleChange} className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-slate-700 p-3 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-1">
                  <LinkIcon className="w-3 h-3" /> Hotspot_Login_URL
                </label>
                <input 
                  name="hotspot_login_url" 
                  placeholder="Hotspot/login/url..." 
                  value={form.hotspot_login_url || ""} 
                  readOnly 
                  disabled 
                  className="w-full bg-slate-100 dark:bg-gray-900/60 border border-slate-200 dark:border-slate-800 p-3 rounded-lg text-xs font-bold outline-none text-slate-400 dark:text-slate-600 cursor-not-allowed italic" 
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-600/5 dark:bg-blue-600/10 rounded-lg border border-blue-600/10">
                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest italic">Encrypted_SSL</span>
                <input type="checkbox" name="use_ssl" checked={form.use_ssl} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded-md border-slate-300 dark:border-slate-600 bg-transparent focus:ring-0 cursor-pointer" />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={handleCancelFormExchange}
                  className="w-1/3 bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-slate-200 py-3.5 rounded-lg text-[11px] font-black uppercase tracking-wider text-center hover:bg-slate-200 dark:hover:bg-gray-600 transition-all"
                >
                  Dismiss
                </button>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className={`w-2/3 py-3.5 rounded-lg text-[11px] font-black uppercase tracking-[0.2em] shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 italic text-white ${
                    editingId ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20" : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                  }`}
                >
                  {loading ? "Syncing..." : editingId ? "Update" : "Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- 3. LIST VIEW (GRID) ---------------- */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-gray-900/50 border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Router_Node</th>
                <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Network_Path</th>
                <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Device_Credentials</th>
                <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Hotspot_Login_URL</th>
                <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Security_Layer</th>
                <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
              {filteredConnections.map((c) => (
                <tr key={c.id || c.mikrotik} className={`transition-colors group ${
                  editingId === c.id ? "bg-amber-500/5 hover:bg-amber-500/10" : "hover:bg-slate-50/50 dark:hover:bg-gray-900/40"
                }`}>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-slate-100 dark:bg-gray-700 rounded-lg group-hover:scale-110 transition-all shadow-inner">
                        <ServerIcon className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-blue-600" />
                      </div>
                      <span className="font-black text-slate-800 dark:text-white text-xs tracking-tight italic">{c.mikrotik}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-black text-slate-600 dark:text-slate-300 italic">{c.host}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Port_ {c.port}</p>
                  </td>
                  
                  {/* CREDENTIAL DISPLAY VIEW WITH INTEGRATED OVERLAY COPY INLINE ACTION LOGIC */}
                  <td className="px-6 py-5">
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold group/user max-w-fit">
                        <UserIcon className="w-3.5 h-3.5 opacity-40 text-blue-500" />
                        <span>{c.username || "---"}</span>
                        {c.username && (
                          <button
                            type="button"
                            onClick={() => handleCopyToClipboard(c.id, "username", c.username)}
                            className="p-0.5 rounded text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 opacity-0 group-hover/user:opacity-100 transition-all"
                            title="Copy Username"
                          >
                            {copiedKey === `${c.id}-username` ? (
                              <span className="text-[7px] font-black text-emerald-500 px-0.5">COPIED!</span>
                            ) : (
                              <ClipboardIcon className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 group/pass max-w-fit">
                        <KeyIcon className="w-3.5 h-3.5 opacity-40 text-blue-500" />
                        <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                          {visibleCredentials[c.id] ? ((c as any).password || "••••••••") : "••••••••"}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => toggleRowCredentialVisibility(c.id)}
                            className="text-[9px] font-black uppercase text-blue-500 tracking-wider hover:underline"
                          >
                            {visibleCredentials[c.id] ? "Hide" : "Show"}
                          </button>
                          {(c as any).password && (
                            <button
                              type="button"
                              onClick={() => handleCopyToClipboard(c.id, "password", (c as any).password)}
                              className="p-0.5 rounded text-slate-400 hover:text-blue-500 dark:hover:text-blue-400  group-hover/pass:opacity-100 transition-all"
                              title="Copy Decrypted Password"
                            >
                              {copiedKey === `${c.id}-password` ? (
                                <span className="text-[7px] font-black text-emerald-500 px-0.5">COPIED!</span>
                              ) : (
                                <ClipboardIcon className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* HOTSPOT URL DATA FIELD WITH INLINE COPY LOGIC */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 group/copy">
                      <p className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 max-w-[140px] truncate italic">
                        {(c as any).hotspot_login_url || "---"}
                      </p>
                      {(c as any).hotspot_login_url && (c as any).hotspot_login_url !== "---" && (
                        <button
                          type="button"
                          onClick={() => handleCopyToClipboard(c.id, "url", (c as any).hotspot_login_url)}
                          className="p-1 rounded bg-slate-100 dark:bg-gray-700 text-slate-400 hover:text-blue-500 dark:hover:text-blue-400  group-hover/copy:opacity-100 transition-all shadow-sm"
                          title="Copy URL"
                        >
                          {copiedKey === `${c.id}-url` ? (
                            <span className="text-[8px] font-black text-emerald-500 tracking-tighter px-0.5">COPIED!</span>
                          ) : (
                            <ClipboardIcon className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
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
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => handleEditInit(c)} 
                        className="p-2.5 text-slate-300 hover:text-amber-500 dark:text-slate-600 dark:hover:text-amber-400 hover:bg-amber-500/5 rounded-xl transition-all"
                        title="Edit Connection Details"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(c.id)} 
                        className="p-2.5 text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all"
                        title="Decommission Connection"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!filteredConnections.length && !loading) && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
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
  );
}