import { useEffect, useState, useMemo } from "react";
import type { Plan } from "../../types/plan";
import { listMikrotiks, type MikrotikDevice } from "../../types/device";
import { listPlans, createPlan, deletePlan } from "../../api/plans";

import { 
  PlusIcon, 
  TrashIcon, 
  SignalIcon, 
  ClockIcon, 
  BanknotesIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  PencilSquareIcon
} from "@heroicons/react/24/outline";

const COMMON_SPEEDS = ["1M/1M", "2M/2M", "3M/3M", "5M/5M", "8M/8M", "10M/10M", "15M/15M", "20M/20M"];

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [mikrotiks, setMikrotiks] = useState<MikrotikDevice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const [form, setForm] = useState({
    name: "",
    price: "",
    duration_minutes: "",
    rate_limit: "5M/5M",
    mikrotik: "",
  });

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [plansData, mikrotiksData] = await Promise.all([
        listPlans(),
        listMikrotiks(),
      ]);
      setPlans(plansData || []);
      setMikrotiks(mikrotiksData || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const filteredPlans = useMemo(() => {
    return plans.filter(p => 
      (p.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (p.rate_limit?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );
  }, [plans, searchTerm]);

  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  const paginatedPlans = filteredPlans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function handleEdit(p: Plan) {
    setForm({
      name: p.name,
      price: String(p.price),
      duration_minutes: String(p.duration_minutes),
      rate_limit: p.rate_limit || "5M/5M",
      mikrotik: String(p.mikrotik_profile || ""),
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await createPlan({
        name: form.name,
        price: Number(form.price),
        duration_minutes: Number(form.duration_minutes),
        rate_limit: form.rate_limit,
        mikrotik_profile: form.mikrotik,
      });
      setForm({ name: "", price: "", duration_minutes: "", rate_limit: "5M/5M", mikrotik: "" });
      setShowForm(false);
      loadData();
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this plan?")) return;
    await deletePlan(id);
    loadData();
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-fadeIn dark:bg-gray-900 min-h-screen transition-colors">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Service Plans</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Configure and deploy automated billing packages.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={loadData}
            className="p-2.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            title="Refresh Data"
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => {
              setShowForm(!showForm);
              if(showForm) setForm({ name: "", price: "", duration_minutes: "", rate_limit: "5M/5M", mikrotik: "" });
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200 dark:shadow-none transition-all"
          >
            {showForm ? <XMarkIcon className="w-4 h-4 stroke-[3]" /> : <PlusIcon className="w-4 h-4 stroke-[3]" />}
            {showForm ? "Cancel" : "New Package"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-900/20 border-l-4 border-rose-500 p-4 rounded-xl flex items-center gap-3 animate-shake">
          <p className="text-rose-700 dark:text-rose-400 text-[10px] font-black uppercase">{error}</p>
        </div>
      )}

      {/* Toggleable Form Card */}
      {showForm && (
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-slideDown">
          <div className="p-6 border-b border-slate-50 dark:border-slate-700 bg-slate-50/30 dark:bg-gray-800/50">
            <h2 className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-[0.2em] flex items-center gap-2 italic">
              <SignalIcon className="w-5 h-5 text-blue-600 stroke-[3]" />
              Manual Configuration Override
            </h2>
          </div>
          
          <form onSubmit={handleCreate} className="p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Plan Identity</label>
                <input
                  className="w-full bg-slate-50 dark:bg-gray-900/50 border-none focus:ring-2 focus:ring-blue-500 p-4 rounded-lg text-sm font-black dark:text-white transition-all outline-none italic uppercase"
                  placeholder="e.g. ULTRA_FIBER_10M"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Tariff (KES)</label>
                <div className="relative">
                  <BanknotesIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input
                    className="w-full bg-slate-50 dark:bg-gray-900/50 border-none focus:ring-2 focus:ring-blue-500 pl-12 p-4 rounded-lg text-sm font-black dark:text-white outline-none italic"
                    placeholder="0.00"
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Time Limit (Mins)</label>
                <div className="relative">
                  <ClockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input
                    className="w-full bg-slate-50 dark:bg-gray-900/50 border-none focus:ring-2 focus:ring-blue-500 pl-12 p-4 rounded-lg text-sm font-black dark:text-white outline-none italic"
                    placeholder="1440"
                    type="number"
                    value={form.duration_minutes}
                    onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Bandwidth Cap</label>
                <select
                  className="w-full bg-slate-50 dark:bg-gray-900/50 border-none focus:ring-2 focus:ring-blue-500 p-4 rounded-lg text-sm font-black dark:text-white outline-none cursor-pointer appearance-none italic"
                  value={form.rate_limit}
                  onChange={(e) => setForm({ ...form, rate_limit: e.target.value })}
                >
                  {COMMON_SPEEDS.map(speed => (
                    <option key={speed} value={speed}>{speed} (Sync)</option>
                  ))}
                  <option value="">Unlimited / Manual</option>
                </select>
              </div>

              <div className="space-y-2 lg:col-span-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Assigned Router</label>
                <select
                  className="w-full bg-slate-50 dark:bg-gray-900/50 border-none focus:ring-2 focus:ring-blue-500 p-4 rounded-lg text-sm font-black dark:text-white outline-none cursor-pointer italic"
                  value={form.mikrotik}
                  onChange={(e) => setForm({ ...form, mikrotik: e.target.value })}
                  required
                >
                  <option value="">Select Target MikroTik...</option>
                  {mikrotiks.map((mt) => (
                    <option key={mt.id} value={mt.id}>{mt.identity_name} ({mt.api_ip || mt.api_ip})</option>
                  ))}
                </select>
              </div>

              <button
                disabled={!form.mikrotik || loading}
                className="lg:col-span-3 bg-slate-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white font-black py-4 rounded-lg shadow-xl transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-[0.2em]"
              >
                {loading ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <PlusIcon className="w-5 h-5 stroke-[3]" />}
                Push Configuration to NAS
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        
        {/* Search Integration */}
        <div className="p-4 border-b border-slate-50 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/20 dark:bg-gray-800/40">
           <div className="relative w-full max-w-xs">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search Profiles..." 
                className="w-full pl-11 pr-4 py-2 bg-white dark:bg-gray-900 border border-slate-100 dark:border-slate-700 rounded-lg text-[10px] font-black uppercase tracking-widest dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                value={searchTerm}
                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
              />
           </div>
           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">
              {filteredPlans.length} records found
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-gray-900/50 text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black italic">
                <th className="px-6 py-5">Profile</th>
                <th className="px-4 py-5 hidden md:table-cell text-center">Cost</th>
                <th className="px-4 py-5 hidden md:table-cell text-center">Expiry</th>
                <th className="px-6 py-5 text-center">Limit</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {paginatedPlans.map((p) => (
                <tr key={p.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-black text-[12px] text-slate-600 dark:text-slate-200 tracking-tight">{p.name}</span>
                      <span className="text-[10px] text-slate-400 md:hidden flex items-center gap-1 mt-1 font-bold">
                         {p.price} KES • {p.duration_minutes}m
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-5 hidden md:table-cell text-center font-black text-slate-600 dark:text-slate-400 text-xs">
                    {p.price}
                  </td>
                  <td className="px-4 py-5 hidden md:table-cell text-center">
                    <div className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase italic">
                      {p.duration_minutes}m
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-[10px] font-black bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-lg uppercase tracking-tighter">
                      {p.rate_limit || "MAX"}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-2 text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                        title="Edit Plan"
                      >
                        <PencilSquareIcon className="w-4 h-4 stroke-[2]" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                        title="Delete Plan"
                      >
                        <TrashIcon className="w-4 h-4 stroke-[2]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {!paginatedPlans.length && (
            <div className="py-20 text-center space-y-3 dark:bg-gray-800">
              <SignalIcon className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">No matching records.</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="px-8 py-5 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-gray-800">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
             {currentPage} / {totalPages || 1}
           </span>
           <div className="flex gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(c => c - 1)}
                className="p-2 border border-slate-100 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-20 transition-all dark:text-white"
              >
                <ChevronLeftIcon className="w-4 h-4 stroke-[3]" />
              </button>
              <button 
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(c => c + 1)}
                className="p-2 border border-slate-100 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-20 transition-all dark:text-white"
              >
                <ChevronRightIcon className="w-4 h-4 stroke-[3]" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}