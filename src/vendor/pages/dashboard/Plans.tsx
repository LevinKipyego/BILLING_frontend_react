import { useEffect, useState, useMemo } from "react";
import type { Plan } from "../../types/plan";
import { listMikrotiks, type MikrotikDevice } from "../../types/device";
import { listPlans, createPlan, updatePlan, deletePlan } from "../../api/plans";

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
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

const COMMON_SPEEDS = ["1M/1M", "2M/2M", "3M/3M", "5M/5M", "8M/8M", "10M/10M", "15M/15M", "20M/20M"];
const SERVICE_TYPES = [
  { id: "PPPOE", label: "PPPoE Broadband Connection" },
  { id: "HOTSPOT", label: "Hotspot Captive Portal" },
  { id: "IPOE", label: "IPoE / Static Allocation" }
];
type TimeUnit = "minutes" | "hours" | "days";

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [mikrotiks, setMikrotiks] = useState<MikrotikDevice[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Custom Time Conversion & State Form Fields
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("days");
  const [durationInput, setDurationInput] = useState("");
  
  const [form, setForm] = useState({
    name: "",
    price: "",
    rate_limit: "5M/5M",
    mikrotik: "",
    service_type: "PPPOE"
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
      setInitialLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  // Reset pagination index upon configuration filter modification
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredPlans = useMemo(() => {
    return plans.filter(p => 
      (p.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (p.rate_limit?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );
  }, [plans, searchTerm]);

  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  
  const paginatedPlans = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPlans.slice(start, start + itemsPerPage);
  }, [filteredPlans, currentPage]);

  // Compute live duration feedback helper calculation context 
  const calculatedMinutesFeedback = useMemo(() => {
    const value = parseFloat(durationInput);
    if (isNaN(value) || value <= 0) return 0;
    if (timeUnit === "hours") return Math.round(value * 60);
    if (timeUnit === "days") return Math.round(value * 1440);
    return Math.round(value);
  }, [durationInput, timeUnit]);

  function handleEdit(p: Plan) {
    setEditingId(p.id);
    
    const mins = p.duration_minutes || 0;
    if (mins % 1440 === 0 && mins > 0) {
      setTimeUnit("days");
      setDurationInput(String(mins / 1440));
    } else if (mins % 60 === 0 && mins > 0) {
      setTimeUnit("hours");
      setDurationInput(String(mins / 60));
    } else {
      setTimeUnit("minutes");
      setDurationInput(String(mins));
    }

    setForm({
      name: p.name,
      price: String(p.price),
      rate_limit: p.rate_limit || "5M/5M",
      mikrotik: String(p.mikrotik_profile || ""),
      service_type: (p as any).service_type || "PPPOE"
    });
    setShowForm(true);
  }

  function closeFormModal() {
    setEditingId(null);
    setDurationInput("");
    setTimeUnit("days");
    setForm({ name: "", price: "", rate_limit: "5M/5M", mikrotik: "", service_type: "PPPOE" });
    setShowForm(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (calculatedMinutesFeedback <= 0) {
      setError("Please designate a viable duration period parameter value.");
      return;
    }

    try {
      const payload = {
        name: form.name,
        price: Number(form.price),
        duration_minutes: calculatedMinutesFeedback,
        rate_limit: form.rate_limit,
        mikrotik_profile: form.mikrotik,
        mikrotik:form.mikrotik,
        service_type: form.service_type
      };

      if (editingId) {
        await updatePlan(editingId, payload);
      } else {
        await createPlan(payload);
      }
      closeFormModal();
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

  if (initialLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="relative flex items-center justify-center w-24 h-24">
          <div className="absolute w-16 h-16 rounded-full border-4 border-blue-500/10 dark:border-blue-400/10 border-t-blue-600 dark:border-t-blue-400 animate-spin" />
          <div className="absolute w-24 h-24 rounded-full border border-dashed border-slate-200 dark:border-slate-800 animate-[spin_20s_linear_infinite]" />
          <SignalIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-pulse" />
        </div>
        <div className="mt-6 text-center space-y-1.5">
          <h2 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-[0.2em]">Synchronizing Registry</h2>
          <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-widest animate-pulse">Compiling Profile Matrix Blueprints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-3 md:p-8 space-y-4 md:space-y-6 animate-fadeIn dark:bg-gray-900 min-h-screen transition-colors">
      
      {/* Header Container */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Service Plans
          </h1>
          <p className="text-[10px] md:text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight">
            Configure and deploy automated billing packages.
          </p>
        </div>
        <div className="flex items-center justify-between md:justify-end gap-3">
          <button 
            onClick={loadData}
            className="p-2.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all border border-transparent dark:border-gray-800"
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-blue-600 hover:bg-black text-white px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-md transition-all outline-none"
          >
            <PlusIcon className="w-4 h-4 stroke-[3]" />
            <span>New Package</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-900/20 border-l-4 border-rose-500 p-4 rounded-lg flex items-center gap-3 animate-shake mx-1">
          <p className="text-rose-700 dark:text-rose-400 text-[10px] font-black uppercase">{error}</p>
        </div>
      )}

      {/* SEARCH PANEL BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1">
        <div className="relative w-full sm:max-w-xs">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search service parameters..." 
            className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700/80 rounded-lg text-xs font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-2xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center sm:text-right w-full sm:w-auto">
          {filteredPlans.length} Packages Configured
        </div>
      </div>

      {/* MODAL DIALOG CONTAINER */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs animate-fadeIn">
          <section className="bg-white dark:bg-gray-800 w-full max-w-3xl rounded-xl shadow-2xl border border-slate-200 dark:border-gray-700/80 overflow-hidden animate-scaleUp max-h-[92vh] flex flex-col">
            
            <div className="p-4 md:p-5 border-b border-slate-100 dark:border-gray-700/60 bg-slate-50/50 dark:bg-gray-800/80 flex items-center justify-between sticky top-0 z-10">
              <h2 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-[0.2em] flex items-center gap-2">
                <SignalIcon className="w-5 h-5 text-blue-600 stroke-[2.5]" />
                {editingId ? "Modify Configuration Directives" : "Provision New Network Bandwidth Module"}
              </h2>
              <button onClick={closeFormModal} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-md">
                <XMarkIcon className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-4 md:p-6 space-y-5 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Plan Identity</label>
                  <input
                    required
                    className="w-full bg-slate-50 dark:bg-gray-900/50 border border-transparent focus:ring-2 focus:ring-blue-500 p-3 rounded-lg text-xs font-bold text-slate-700 dark:text-white outline-none"
                    placeholder="e.g. ULTRA_FIBER_10M"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Tariff (KES)</label>
                  <div className="relative">
                    <BanknotesIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      required
                      type="number"
                      className="w-full bg-slate-50 dark:bg-gray-900/50 border border-transparent focus:ring-2 focus:ring-blue-500 pl-11 p-3 rounded-lg text-xs font-bold text-slate-700 dark:text-white outline-none"
                      placeholder="0.00"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Service Provisioning Type</label>
                  <select
                    className="w-full bg-slate-50 dark:bg-gray-900/50 border border-transparent focus:ring-2 focus:ring-blue-500 p-3 rounded-lg text-xs font-bold text-slate-700 dark:text-white outline-none cursor-pointer"
                    value={form.service_type}
                    onChange={(e) => setForm({ ...form, service_type: e.target.value })}
                  >
                    {SERVICE_TYPES.map(srv => (
                      <option key={srv.id} value={srv.id}>{srv.label}</option>
                    ))}
                  </select>
                </div>

                {/* ADVANCED DURATION CONVERSION INTERFACE BLOCK */}
                <div className="space-y-1.5 sm:col-span-2 bg-slate-50/60 dark:bg-gray-900/40 p-3 rounded-xl border border-slate-150 dark:border-gray-700/50 flex flex-col justify-between gap-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                      Billing Validity Window
                    </label>
                    {calculatedMinutesFeedback > 0 && (
                      <span className="text-[9px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded uppercase font-mono border border-blue-100 dark:border-blue-900/20">
                        Evaluates to: {calculatedMinutesFeedback.toLocaleString()} total minutes
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <ClockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        required
                        type="number"
                        step="any"
                        placeholder={timeUnit === "days" ? "e.g. 30" : timeUnit === "hours" ? "e.g. 24" : "e.g. 60"}
                        className="w-full bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 pl-11 p-2.5 rounded-lg text-xs font-bold text-slate-700 dark:text-white outline-none"
                        value={durationInput}
                        onChange={(e) => setDurationInput(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex bg-white dark:bg-gray-900 p-1 border border-slate-200 dark:border-gray-700 rounded-lg gap-1">
                      {(["minutes", "hours", "days"] as TimeUnit[]).map((unit) => (
                        <button
                          key={unit}
                          type="button"
                          onClick={() => setTimeUnit(unit)}
                          className={`px-2.5 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all ${
                            timeUnit === unit 
                              ? "bg-slate-900 dark:bg-blue-600 text-white shadow-xs" 
                              : "text-slate-400 hover:text-slate-600 dark:hover:text-white"
                          }`}
                        >
                          {unit}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Bandwidth Cap</label>
                  <select
                    className="w-full bg-slate-50 dark:bg-gray-900/50 border border-transparent focus:ring-2 focus:ring-blue-500 p-3 rounded-lg text-xs font-bold text-slate-700 dark:text-white outline-none cursor-pointer appearance-none"
                    value={form.rate_limit}
                    onChange={(e) => setForm({ ...form, rate_limit: e.target.value })}
                  >
                    {COMMON_SPEEDS.map(speed => (
                      <option key={speed} value={speed}>{speed} (Sync Traffic)</option>
                    ))}
                    <option value="">Unlimited / Manual</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Assigned Router Gateway Target</label>
                  <select
                    required
                    className="w-full bg-slate-50 dark:bg-gray-900/50 border border-transparent focus:ring-2 focus:ring-blue-500 p-3 rounded-lg text-xs font-bold text-slate-700 dark:text-white outline-none cursor-pointer"
                    value={form.mikrotik}
                    onChange={(e) => setForm({ ...form, mikrotik: e.target.value })}
                  >
                    <option value="">Select Target Edge Router Node...</option>
                    {mikrotiks.map((mt) => (
                      <option key={mt.id} value={mt.id}>{mt.identity_name} ({mt.api_ip})</option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-gray-700/60 flex items-center justify-end gap-3 bg-white dark:bg-gray-800 sticky bottom-0">
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-700/60 transition-all outline-none"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!form.mikrotik || loading}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-black disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white font-black rounded-lg shadow-md transition-all uppercase text-xs tracking-widest flex items-center gap-2 outline-none"
                >
                  {loading ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <PlusIcon className="w-4 h-4 stroke-[2.5]" />}
                  <span>{editingId ? "Update" : "add Package"}</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* RESPONSIVE MOBILE VIEWPORTS SHELLS CONTAINER */}
      <div className="block md:hidden space-y-3 mx-1">
        {paginatedPlans.map((p) => (
          <div 
            key={p.id}
            className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700/80 rounded-xl p-4 space-y-3.5 shadow-2xs hover:border-slate-300 dark:hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <span className="block font-bold text-sm text-slate-900 dark:text-slate-100 antialiased tracking-normal">
                  {p.name}
                </span>
                <span className="inline-block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-gray-900/50 border border-slate-150 dark:border-gray-700 px-1.5 py-0.5 rounded">
                  {(p as any).service_type || "PPPOE"}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {p.price} KES
                </span>
                <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 font-bold uppercase">
                  Window: {p.duration_minutes}m
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-gray-700/50">
              <div>
                <span className="text-[10px] font-black bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 px-2 py-0.5 rounded-md uppercase tracking-normal">
                  Rate: {p.rate_limit || "MAX PIPELINE"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleEdit(p)} 
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-md"
                >
                  <PencilSquareIcon className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button 
                  onClick={() => handleDelete(p.id)} 
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-black uppercase text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 rounded-md"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                  <span>Drop</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CORE DESKTOP GRID WORKSPACE MATRIX */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-xs border border-slate-100 dark:border-slate-700 overflow-hidden mx-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-gray-900/50 text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black border-b border-slate-100 dark:border-slate-700/50">
                <th className="px-6 py-4.5">Profile Definition Matrix</th>
                <th className="px-4 py-4.5 text-center">Service Method</th>
                <th className="px-4 py-4.5 text-center">Cost Tariff</th>
                <th className="px-4 py-4.5 text-center">Expiry Matrix</th>
                <th className="px-6 py-4.5 text-center">Bandwidth Pipeline</th>
                <th className="px-8 py-4.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {paginatedPlans.map((p) => (
                <tr key={p.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-[13px] text-slate-800 dark:text-slate-200 tracking-normal">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-[10px] font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase bg-slate-100 dark:bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-200 dark:border-gray-700">
                      {(p as any).service_type || "PPPOE"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center font-bold text-slate-700 dark:text-slate-300 text-xs">
                    {p.price} KES
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase">
                      {p.duration_minutes}m
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-[10px] font-black bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-lg uppercase">
                      {p.rate_limit || "MAX PIPELINE"}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-2 text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                      >
                        <PencilSquareIcon className="w-4 h-4 stroke-[2]" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                      >
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

      {/* VACANT DATASET NOTIFICATION BOX */}
      {!paginatedPlans.length && (
        <div className="py-20 text-center space-y-3 bg-white dark:bg-gray-800 rounded-lg border border-slate-100 dark:border-slate-700/80 mx-1">
          <SignalIcon className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No matching profiles found.</p>
        </div>
      )}

      {/* SLIDING WINDOW TRUNCATED PAGINATION CONTROLS PANEL */}
      <div className="p-4 border border-slate-150 dark:border-slate-700 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 mx-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center sm:text-left">
          Showing {filteredPlans.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-{Math.min(filteredPlans.length, currentPage * itemsPerPage)} of {filteredPlans.length} plans
        </p>
        
        <div className="flex items-center gap-1.5 max-w-full justify-center">
          <button title='button'
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-20 hover:bg-slate-50 dark:hover:bg-gray-900 transition-all shrink-0 animate-none"
          >
            <ChevronLeftIcon className="w-4 h-4 stroke-[2.5]" />
          </button>

          <div className="flex flex-wrap items-center gap-1 justify-center max-w-full">
            {(() => {
              const pages = [];
              const range = 1; // Number of page numbers to print out on either side of selected frame

              for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= currentPage - range && i <= currentPage + range)) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-7 h-7 rounded-lg text-[10px] font-black transition-all shrink-0 ${
                        currentPage === i 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                        : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                      }`}
                    >
                      {i}
                    </button>
                  );
                } 
                else if (i === 2 && currentPage - range > 2) {
                  pages.push(
                    <span key="left-dots" className="px-1 text-slate-400 dark:text-slate-500 text-[10px] font-bold select-none">
                      ...
                    </span>
                  );
                  i = currentPage - range - 1;
                } 
                else if (i === currentPage + range + 1 && currentPage + range < totalPages - 1) {
                  pages.push(
                    <span key="right-dots" className="px-1 text-slate-400 dark:text-slate-500 text-[10px] font-bold select-none">
                      ...
                    </span>
                  );
                  i = totalPages - 1;
                }
              }
              return pages;
            })()}
          </div>

          <button title="Button"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-20 hover:bg-slate-50 dark:hover:bg-gray-900 transition-all shrink-0 animate-none"
          >
            <ChevronRightIcon className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

    </div>
  );
}