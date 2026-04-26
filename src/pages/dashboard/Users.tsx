import { useEffect, useState, useRef, useMemo } from 'react';
import { 
  UserPlusIcon, 
  TrashIcon, 
  PencilSquareIcon, 
  KeyIcon, 
  MagnifyingGlassIcon,
  //EnvelopeIcon,
  //PhoneIcon,
  GlobeAltIcon,
  XMarkIcon,
  PlusIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SignalIcon,
 // IdentificationIcon,
  ClockIcon,
  FingerPrintIcon
} from '@heroicons/react/24/outline';
import type { User, CreateUserPayload } from '../../types/user';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  createPPPoE,
} from '../../api/users';

import { listPlans } from '../../api/plans'; // Import the actual API function
import type { Plan } from '../../types/plan';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]); 
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const formRef = useRef<HTMLDivElement>(null);

  const initialForm: CreateUserPayload = {
    service_type: 'HOTSPOT',
    plan: 0,
    full_name: '',
    email: '',
    phone: '',
    location: '',
  };

  const [form, setForm] = useState<CreateUserPayload>(initialForm);

  async function load() {
    setLoading(true);
    try {
      const [userData, planData] = await Promise.all([
        fetchUsers(),
        listPlans() // Fetching actual plans from backend
      ]);
      setUsers(userData);
      setPlans(planData);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  async function handleSubmit() {
    try {
      if (editingId) {
        const updatedUser = await updateUser(editingId, form);
        setUsers((prev) => prev.map(u => u.id === editingId ? updatedUser : u));
        setEditingId(null);
      } else {
        const user = await createUser(form);
        setUsers((prev) => [user, ...prev]);
      }
      setForm(initialForm);
      setIsFormOpen(false);
    } catch (err) { 
      alert("Action failed. Check network."); 
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Permanently remove this client?')) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert("Could not delete client.");
    }
  }

  async function handlePPPoE(user: User) {
    try {
      setLoading(true);
      await createPPPoE(user.id);
      setUsers((prev) =>
        prev.map((u) => u.id === user.id ? { ...u, pppoe_created: true } : u)
      );
    } catch (err) {
      alert("PPPoE creation failed.");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(user: User) {
    setEditingId(user.id);
    setIsFormOpen(true);
    setForm({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      plan: user.plan,
      service_type: user.service_type,
    });
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            u.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            u.mac?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            u.client_ip?.includes(searchTerm);
      const matchesCat = categoryFilter === "ALL" || u.service_type === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [users, searchTerm, categoryFilter]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 -m-4 md:m-0">
      <div className="p-4 md:p-6 space-y-4">
        
        {/* TOP HEADER */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter">CLIENTS</h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-widest leading-none">Network Edge Management</p>
          </div>
          
          <button 
            onClick={() => { setIsFormOpen(!isFormOpen); setEditingId(null); setForm(initialForm); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black transition-all shadow-lg shadow-blue-500/20 uppercase tracking-widest"
          >
            {isFormOpen ? <XMarkIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
            <span>{isFormOpen ? 'Close' : 'Add Client'}</span>
          </button>
        </div>

        {/* SLIDE-DOWN FORM */}
        {isFormOpen && (
          <div ref={formRef} className="animate-in fade-in slide-in-from-top-4 duration-300 bg-white dark:bg-slate-800 rounded-lg border-2 border-blue-500/30 shadow-xl overflow-hidden mb-6">
            <div className="p-4 bg-blue-50/50 dark:bg-blue-500/5 border-b border-blue-100 dark:border-blue-500/10">
              <h3 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2">
                {editingId ? <PencilSquareIcon className="w-4 h-4" /> : <UserPlusIcon className="w-4 h-4" />}
                {editingId ? `Update: ${form.full_name}` : 'New Registration'}
              </h3>
            </div>
            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'Full Name', key: 'full_name', type: 'text' },
                { label: 'Email', key: 'email', type: 'email' },
                { label: 'Phone', key: 'phone', type: 'text' },
                { label: 'Location', key: 'location', type: 'text' },
              ].map((field) => (
                <div key={field.key} className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{field.label}</label>
                  <input 
                    value={(form as any)[field.key]} 
                    className="w-full bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 p-2.5 rounded-lg text-xs dark:text-white outline-none focus:border-blue-500 transition-all" 
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} 
                  />
                </div>
              ))}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service Plan</label>
                <select 
                  className="w-full bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 p-2.5 rounded-lg text-xs dark:text-white outline-none focus:border-blue-500"
                  value={form.plan}
                  onChange={(e) => setForm({ ...form, plan: Number(e.target.value) })}
                >
                  <option value={0}>Select Package...</option>
                  {plans.map(p => <option key={p.id} value={p.id}>{p.name} || KES {p.price}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service Mode</label>
                <select 
                  className="w-full bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 p-2.5 rounded-lg text-xs dark:text-white outline-none focus:border-blue-500" 
                  value={form.service_type} 
                  onChange={(e) => setForm({ ...form, service_type: e.target.value as any })}
                >
                  <option value="HOTSPOT">HOTSPOT</option>
                  <option value="PPPOE">PPPOE</option>
                </select>
              </div>
              <div className="lg:col-span-3 pt-4 flex gap-2">
                <button onClick={handleSubmit} className="flex-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-lg hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/20">
                  {editingId ? 'Confirm Update' : 'Initialize Client'}
                </button>
                <button onClick={() => { setIsFormOpen(false); setEditingId(null); }} className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded-lg uppercase tracking-widest">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TABLE WRAPPER */}
        <div className="bg-white dark:bg-slate-800/50 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          
          <div className="p-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-gray-900/50 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search by Name, MAC, or IP..."
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-medium dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 px-2 py-1.5 rounded-lg">
              <FunnelIcon className="w-3.5 h-3.5 text-slate-400" />
              <select 
                className="bg-transparent text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 outline-none cursor-pointer"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="ALL">ALL TYPES</option>
                <option value="PPPOE">PPPOE</option>
                <option value="HOTSPOT">HOTSPOT</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-gray-900/50 border-b border-slate-100 dark:border-slate-700">
                  
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">contacts</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subscriber / Session</th>
                  
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Bindings</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status / Expiry</th>
                  
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden lg:table-cell">NAS / Identity</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-500/5 transition-colors group">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {/* Subscriber Avatar */}
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-gray-900 flex items-center justify-center font-black text-blue-600 dark:text-blue-400 text-xs shadow-inner shrink-0">
                          {user.full_name?.charAt(0).toUpperCase()}
                        </div>

                        {/* Contact Details Stack */}
                        <div className="flex flex-col min-w-0">
                          <p className="font-bold text-slate-800 dark:text-slate-100 text-[11px] md:text-sm truncate leading-tight">
                            {user.full_name}
                          </p>
                          
                          <div className="mt-1 space-y-0.5">
                            {user.email && (
                              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px]">
                              
                                <span className="truncate">{user.email}</span>
                              </div>
                            )}

                            {user.phone && (
                              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px] font-medium">
                               
                                <span >{user.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                  
                    
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 dark:text-slate-100 text-[11px] md:text-sm truncate leading-tight">{user.username}</p>
                          <p className="text-[9px] text-blue-500 font-black tracking-tighter">Code: {user.code_6char || '------'}</p>
                          <p className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px] font-medium">Plan: {user.plan_name}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1 text-[10px]">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-bold">
                           <FingerPrintIcon className="w-3 h-3 opacity-50" />
                           <span className="font-mono">{user.mac || 'no-mac-bound'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                           <GlobeAltIcon className="w-3 h-3 opacity-50" />
                           <span>{user.client_ip || '---.---.---.---'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                           <span className={`px-2 py-0.5 rounded-md text-[8px] font-black tracking-tighter shadow-sm ${
                             user.active ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20' : 'bg-rose-100 text-rose-600 dark:bg-rose-500/20'
                           }`}>
                             {user.active ? 'ACTIVE' : 'INACTIVE'}
                           </span>
                           <span className="text-[9px] font-bold text-slate-400 uppercase">{user.session_status || 'Offline'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[9px] text-slate-500 font-medium italic">
                          <ClockIcon className="w-3 h-3" />
                          Exp: {user.expires_at ? new Date(user.expires_at).toLocaleDateString() : 'Null'}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 space-y-1">
                        <p className="flex items-center gap-1.5 font-bold tracking-tight">
                           <SignalIcon className="w-3.5 h-3.5 text-blue-500" />
                           {user.mikrotik_identity_name || 'Generic-NAS'}
                        </p>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black border ${
                            user.service_type === 'PPPOE' 
                              ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30" 
                              : user.service_type === 'HOTSPOT'
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                          }`}>
                            TYPE: {user.service_type}
                          </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {user.service_type === 'PPPOE' && !user.pppoe_created && (
                          <button onClick={() => handlePPPoE(user)} className="p-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-all" title="Provision PPPoE">
                            <KeyIcon className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => startEdit(user)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all" title="Edit Profile">
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="p-2 text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all" title="Delete Client">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION CONTROLS */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-gray-900/30 flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Showing {paginatedUsers.length} of {filteredUsers.length} entries
            </p>
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 disabled:opacity-30 hover:bg-white dark:hover:bg-slate-800 transition-all"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-7 h-7 rounded-lg text-[10px] font-black transition-all ${
                      currentPage === i + 1 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                      : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 disabled:opacity-30 hover:bg-white dark:hover:bg-slate-800 transition-all"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER SYNC STATUS */}
      {loading && (
        <div className="fixed bottom-6 right-6 bg-slate-900 dark:bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-3 shadow-2xl z-50 border border-white/10">
          <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Radius Syncing...</span>
        </div>
      )}
    </div>
  );
}