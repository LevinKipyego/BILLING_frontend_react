import { useEffect, useState, useCallback, useMemo } from "react";
import { 
  ServerStackIcon, 
  PlusIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  KeyIcon, 
  GlobeAltIcon,
  CpuChipIcon,
  InformationCircleIcon,
  XMarkIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import type { NAS } from "../../types/nas";
import { listNAS, createNAS, updateNAS, deleteNAS } from "../../api/nas";

export default function NASPage() {
  const [items, setItems] = useState<NAS[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  // Search & Pagination Logic
  const filteredItems = useMemo(() => {
    return items.filter(n => 
      (n.nasname?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (n.shortname?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
      setShowForm(false);
      loadNAS();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure? This stops RADIUS authentication for this server.")) return;
    try {
      await deleteNAS(id);
      loadNAS();
    } catch (e: any) {
      setError("Failed to delete NAS entry.");
    }
  }

  function startEdit(nas: NAS) {
    setEditingId(nas.id);
    setForm(nas);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-fadeIn dark:bg-gray-900 min-h-screen transition-colors">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase flex items-center gap-2 italic">
            <ServerStackIcon className="w-8 h-8 text-blue-600" />
            NAS Infrastructure
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">RADIUS Network Access Server configurations.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={loadNAS}
            className="p-2.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
            title="Refresh Database"
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => {
              setShowForm(!showForm);
              if(showForm) { setEditingId(null); setForm(initialForm); }
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-black text-white px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg transition-all"
          >
            {showForm ? <XMarkIcon className="w-4 h-4 stroke-[3]" /> : <PlusIcon className="w-4 h-4 stroke-[3]" />}
            {showForm ? "Cancel" : "Add NAS Server"}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-xl text-red-600 dark:text-red-400 text-[10px] font-black uppercase flex items-center gap-3 animate-shake">
          <InformationCircleIcon className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Toggleable Form Card */}
      {showForm && (
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-slideDown">
          <div className="p-6 border-b border-gray-50 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/50">
            <h2 className="text-[10px] font-black text-gray-800 dark:text-white uppercase tracking-[0.2em] flex items-center gap-2 italic">
              {editingId ? <PencilSquareIcon className="w-5 h-5 text-blue-600" /> : <PlusIcon className="w-5 h-5 text-blue-600" />}
              {editingId ? `Update NAS: ${form.nasname}` : "RADIUS Entry Registration"}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">NAS IP / Hostname</label>
                <div className="relative">
                  <GlobeAltIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    required
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border-none focus:ring-2 focus:ring-blue-500 pl-11 p-4 rounded-lg text-sm font-black dark:text-white transition-all outline-none italic"
                    placeholder="10.0.0.1"
                    value={form.nasname || ""}
                    onChange={(e) => setForm({ ...form, nasname: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Short Name</label>
                <input
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border-none focus:ring-2 focus:ring-blue-500 p-4 rounded-lg text-sm font-black dark:text-white outline-none italic uppercase"
                  placeholder="Core_Router"
                  value={form.shortname || ""}
                  onChange={(e) => setForm({ ...form, shortname: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Shared Secret</label>
                <div className="relative">
                  <KeyIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border-none focus:ring-2 focus:ring-blue-500 pl-11 p-4 rounded-lg text-sm font-black dark:text-white outline-none italic"
                    placeholder="Secret Key"
                    value={form.secret || ""}
                    onChange={(e) => setForm({ ...form, secret: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Ports</label>
                <input
                  type="number"
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border-none focus:ring-2 focus:ring-blue-500 p-4 rounded-lg text-sm font-black dark:text-white outline-none italic"
                  placeholder="1700"
                  value={form.ports || ""}
                  onChange={(e) => setForm({ ...form, ports: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2 lg:col-span-1">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Server Type</label>
                <div className="relative">
                  <CpuChipIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border-none focus:ring-2 focus:ring-blue-500 pl-11 p-4 rounded-lg text-sm font-black dark:text-white outline-none italic uppercase"
                    placeholder="Mikrotik"
                    value={form.type || ""}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2 lg:col-span-3">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Description / Location</label>
                <input
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border-none focus:ring-2 focus:ring-blue-500 p-4 rounded-lg text-sm font-black dark:text-white outline-none italic"
                  placeholder="Main Gateway Infrastructure"
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className={`lg:col-span-4 py-4 rounded-lg font-black text-xs uppercase tracking-[0.2em] text-white transition-all shadow-xl active:scale-[0.98] ${
                  editingId ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-black'
                }`}
              >
                {editingId ? "Update RADIUS Entry" : "Save to RADIUS Database"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        
        {/* Table Head Search */}
        <div className="p-4 border-b border-gray-50 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/20 dark:bg-gray-800/40">
           <div className="relative w-full max-w-xs">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search NAS..." 
                className="w-full pl-11 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg text-[10px] font-black uppercase tracking-widest dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                value={searchTerm}
                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
              />
           </div>
           <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">
              {filteredItems.length} Registered Nodes
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-900/50 text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-[0.2em] font-black italic">
                <th className="px-6 py-5">NAS Identity</th>
                <th className="px-4 py-5 text-center">Connection</th>
                <th className="px-4 py-5 hidden lg:table-cell text-center">Description</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {paginatedItems.map((nas) => (
                <tr key={nas.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-black text-[12px] text-gray-600 dark:text-gray-200 tracking-tight uppercase italic">{nas.nasname}</span>
                      <span className="text-[10px] text-gray-400 font-bold ">{nas.shortname || 'No Alias'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded uppercase">
                        {nas.type}
                      </span>
                      <span className="text-[9px] text-gray-400 mt-1 font-bold">PORT: {nas.ports}</span>
                    </div>
                  </td>
                  <td className="px-4 py-5 hidden lg:table-cell text-center">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold italic line-clamp-1">
                      {nas.description || '---'}
                    </p>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => startEdit(nas)} className="p-2 text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all">
                        <PencilSquareIcon className="w-4 h-4 stroke-[2]" />
                      </button>
                      <button onClick={() => handleDelete(nas.id)} className="p-2 text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                        <TrashIcon className="w-4 h-4 stroke-[2]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {!paginatedItems.length && (
            <div className="py-20 text-center space-y-3 dark:bg-gray-800">
              <GlobeAltIcon className="w-10 h-10 text-gray-200 dark:text-gray-700 mx-auto" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">No NAS servers found.</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="px-8 py-5 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800">
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
             {currentPage} / {totalPages || 1}
           </span>
           <div className="flex gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(c => c - 1)}
                className="p-2 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-20 transition-all dark:text-white"
              >
                <ChevronLeftIcon className="w-4 h-4 stroke-[3]" />
              </button>
              <button 
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(c => c + 1)}
                className="p-2 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-20 transition-all dark:text-white"
              >
                <ChevronRightIcon className="w-4 h-4 stroke-[3]" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}