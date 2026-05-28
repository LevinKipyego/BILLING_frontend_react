import React, { useEffect, useState, useCallback, useMemo } from "react";
import { 
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
  ChevronRightIcon,
  ServerIcon,
  //RadioIcon
} from "@heroicons/react/24/outline";
import type { NAS } from "../../types/nas";
import { listNAS, createNAS, updateNAS, deleteNAS } from "../../api/nas";

export default function NASPage() {
  const [items, setItems] = useState<NAS[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

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
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => { loadNAS(); }, [loadNAS]);

  // Compute Available Categories dynamically based on data state
  const categories = useMemo(() => {
    const types = new Set(items.map(item => (item.type || "other").toUpperCase()));
    return ["ALL", ...Array.from(types)];
  }, [items]);

  // Mixed Search & Category Evaluation Loop
  const filteredItems = useMemo(() => {
    return items.filter(n => {
      const matchesSearch = 
        (n.nasname?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (n.shortname?.toLowerCase() || "").includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === "ALL" || 
        (n.type || "other").toUpperCase() === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, selectedCategory]);

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
  }

  function closeFormModal() {
    setEditingId(null);
    setForm(initialForm);
    setShowForm(false);
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="relative flex items-center justify-center w-32 h-32">
          {/* Radial Pulse Waves */}
          <div className="absolute inset-0 rounded-full bg-indigo-500/5 animate-ping duration-1000" />
          <div className="absolute w-24 h-24 rounded-full bg-blue-500/10 dark:bg-blue-400/5 animate-pulse" />
          
          {/* Outer Rotating Target Interceptor */}
          <div className="absolute w-28 h-28 rounded-full border-2 border-dashed border-indigo-500/30 dark:border-indigo-400/20 animate-[spin_12s_linear_infinite]" />
          
          {/* Main Core Loading Node */}
          <div className="absolute w-16 h-16 rounded-full border-2 border-slate-200 dark:border-gray-800 border-t-indigo-600 dark:border-t-blue-400 animate-[spin_1.5s_cubic-bezier(0.5,0,0.5,1)_infinite]" />
          <ServerIcon className="w-6 h-6 text-indigo-600 dark:text-blue-400 relative z-10" />
        </div>
        <div className="mt-8 text-center space-y-2">
          <h2 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-[0.25em]">Polling Radius Grid</h2>
          <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest max-w-[200px] mx-auto leading-relaxed">
            Mapping Active Access Server Gateways...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-3 md:p-8 space-y-4 md:space-y-6 animate-fadeIn dark:bg-gray-900 min-h-screen transition-colors">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase flex items-center gap-2">
              NAS Infrastructure
            </h1>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
          </div>
          <p className="text-[10px] md:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-tight font-bold">
            RADIUS Network Access Server configurations.
          </p>
        </div>
        <div className="flex items-center justify-between md:justify-end gap-3">
          <button 
            onClick={loadNAS}
            className="p-2.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all border border-transparent dark:border-gray-800"
            title="Refresh Database"
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-blue-600 hover:bg-black text-white px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-md transition-all outline-none"
          >
            <PlusIcon className="w-4 h-4 stroke-[3]" />
            <span>Add NAS Server</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg text-red-600 dark:text-red-400 text-[10px] font-black uppercase flex items-center gap-3 animate-shake mx-1">
          <InformationCircleIcon className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* FILTER TERMINAL, CATEGORY CHIPS & SEARCH CONTROLS */}
      <div className="bg-slate-50 dark:bg-gray-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-gray-800/80 space-y-3.5 mx-1">
        
        {/* Category Filtration Track */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-200/50 dark:border-gray-800/60 pb-2.5 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                  selectedCategory === cat 
                    ? "bg-slate-900 dark:bg-blue-600 text-white shadow-xs" 
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-white bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800"
                }`}
              >
                {cat === "ALL" ? "All Equipment Nodes" : `${cat} Clusters`}
              </button>
            ))}
          </div>
        </div>

        {/* Search Parameter Inputs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-xs">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Filter NAS nodes by identity or address..." 
              className="w-full pl-11 pr-4 py-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-lg text-xs font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-2xs"
              value={searchTerm}
              onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
            />
          </div>
          <div className="text-[9px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest text-center sm:text-right w-full sm:w-auto font-mono">
            Filtered Data: {filteredItems.length} of {items.length} Modules Online
          </div>
        </div>
      </div>

      {/* MODAL POPUP FORM OVERLAY LAYER */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs animate-fadeIn">
          <section className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 dark:border-gray-700/80 overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 md:p-5 border-b border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/80 flex items-center justify-between sticky top-0 z-10">
              <h2 className="text-[11px] font-black text-gray-800 dark:text-white uppercase tracking-[0.2em] flex items-center gap-2">
                {editingId ? <PencilSquareIcon className="w-4 h-4 text-blue-600" /> : <PlusIcon className="w-4 h-4 text-blue-600" />}
                {editingId ? `Edit Matrix Node Identity` : "RADIUS Configuration Terminal"}
              </h2>
              <button 
                onClick={closeFormModal}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-md transition-colors"
              >
                <XMarkIcon className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
            
            {/* Modal Body Container */}
            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">NAS IP / Hostname</label>
                  <div className="relative">
                    <GlobeAltIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      required
                      className="w-full bg-gray-50 dark:bg-gray-900/50 border border-transparent focus:ring-2 focus:ring-blue-500 pl-11 p-3 rounded-lg text-xs font-bold text-slate-700 dark:text-white transition-all outline-none"
                      placeholder="10.0.0.1"
                      value={form.nasname || ""}
                      onChange={(e) => setForm({ ...form, nasname: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Short Name</label>
                  <input
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-transparent focus:ring-2 focus:ring-blue-500 p-3 rounded-lg text-xs font-bold text-slate-700 dark:text-white outline-none"
                    placeholder="Core_Router"
                    value={form.shortname || ""}
                    onChange={(e) => setForm({ ...form, shortname: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Shared Secret</label>
                  <div className="relative">
                    <KeyIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      required
                      className="w-full bg-gray-50 dark:bg-gray-900/50 border border-transparent focus:ring-2 focus:ring-blue-500 pl-11 p-3 rounded-lg text-xs font-bold text-slate-700 dark:text-white outline-none"
                      placeholder="Secret Key"
                      value={form.secret || ""}
                      onChange={(e) => setForm({ ...form, secret: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Ports</label>
                  <input
                    type="number"
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-transparent focus:ring-2 focus:ring-blue-500 p-3 rounded-lg text-xs font-bold text-slate-700 dark:text-white outline-none"
                    placeholder="1700"
                    value={form.ports || ""}
                    onChange={(e) => setForm({ ...form, ports: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Server Type</label>
                  <div className="relative">
                    <CpuChipIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      className="w-full bg-gray-50 dark:bg-gray-900/50 border border-transparent focus:ring-2 focus:ring-blue-500 pl-11 p-3 rounded-lg text-xs font-bold text-slate-700 dark:text-white outline-none"
                      placeholder="Mikrotik"
                      value={form.type || ""}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Description / Location</label>
                  <textarea
                    rows={2}
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-transparent focus:ring-2 focus:ring-blue-500 p-3 rounded-lg text-xs font-bold text-slate-700 dark:text-white outline-none resize-none"
                    placeholder="Main Gateway Infrastructure"
                    value={form.description || ""}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
              </div>

              {/* Modal Footer CTA */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-end gap-3 bg-white dark:bg-gray-800 sticky bottom-0">
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-700/60 transition-all outline-none"
                >
                  Close
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className={`px-5 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest text-white transition-all shadow-md active:scale-[0.98] outline-none ${
                    editingId ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-black'
                  }`}
                >
                  {editingId ? "Update Node" : "Commit to RADIUS"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* 1. INDEPENDENT MOBILE CARDS COMPONENT GRID */}
      <div className="block md:hidden space-y-3 mx-1">
        {paginatedItems.map((nas) => (
          <div 
            key={nas.id} 
            className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700/80 rounded-xl p-4 space-y-3.5 shadow-2xs hover:border-slate-300 dark:hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="block font-bold text-sm text-slate-900 dark:text-slate-100 antialiased tracking-normal">
                  {nas.nasname}
                </span>
                <span className="block text-xs font-medium text-slate-400 dark:text-slate-500 tracking-normal">
                  {nas.shortname || 'No Configured Alias'}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className="text-[9px] font-black bg-slate-100 dark:bg-gray-900 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-gray-700 px-2 py-0.5 rounded uppercase tracking-wider">
                  {nas.type}
                </span>
                <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 font-bold uppercase">
                  Port: {nas.ports}
                </span>
              </div>
            </div>

            {nas.description && (
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-2 bg-slate-50 dark:bg-gray-900/30 p-2.5 rounded-md border border-slate-100 dark:border-gray-900/60">
                {nas.description}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100 dark:border-gray-700/50">
              <button 
                onClick={() => startEdit(nas)} 
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-md transition-all active:scale-95"
              >
                <PencilSquareIcon className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button 
                onClick={() => handleDelete(nas.id)} 
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md transition-all active:scale-95"
              >
                <TrashIcon className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 2. DESKTOP WORKSPACE TABLE HOUSING */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-xs border border-gray-100 dark:border-gray-700 overflow-hidden mx-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-900/50 text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-[0.2em] font-black border-b border-gray-100 dark:border-gray-700/50">
                <th className="px-6 py-4.5">NAS Identity</th>
                <th className="px-4 py-4.5 text-center">Connection</th>
                <th className="px-4 py-4.5 text-center">Description</th>
                <th className="px-8 py-4.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {paginatedItems.map((nas) => (
                <tr key={nas.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-[13px] text-gray-800 dark:text-gray-200 tracking-normal">{nas.nasname}</span>
                      <span className="text-[11px] text-gray-400 font-medium tracking-normal">{nas.shortname || 'No Alias'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-lg">
                        {nas.type}
                      </span>
                      <span className="text-[9px] text-gray-400 mt-1 font-bold">PORT: {nas.ports}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium line-clamp-1">
                      {nas.description || '---'}
                    </p>
                  </td>
                  <td className="px-8 py-4 text-right">
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
        </div>
      </div>

      {/* EMPTY DATASET NOTIFICATION BANNER */}
      {!paginatedItems.length && (
        <div className="py-20 text-center space-y-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700/80 mx-1">
          <GlobeAltIcon className="w-10 h-10 text-gray-200 dark:text-gray-700 mx-auto" />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No NAS servers found matching conditions.</p>
        </div>
      )}

      {/* Pagination Controls Footer Container */}
      <div className="px-5 md:px-8 py-4 border border-gray-150 dark:border-gray-700 rounded-lg flex items-center justify-between bg-white dark:bg-gray-800 mx-1">
         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
           {currentPage} / {totalPages || 1}
         </span>
         <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(c => c - 1)}
              className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-20 transition-all dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
            >
              <ChevronLeftIcon className="w-4 h-4 stroke-[3]" />
            </button>
            <button 
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(c => c + 1)}
              className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-20 transition-all dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
            >
              <ChevronRightIcon className="w-4 h-4 stroke-[3]" />
            </button>
         </div>
      </div>
    </div>
  );
}