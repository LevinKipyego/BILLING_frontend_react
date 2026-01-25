import { useEffect, useState, useCallback } from "react";
import { 
  ServerStackIcon, 
  PlusIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  KeyIcon, 
  GlobeAltIcon,
  CpuChipIcon,
  HashtagIcon,
  InformationCircleIcon,
  XMarkIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import type { NAS } from "../../types/nas";
import { listNAS, createNAS, updateNAS, deleteNAS } from "../../api/nas";

export default function NASPage() {
  const [items, setItems] = useState<NAS[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const initialForm: Partial<NAS> = {
    nasname: "",
    shortname: "",
    type: "other",
    secret: "",
    server: "",
    community: "",
    ports: 0,
    description: "",
  };

  const [form, setForm] = useState<Partial<NAS>>(initialForm);

  const loadNAS = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await listNAS());
    } catch (e: any) {
      setError(e.message || "Failed to fetch NAS entries from RADIUS.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadNAS(); }, [loadNAS]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await updateNAS(editingId, form);
      } else {
        await createNAS(form);
      }
      setForm(initialForm);
      setEditingId(null);
      loadNAS();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure? Deleting this NAS will stop RADIUS authentication for this server.")) return;
    try {
      await deleteNAS(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (e: any) {
      setError("Failed to delete NAS entry.");
    }
  }

  function startEdit(nas: NAS) {
    setEditingId(nas.id);
    setForm(nas);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <ServerStackIcon className="w-8 h-8 text-indigo-600" />
            NAS Management
          </h1>
          <p className="text-sm text-gray-500">Configure Network Access Servers for your RADIUS database.</p>
        </div>
        <button 
          onClick={loadNAS}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
        >
          <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Database
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm flex items-center gap-3">
          <InformationCircleIcon className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Modern Form Card */}
      <div className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 ${editingId ? 'border-indigo-500 ring-4 ring-indigo-50' : 'border-gray-100'}`}>
        <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
            {editingId ? <PencilSquareIcon className="w-5 h-5 text-indigo-600" /> : <PlusIcon className="w-5 h-5 text-indigo-600" />}
            {editingId ? `Editing NAS: ${form.nasname}` : "Register New NAS"}
          </h2>
          {editingId && (
            <button onClick={() => { setEditingId(null); setForm(initialForm); }} className="text-xs font-bold text-gray-400 hover:text-red-500 flex items-center gap-1">
              <XMarkIcon className="w-4 h-4" /> Cancel Edit
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="p-6">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
    
    {/* NAS IP / Hostname */}
    <div className="space-y-1">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">NAS IP / Hostname</label>
      <div className="relative">
        <GlobeAltIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          required
          placeholder="10.0.0.1"
          value={form.nasname || ""}
          onChange={(e) => setForm({ ...form, nasname: e.target.value })}
          className="w-full border border-gray-200 pl-9 pr-4 py-2.5 rounded-xl text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
        />
      </div>
    </div>

    {/* Short Name */}
    <div className="space-y-1">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Short Name</label>
      <div className="relative">
        <InformationCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          placeholder="Core_Router"
          value={form.shortname || ""}
          onChange={(e) => setForm({ ...form, shortname: e.target.value })}
          className="w-full border border-gray-200 pl-9 pr-4 py-2.5 rounded-xl text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
        />
      </div>
    </div>

    {/* Shared Secret */}
    <div className="space-y-1">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Shared Secret</label>
      <div className="relative">
        <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="password"
          placeholder="testing123"
          value={form.secret || ""}
          onChange={(e) => setForm({ ...form, secret: e.target.value })}
          className="w-full border border-gray-200 pl-9 pr-4 py-2.5 rounded-xl text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
        />
      </div>
    </div>

    {/* Ports */}
    <div className="space-y-1">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ports</label>
      <div className="relative">
        <HashtagIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="number"
          placeholder="1700"
          value={form.ports || ""}
          onChange={(e) => setForm({ ...form, ports: parseInt(e.target.value) || 0 })}
          className="w-full border border-gray-200 pl-9 pr-4 py-2.5 rounded-xl text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
        />
      </div>
    </div>

    {/* Server Name */}
    <div className="space-y-1">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Server Name</label>
      <div className="relative">
        <ServerStackIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          placeholder="radius_main"
          value={form.server || ""}
          onChange={(e) => setForm({ ...form, server: e.target.value })}
          className="w-full border border-gray-200 pl-9 pr-4 py-2.5 rounded-xl text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
        />
      </div>
    </div>

    {/* SNMP Community */}
    <div className="space-y-1">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">SNMP Community</label>
      <div className="relative">
        <GlobeAltIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          placeholder="public"
          value={form.community || ""}
          onChange={(e) => setForm({ ...form, community: e.target.value })}
          className="w-full border border-gray-200 pl-9 pr-4 py-2.5 rounded-xl text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
        />
      </div>
    </div>

    {/* Device Type */}
    <div className="space-y-1">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Device Type</label>
      <div className="relative">
        <CpuChipIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          placeholder="mikrotik"
          value={form.type || ""}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full border border-gray-200 pl-9 pr-4 py-2.5 rounded-xl text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
        />
      </div>
    </div>

    {/* Description */}
    <div className="space-y-1">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
      <div className="relative">
        <InformationCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          placeholder="Main Gateway"
          value={form.description || ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border border-gray-200 pl-9 pr-4 py-2.5 rounded-xl text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
        />
      </div>
    </div>

  </div>

  <button 
    type="submit"
    className={`mt-6 w-full py-3 rounded-xl font-bold text-white transition-all shadow-lg active:scale-[0.98] ${
      editingId ? 'bg-indigo-600 shadow-indigo-100 hover:bg-indigo-700' : 'bg-blue-600 shadow-gray-100 hover:bg-black'
    }`}
  >
    {editingId ? "Update RADIUS Entry" : "Save to RADIUS Database"}
  </button>
</form>
      </div>

      {/* Enhanced Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">NAS Identity</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Connection</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hidden lg:table-cell">SNMP/Radius</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((nas) => (
                <tr key={nas.id} className="hover:bg-indigo-50/20 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800">{nas.nasname}</p>
                    <p className="text-[10px] text-gray-400 font-medium tracking-wide italic">{nas.shortname || 'No Alias'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-md">{nas.type}</span>
                    <p className="text-[10px] text-gray-400 mt-1">Ports: {nas.ports}</p>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <p className="text-xs text-gray-500 font-medium">Srv: {nas.server || '-'}</p>
                    <p className="text-xs text-gray-500 font-medium">Comm: {nas.community || '-'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-gray-500 line-clamp-1">{nas.description || '---'}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => startEdit(nas)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(nas.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && items.length === 0 && (
            <div className="p-16 text-center">
              <GlobeAltIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-medium tracking-tight">Your RADIUS nas table is empty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Reusable Sub-component for form cleanliness
function FormInput({ label, icon: Icon, value, onChange, placeholder, type = "text", required = false }: any) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type={type}
          required={required}
          placeholder={placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-200 pl-9 pr-4 py-2.5 rounded-xl text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
        />
      </div>
    </div>
  );
}