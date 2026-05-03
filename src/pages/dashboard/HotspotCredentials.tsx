import { useEffect, useState, useMemo } from "react";
import {
  
  listHotspotCredentials,
  createPPPoECredential,
  updatePPPoECredential,
  deletePPPoECredential,
} from "../../api/pppoecredentials";
import type {
  PPPoECredential,
  PPPoECredentialCreate,
} from "../../types/pppoecredentials";
import { 
  MagnifyingGlassIcon, 
  PlusIcon,
  KeyIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  //ShieldCheckIcon,
  NoSymbolIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowsUpDownIcon,
  UserCircleIcon,
  ClockIcon,
  PencilSquareIcon,
  PowerIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export default function HotspotCredentialPage() {
  const [data, setData] = useState<PPPoECredential[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [form, setForm] = useState<PPPoECredentialCreate>({
    user: 0,
    username: "",
    password: "",
    active: false,
    suspended: false,
    trial_expires_at: null,
  });

  async function loadData() {
    setLoading(true);
    try {
      const res = await listHotspotCredentials();
      setData(res);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const processedData = useMemo(() => {
    const filtered = data.filter(cred => {
      const matchesSearch = cred.username.toLowerCase().includes(search.toLowerCase()) || 
                           cred.user.toString().includes(search);
      const matchesStatus = statusFilter === "all" || 
                           (statusFilter === "active" ? cred.active : !cred.active);
      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      return sortOrder === "desc" ? b.id - a.id : a.id - b.id;
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
      if (editingId) {
        await updatePPPoECredential(editingId, form);
      } else {
        await createPPPoECredential(form);
      }
      setIsFormOpen(false);
      resetForm();
      loadData();
    } catch (err) { console.error(err); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to permanently revoke this credential?")) return;
    try {
      await deletePPPoECredential(id);
      loadData();
    } catch (err) { console.error(err); }
  }

  function handleEdit(item: PPPoECredential) {
    setEditingId(item.id);
    setForm({
      user: item.user,
      username: item.username,
      password: "", 
      active: item.active,
      suspended: item.suspended,
      trial_expires_at: item.trial_expires_at,
    });
    setIsFormOpen(true);
  }

  async function toggleActive(item: PPPoECredential) {
    await updatePPPoECredential(item.id, { active: !item.active });
    loadData();
  }

  function resetForm() {
    setEditingId(null);
    setForm({ user: 0, username: "", password: "", active: false, suspended: false, trial_expires_at: null });
  }

  const formatTrial = (dateStr: string | null) => {
    if (!dateStr) return { date: "No Expiry", time: "Permanent" };
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (loading && data.length === 0) return (
    <div className="flex h-64 items-center justify-center font-['Figtree'] font-medium text-sm text-blue-500 bg-slate-50 dark:bg-gray-900">
       <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
       Accessing Registry...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-4 lg:p-8 font-['Figtree',sans-serif] transition-colors duration-500">
      
      {/* HEADER */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
            
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
              Hotspot <span className="text-blue-600">Credentials</span>
            </h2>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 font-bold uppercase tracking-wider">Access Control</p>
          </div>
        </div>
        
        <button 
          onClick={() => { resetForm(); setIsFormOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20"
        >
          <PlusIcon className="w-5 h-5" /> New Credential
        </button>
      </div>

    {/* FILTERS SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 mb-10">
        <div className="xl:col-span-2 relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..."
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        {/* Increased gap here for the two smaller buttons on mobile */}
        <div className="grid grid-cols-2 xl:contents gap-4">
          <button 
            onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
            className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-[10px] font-bold text-gray-700 dark:text-gray-300 hover:border-blue-500/50 transition-colors"
          >
            <ArrowsUpDownIcon className="w-3.5 h-3.5 text-blue-500" />
            {sortOrder === "desc" ? "Latest" : "Oldest"}
          </button>
          
          <select 
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-[10px] font-bold text-gray-700 dark:text-gray-300 outline-none cursor-pointer hover:border-blue-500/50 transition-colors"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Disabled</option>
          </select>
        </div>
      </div>

      {/* MOBILE LIST - Increased gap between cards (space-y-5) */}
      <div className="lg:hidden space-y-5">
        {paginatedData.map((item) => {
          const trial = formatTrial(item.trial_expires_at);
          return (
            <div key={item.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[24px] p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600">
                    <UserCircleIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">{item.username}</h4>
                    <p className="text-[9px] font-bold text-gray-400">ID: #{item.user}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                   {item.active ? 
                     <StatusBadge icon={<CheckCircleIcon className="w-3 h-3"/>} label="Active" type="success" /> : 
                     <StatusBadge icon={<XCircleIcon className="w-3 h-3"/>} label="Off" type="neutral" />
                   }
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-gray-900/50 rounded-xl p-2.5 mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{trial.date}</span>
                </div>
                {item.suspended && <StatusBadge label="Suspended" type="danger" icon={<NoSymbolIcon className="w-3 h-3"/>} />}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => toggleActive(item)} className="flex items-center justify-center p-2 bg-slate-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300">
                  <PowerIcon className="w-4 h-4" />
                </button>
                <button onClick={() => handleEdit(item)} className="flex items-center justify-center p-2 bg-slate-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300">
                  <PencilSquareIcon className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="flex items-center justify-center p-2 bg-rose-50 dark:bg-rose-500/10 rounded-lg text-rose-600">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden lg:block overflow-hidden rounded-[32px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 backdrop-blur-md shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] font-black uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700">
              <th className="p-6">Credential Details</th>
              <th className="p-6">Account Status</th>
              <th className="p-6">Trial Window</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedData.map((item) => {
              const trial = formatTrial(item.trial_expires_at);
              return (
                <tr key={item.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-500/5 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <UserCircleIcon className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${item.active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{item.username}</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400">ID: #{item.user}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex gap-2">
                      {item.active ? 
                        <StatusBadge icon={<CheckCircleIcon className="w-3.5 h-3.5"/>} label="Verified" type="success" /> : 
                        <StatusBadge icon={<XCircleIcon className="w-3.5 h-3.5"/>} label="Inactive" type="neutral" />
                      }
                      {item.suspended && 
                        <StatusBadge icon={<NoSymbolIcon className="w-3.5 h-3.5"/>} label="Suspended" type="danger" />
                      }
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <ClockIcon className="w-4 h-4 text-gray-400" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-700 dark:text-gray-300">{trial.date}</span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase">{trial.time}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => toggleActive(item)} className="p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:text-emerald-500 transition-all text-gray-500 shadow-sm">
                        <PowerIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleEdit(item)} className="p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:text-blue-500 transition-all text-gray-500 shadow-sm">
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:text-rose-500 transition-all text-gray-500 shadow-sm">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINATION SECTION */}
      <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 px-2">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
           PAGE {currentPage} OF {totalPages || 1}
        </p>
        
        <div className="flex items-center gap-2">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 disabled:opacity-20 transition-all">
            <ChevronLeftIcon className="w-4 h-4 stroke-[2.5]" />
          </button>
          <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 disabled:opacity-20 transition-all">
            <ChevronRightIcon className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-[32px] p-6 md:p-8 shadow-2xl border border-gray-200 dark:border-gray-700 relative max-h-[90vh] overflow-y-auto">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600">
                  <KeyIcon className="w-3 h-3" />
               </div>
               <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                 {editingId ? "Edit Access" : "New Access"}
               </h3>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1 space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Sub ID</label>
                <input name="user" type="number" value={form.user} onChange={handleChange} className="w-full bg-slate-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 rounded-xl p-3 text-xs font-bold dark:text-white outline-none" required />
              </div>
              <div className="col-span-2 md:col-span-1 space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
                <input name="username" value={form.username} onChange={handleChange} className="w-full bg-slate-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 rounded-xl p-3 text-xs font-bold dark:text-white outline-none" required />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full bg-slate-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 rounded-xl p-3 text-xs font-bold dark:text-white outline-none" required={!editingId} />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Trial Expiry</label>
                <input name="trial_expires_at" type="datetime-local" value={form.trial_expires_at || ""} onChange={handleChange} className="w-full bg-slate-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 rounded-xl p-3 text-xs font-bold dark:text-white outline-none" />
              </div>
              <div className="col-span-2 flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white font-black py-3 rounded-2xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.98] uppercase text-[10px] tracking-widest">{editingId ? "Save" : "Create"}</button>
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-3 font-black text-gray-400 uppercase tracking-widest text-[10px]">Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const StatusBadge = ({ label, type, icon }: { label: string; type: 'success' | 'danger' | 'neutral'; icon: React.ReactNode }) => {
  const styles = {
    success: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    danger: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    neutral: "bg-gray-500/10 text-gray-500 border-gray-500/20"
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[8px] font-black uppercase border tracking-tight ${styles[type]}`}>
      {icon}
      {label}
    </span>
  );
};