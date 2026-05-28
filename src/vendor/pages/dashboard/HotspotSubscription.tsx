import { useEffect, useState, useMemo } from "react";
import { fetchHotspotSubscriptions } from "../../api/hotspotsubscription";
import { apiFetch } from "../../api/client";
import type { HotspotSubscription } from "../../types/subscriptions";

import { listPlans } from "../../api/plans";
import type { Plan } from "../../types/plan";

import { 
  MagnifyingGlassIcon, 
  PlusIcon,
  ChevronLeftIcon, 
  ChevronRightIcon,
  WifiIcon,
  SignalIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowsUpDownIcon,
  UserCircleIcon,
  ClockIcon,
 
} from "@heroicons/react/24/outline";

interface FormState {
  plan: number | "";
  user: number;
  user_name: string;
  credential_password: string;
  plan_name:string;
  transaction_code: string;
  credential: number;
  start_at: string;
  end_at: string;
  active: boolean;
  created_by_transaction: number | "";
}

// --- HELPER FUNCTION FOR DATE CONVERSION ---
const toLocalISO = (isoStr: string) => {
  if (!isoStr) return "";
  const date = new Date(isoStr);
  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
  return adjustedDate.toISOString().substring(0, 16);
};

export default function HotspotSubscriptionPage() {
  const [data, setData] = useState<HotspotSubscription[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Filter & Pagination States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [form, setForm] = useState<FormState>({
    plan: "", user: 0, user_name: "", credential_password: "", plan_name: "", transaction_code: "", credential: 0, start_at: "", end_at: "",
    active: true, created_by_transaction: "",
  });

  async function loadData() {
    setLoading(true);
    try {
      const [res, planRes] = await Promise.all([
        fetchHotspotSubscriptions(),
        listPlans()
      ]);
      setData(res);
      setPlans(planRes);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const processedData = useMemo(() => {
    const filtered = data.filter(sub => {
      const matchesSearch = sub.user.toString().includes(search) || sub.plan.toString().includes(search);
      const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? sub.active : !sub.active);
      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.start_at).getTime();
      const dateB = new Date(b.start_at).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [data, search, statusFilter, sortOrder]);

  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = processedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  function handleChange(e: any) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/hotspot/subscriptions/${editingId}/` : `/hotspot/subscriptions/`;
      
      // Convert local input back to UTC ISO string before sending
      const payload = {
        ...form,
        start_at: new Date(form.start_at).toISOString(),
        end_at: new Date(form.end_at).toISOString()
      };

      await apiFetch(url, { method, body: JSON.stringify(payload) });
      setIsFormOpen(false);
      resetForm();
      loadData();
    } catch (err) { console.error(err); }
  }

  function handleEdit(item: HotspotSubscription) {
    setEditingId(item.id);
    // Convert UTC timestamps to local format for the inputs
    setForm({ 
      ...item, 
      start_at: toLocalISO(item.start_at),
      end_at: toLocalISO(item.end_at) 
    });
    setIsFormOpen(true);
  }

  function resetForm() {
    setEditingId(null);
    setForm({ plan: "", user: 0, user_name: "", credential_password: "", plan_name: "", transaction_code: "", credential: 0, start_at: "", end_at: "", active: true, created_by_transaction: "" });
  }

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (loading && data.length === 0) return (
    <div className="flex h-64 items-center justify-center font-['Figtree'] font-medium text-sm text-blue-500 bg-slate-50 dark:bg-gray-900">
       <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
       Syncing Subscriptions...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-4 lg:p-8 font-['Figtree',sans-serif] transition-colors duration-500">
      
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Hotspot <span className="text-blue-600">Subscriptions</span>
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Manage active hotspot user sessions and plan assignments.</p>
        </div>
        
        <button 
          onClick={() => { resetForm(); setIsFormOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20"
        >
          <PlusIcon className="w-5 h-5" /> New Subscription
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col xl:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by User ID or Plan..."
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-2xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-all shadow-sm"
          >
            <ArrowsUpDownIcon className="w-4 h-4 text-blue-500" />
            {sortOrder === "desc" ? "Latest First" : "Oldest First"}
          </button>

          <div className="relative">
            <SignalIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select 
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 pl-11 pr-10 text-sm font-semibold text-gray-700 dark:text-gray-300 appearance-none outline-none shadow-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden lg:block overflow-hidden rounded-[24px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <th className="p-5">Subscriber Info</th>
              <th className="p-5">Assigned Plan</th>
              <th className="p-5">Timeline (Start → End)</th>
              <th className="p-5">State</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedData.map((item) => {
              const start = formatDateTime(item.start_at);
              const end = formatDateTime(item.end_at);
              return (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 dark:bg-blue-500/10 p-2 rounded-xl text-blue-600">
                         <UserCircleIcon className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">User: {item.user_name}</span>
                        <span className="text-[11px] text-gray-500 font-medium tracking-tight uppercase">Cred: {item.credential_password}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <WifiIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Plan #{item.plan_name}</span>
                    </div>
                  </td>
                  <td className="p-5">
                     <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                           <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                             <CheckCircleIcon className="w-3 h-3" /> START
                           </span>
                           <span className="text-xs font-medium dark:text-gray-300">{start.date}</span>
                           <span className="text-[10px] text-gray-400">{start.time}</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                             <XCircleIcon className="w-3 h-3" /> END
                           </span>
                           <span className="text-xs font-medium dark:text-gray-300">{end.date}</span>
                           <span className="text-[10px] text-gray-400">{end.time}</span>
                        </div>
                     </div>
                  </td>
                  <td className="p-5">
                    <StatusBadge active={item.active} />
                  </td>
                  <td className="p-5 text-right">
                    <button onClick={() => handleEdit(item)} className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline">Manage</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {paginatedData.map((item) => {
          const end = formatDateTime(item.end_at);
          return (
            <div key={item.id} onClick={() => handleEdit(item)} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <StatusBadge active={item.active} />
                <span className="text-xs font-bold text-blue-600">Plan #{item.plan_name}</span>
              </div>
              <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Subscriber ID: {item.user_name}</p>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Credential: {item.credential_password}</span>
              </div>
              
              <div className="flex items-center gap-2 mt-2 text-gray-500">
                <ClockIcon className="w-3.5 h-3.5" />
                <p className="text-xs font-medium">Expires: {end.date} at {end.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* PAGINATION PANEL */}
      <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
          Showing {Math.min(processedData.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(processedData.length, currentPage * itemsPerPage)} of {processedData.length}
        </p>
        
        <div className="flex items-center gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-white disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          
          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-white disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* MODAL FORM */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-[32px] p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {editingId ? "Update Subscription" : "Create Subscription"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Select Plan</label>
                  <select 
                    name="plan" 
                    value={form.plan} 
                    onChange={handleChange} 
                    className="w-full bg-slate-50 dark:bg-gray-900 border-none rounded-2xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20" 
                    required
                  >
                    <option value="">Select Plan</option>
                    {plans.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">User ID</label>
                  <input name="user" value={form.user} readOnly className="w-full bg-slate-100 dark:bg-gray-950 border-none rounded-2xl p-3 text-sm text-gray-500 cursor-not-allowed outline-none" required />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Credential ID</label>
                <input name="credential" value={form.credential} readOnly className="w-full bg-slate-100 dark:bg-gray-950 border-none rounded-2xl p-3 text-sm text-gray-500 cursor-not-allowed outline-none" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Start Date & Time</label>
                <input name="start_at" type="datetime-local" value={form.start_at} onChange={handleChange} className="w-full bg-slate-50 dark:bg-gray-900 border-none rounded-2xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">End Date & Time</label>
                <input name="end_at" type="datetime-local" value={form.end_at} onChange={handleChange} className="w-full bg-slate-50 dark:bg-gray-900 border-none rounded-2xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20" required />
              </div>
              <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-gray-900 rounded-2xl cursor-pointer">
                <input type="checkbox" name="active" checked={form.active} onChange={handleChange} className="w-5 h-5 rounded-lg text-blue-600 border-none bg-gray-200" />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Set as Active</span>
              </label>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-2xl shadow-lg shadow-blue-500/20 transition-transform active:scale-95">{editingId ? "Update" : "Activate"}</button>
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-3 font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700">Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const StatusBadge = ({ active }: { active: boolean }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase border ${
    active 
      ? "bg-emerald-100/60 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20" 
      : "bg-gray-100/60 dark:bg-gray-700/30 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700"
  }`}>
    {active ? <><CheckCircleIcon className="w-3.5 h-3.5" /> Active</> : <><XCircleIcon className="w-3.5 h-3.5" /> Disabled</>}
  </span>
);