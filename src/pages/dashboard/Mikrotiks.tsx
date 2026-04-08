// src/pages/dashboard/mikrotiks.tsx
import { useEffect, useState, useMemo } from "react";
import {
  fetchMikrotiks,
  createMikrotik,
  deleteMikrotik,
  updateMikrotik, 
} from "../../api/devices";
import type { MikrotikDevice } from "../../types/device";
import { 
  CpuChipIcon, 
  PlusIcon, 
  TrashIcon, 
  PencilSquareIcon, 
  GlobeAltIcon, 
  HashtagIcon,
  ServerIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

export default function Mikrotiks() {
  const [devices, setDevices] = useState<MikrotikDevice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [form, setForm] = useState({
    identity_name: "",
    api_ip: "",
    serial_number: ""
  });

  const loadDevices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMikrotiks();
      setDevices(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDevices(); }, []);

  // Filter & Pagination Logic
  const filteredDevices = useMemo(() => {
    return devices.filter(d => 
      (d.identity_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (d.api_ip?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );
  }, [devices, searchTerm]);

  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);
  const paginatedDevices = filteredDevices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset pagination on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleCreateOrUpdate = async () => {
    setLoading(true);
    setError(null);
    try {
      if (editingId) {
        await updateMikrotik(editingId, form); 
      } else {
        await createMikrotik(form);
      }
      setForm({ identity_name: "", api_ip: "", serial_number: "" });
      setEditingId(null);
      setShowForm(false);
      loadDevices();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (device: MikrotikDevice) => {
    setEditingId(device.id!);
    setForm({
      identity_name: device.identity_name,
      api_ip: device.api_ip,
      serial_number: device.serial_number || ""
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this MikroTik device?")) return;
    try {
        await deleteMikrotik(id);
        loadDevices();
    } catch (err: any) {
        setError("Failed to remove device.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-fadeIn dark:bg-gray-900 min-h-screen transition-colors">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase flex items-center gap-2 italic">
            <CpuChipIcon className="w-8 h-8 text-blue-600" />
            MikroTik Nodes
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Manage and deploy router configurations.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={loadDevices}
            className="p-2.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => {
              setShowForm(!showForm);
              if(showForm) { setEditingId(null); setForm({ identity_name: "", api_ip: "", serial_number: "" }); }
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-black text-white px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg transition-all"
          >
            {showForm ? <XMarkIcon className="w-4 h-4 stroke-[3]" /> : <PlusIcon className="w-4 h-4 stroke-[3]" />}
            {showForm ? "Cancel" : "New Router"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-900/20 border-l-4 border-rose-500 p-4 rounded-xl flex items-center gap-3 animate-shake">
          <ExclamationCircleIcon className="w-5 h-5 text-rose-500" />
          <p className="text-rose-700 dark:text-rose-400 text-[10px] font-black uppercase">{error}</p>
        </div>
      )}

      {/* Form Card */}
      {showForm && (
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-slideDown">
          <div className="p-6 border-b border-slate-50 dark:border-slate-700 bg-slate-50/30 dark:bg-gray-800/50">
            <h2 className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-[0.2em] flex items-center gap-2 italic">
              {editingId ? <PencilSquareIcon className="w-5 h-5 text-blue-600" /> : <PlusIcon className="w-5 h-5 text-blue-600" />}
              {editingId ? "Update Device Parameters" : "Hardware Registration"}
            </h2>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Identity Name</label>
                <div className="relative">
                  <ServerIcon className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    className="w-full bg-slate-50 dark:bg-gray-900/50 border-none focus:ring-2 focus:ring-blue-500 p-4 pl-12 rounded-lg text-sm font-black dark:text-white transition-all outline-none italic uppercase"
                    placeholder="e.g. CORE-RT-01"
                    value={form.identity_name}
                    onChange={(e) => setForm({ ...form, identity_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Host / API IP</label>
                <div className="relative">
                  <GlobeAltIcon className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    className="w-full bg-slate-50 dark:bg-gray-900/50 border-none focus:ring-2 focus:ring-blue-500 p-4 pl-12 rounded-lg text-sm font-black dark:text-white transition-all outline-none italic"
                    placeholder="192.168.88.1"
                    value={form.api_ip}
                    onChange={(e) => setForm({ ...form, api_ip: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Serial Number</label>
                <div className="relative">
                  <HashtagIcon className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    className="w-full bg-slate-50 dark:bg-gray-900/50 border-none focus:ring-2 focus:ring-blue-500 p-4 pl-12 rounded-lg text-sm font-black dark:text-white transition-all outline-none italic"
                    placeholder="HC20-XXXX"
                    value={form.serial_number}
                    onChange={(e) => setForm({ ...form, serial_number: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleCreateOrUpdate}
              disabled={loading}
              className={`w-full mt-8 text-white font-black py-4 rounded-lg shadow-xl transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-[0.2em] active:scale-[0.98] ${
                editingId ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-black'
              }`}
            >
              {loading ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : editingId ? <PencilSquareIcon className="w-5 h-5 stroke-[3]" /> : <PlusIcon className="w-5 h-5 stroke-[3]" />}
              {editingId ? "Update Hardware Entry" : "Register Device to Cloud"}
            </button>
          </div>
        </section>
      )}

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        
        <div className="p-4 border-b border-slate-50 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/20 dark:bg-gray-800/40">
           <div className="relative w-full max-w-xs">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Find Device..." 
                className="w-full pl-11 pr-4 py-2 bg-white dark:bg-gray-900 border border-slate-100 dark:border-slate-700 rounded-lg text-[10px] font-black uppercase tracking-widest dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">
              {filteredDevices.length} Hardware Nodes
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-gray-900/50 text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black italic">
                <th className="px-6 py-5">Device Identity</th>
                <th className="px-4 py-5 text-center">Network Address</th>
                <th className="px-4 py-5 hidden md:table-cell text-center">Serial</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {paginatedDevices.map((d) => (
                <tr key={d.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <CpuChipIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-black text-[12px] text-slate-600 dark:text-slate-200 italic tracking-tight">{d.identity_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-center">
                    <span className="text-[10px] font-black bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-lg uppercase">
                      {d.api_ip}
                    </span>
                  </td>
                  <td className="px-4 py-5 hidden md:table-cell text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase italic">
                      {d.serial_number || "---"}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => startEdit(d)} className="p-2 text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all">
                        <PencilSquareIcon className="w-4 h-4 stroke-[2]" />
                      </button>
                      <button onClick={() => handleDelete(d.id!)} className="p-2 text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all">
                        <TrashIcon className="w-4 h-4 stroke-[2]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {!paginatedDevices.length && !loading && (
            <div className="py-20 text-center space-y-3 dark:bg-gray-800">
              <ServerIcon className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Inventory Empty.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="px-8 py-5 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-gray-800">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
             {currentPage} / {totalPages || 1}
           </span>
           <div className="flex gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(c => c - 1)}
                className="p-2 border border-slate-100 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-20 transition-all dark:text-white"
              >
                <ChevronLeftIcon className="w-4 h-4 stroke-[3]" />
              </button>
              <button 
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(c => c + 1)}
                className="p-2 border border-slate-100 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-20 transition-all dark:text-white"
              >
                <ChevronRightIcon className="w-4 h-4 stroke-[3]" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}