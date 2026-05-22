
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

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (editingId) {
        await updateMikrotik(editingId, form); 
      } else {
        await createMikrotik(form);
      }
      closeFormModal();
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
  };

  const closeFormModal = () => {
    setForm({ identity_name: "", api_ip: "", serial_number: "" });
    setEditingId(null);
    setShowForm(false);
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
    <div className="max-w-6xl mx-auto p-3 md:p-8 space-y-4 md:space-y-6 animate-fadeIn dark:bg-gray-900 min-h-screen transition-colors">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase flex items-center gap-2">
              <CpuChipIcon className="w-6 h-6 md:w-8 md:h-8 text-blue-600 flex-shrink-0" />
              MikroTik Nodes
            </h1>
          </div>
          <p className="text-[10px] md:text-sm text-slate-500 dark:text-slate-400 uppercase tracking-tight font-bold">
            Manage and deploy router configurations.
          </p>
        </div>
        <div className="flex items-center justify-between md:justify-end gap-3">
          <button 
            onClick={loadDevices}
            className="p-2.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all border border-transparent dark:border-gray-800"
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-blue-600 hover:bg-black text-white px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-md transition-all outline-none"
          >
            <PlusIcon className="w-4 h-4 stroke-[3]" />
            <span>New Router</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-900/20 border-l-4 border-rose-500 p-4 rounded-lg flex items-center gap-3 animate-shake mx-1">
          <ExclamationCircleIcon className="w-5 h-5 text-rose-500 flex-shrink-0" />
          <p className="text-rose-700 dark:text-rose-400 text-[10px] font-black uppercase">{error}</p>
        </div>
      )}

      {/* DETACHED OUTSIDE SEARCH BAR CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1">
        <div className="relative w-full sm:max-w-xs">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search routers by parameters..." 
            className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700/80 rounded-lg text-xs font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-2xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center sm:text-right w-full sm:w-auto">
          {filteredDevices.length} Hardware Units Listed
        </div>
      </div>

      {/* FIXED POSITION FORM OVERLAY POPUP */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs animate-fadeIn">
          <section className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 dark:border-gray-700/80 overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col">
            
            {/* Modal Window Header */}
            <div className="p-4 md:p-5 border-b border-slate-100 dark:border-gray-700/60 bg-slate-50/50 dark:bg-gray-800/80 flex items-center justify-between sticky top-0 z-10">
              <h2 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-[0.2em] flex items-center gap-2">
                {editingId ? <PencilSquareIcon className="w-4 h-4 text-blue-600" /> : <PlusIcon className="w-4 h-4 text-blue-600" />}
                {editingId ? "Update Router Configuration" : "New Node Entry Registration"}
              </h2>
              <button 
                onClick={closeFormModal}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-md transition-colors"
              >
                <XMarkIcon className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
            
            {/* Modal Input Fields Body */}
            <form onSubmit={handleCreateOrUpdate} className="p-4 md:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Identity Name</label>
                  <div className="relative">
                    <ServerIcon className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      required
                      className="w-full bg-slate-50 dark:bg-gray-900/50 border border-transparent focus:ring-2 focus:ring-blue-500 p-3 pl-11 rounded-lg text-xs font-bold text-slate-700 dark:text-white transition-all outline-none"
                      placeholder="e.g. CORE-RT-01"
                      value={form.identity_name}
                      onChange={(e) => setForm({ ...form, identity_name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Host / API IP</label>
                  <div className="relative">
                    <GlobeAltIcon className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      required
                      className="w-full bg-slate-50 dark:bg-gray-900/50 border border-transparent focus:ring-2 focus:ring-blue-500 p-3 pl-11 rounded-lg text-xs font-bold text-slate-700 dark:text-white transition-all outline-none"
                      placeholder="192.168.88.1"
                      value={form.api_ip}
                      onChange={(e) => setForm({ ...form, api_ip: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Serial Number</label>
                  <div className="relative">
                    <HashtagIcon className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      className="w-full bg-slate-50 dark:bg-gray-900/50 border border-transparent focus:ring-2 focus:ring-blue-500 p-3 pl-11 rounded-lg text-xs font-bold text-slate-700 dark:text-white transition-all outline-none"
                      placeholder="HC20-XXXX"
                      value={form.serial_number}
                      onChange={(e) => setForm({ ...form, serial_number: e.target.value })}
                    />
                  </div>
                </div>

              </div>

              {/* Action Operations Footer Container */}
              <div className="pt-4 border-t border-slate-100 dark:border-gray-700/60 flex items-center justify-end gap-3 bg-white dark:bg-gray-800 sticky bottom-0">
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-700/60 transition-all outline-none"
                >
                  Dismiss
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className={`px-5 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest text-white transition-all shadow-md active:scale-[0.98] flex items-center gap-2 outline-none ${
                    editingId ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-black'
                  }`}
                >
                  {loading ? (
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  ) : editingId ? (
                    <PencilSquareIcon className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <PlusIcon className="w-4 h-4 stroke-[2.5]" />
                  )}
                  <span>{editingId ? "Update Entry" : "Save Router"}</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* 1. SEPARATED MOBILE INDEPENDENT DEVICE CARDS */}
      <div className="block md:hidden space-y-3 mx-1">
        {paginatedDevices.map((d) => (
          <div 
            key={d.id} 
            className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700/80 rounded-xl p-4 space-y-3.5 shadow-2xs hover:border-slate-300 dark:hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="p-2 bg-slate-100 dark:bg-slate-700/60 rounded-lg text-blue-600 mt-0.5">
                  <CpuChipIcon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="block font-bold text-sm text-slate-900 dark:text-slate-100 antialiased tracking-normal">
                    {d.identity_name}
                  </span>
                  <span className="block font-mono text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                    S/N: {d.serial_number || "---"}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className="text-[10px] font-mono font-black bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 px-2 py-0.5 rounded-md uppercase tracking-wide">
                  {d.api_ip}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1.5 border-t border-slate-100 dark:border-gray-700/50">
              <button 
                onClick={() => startEdit(d)} 
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-md transition-all active:scale-95"
              >
                <PencilSquareIcon className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button 
                onClick={() => handleDelete(d.id!)} 
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 rounded-md transition-all active:scale-95"
              >
                <TrashIcon className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 2. DESKTOP SYSTEM TABULAR WRAPPER */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-xs border border-slate-100 dark:border-slate-700 overflow-hidden mx-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-gray-900/50 text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black border-b border-slate-100 dark:border-slate-700/50">
                <th className="px-6 py-4.5">Device Identity</th>
                <th className="px-4 py-4.5 text-center">Network Address</th>
                <th className="px-4 py-4.5 text-center">Serial</th>
                <th className="px-8 py-4.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {paginatedDevices.map((d) => (
                <tr key={d.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg group-hover:bg-blue-500/10 transition-colors">
                        <CpuChipIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-bold text-[13px] text-slate-800 dark:text-slate-200 tracking-normal">{d.identity_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-[10px] font-black bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-lg uppercase">
                      {d.api_ip}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                      {d.serial_number || "---"}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
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
        </div>
      </div>

      {/* FALLBACK INVENTORY VACANT STATE */}
      {!paginatedDevices.length && !loading && (
        <div className="py-20 text-center space-y-3 bg-white dark:bg-gray-800 rounded-lg border border-slate-100 dark:border-slate-700/80 mx-1">
          <ServerIcon className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Empty.</p>
        </div>
      )}

      {/* Pagination Block Footer Panel */}
      <div className="px-5 md:px-8 py-4 border border-slate-150 dark:border-slate-700 rounded-lg flex items-center justify-between bg-white dark:bg-gray-800 mx-1">
         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
           {currentPage} / {totalPages || 1}
         </span>
         <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(c => c - 1)}
              className="p-2 border border-slate-200 dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-900 disabled:opacity-20 transition-all dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
            >
              <ChevronLeftIcon className="w-4 h-4 stroke-[3]" />
            </button>
            <button 
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(c => c + 1)}
              className="p-2 border border-slate-200 dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-900 disabled:opacity-20 transition-all dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
            >
              <ChevronRightIcon className="w-4 h-4 stroke-[3]" />
            </button>
         </div>
      </div>
    </div>
  );
}
