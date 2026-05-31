import { useEffect, useState, useMemo } from 'react';
import { 
  UserPlusIcon, 
  TrashIcon, 
  PencilSquareIcon, 
  KeyIcon, 
  GlobeAltIcon,
  XMarkIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SignalIcon,
  ClockIcon,
  FingerPrintIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import type { User, CreateUserPayload } from '../../types/user';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  createPPPoE,
} from '../../api/users';

import { listPlans } from '../../api/plans'; 
import { fetchMikrotiks } from '../../api/devices'; 
import type { Plan } from '../../types/plan';
import type { MikrotikDevice } from '../../types/device';

type ExtendedCreateUserPayload = CreateUserPayload & {
  address?: string;
  mikrotik?: string;
  mikrotik_identity_name?: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]); 
  const [devices, setDevices] = useState<MikrotikDevice[]>([]); 
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const initialForm: ExtendedCreateUserPayload = {
    service_type: 'HOTSPOT',
    plan: 0,
    full_name: '',
    email: '',
    phone: '',
    location: '',
    address: '', 
    mikrotik: '', 
    mikrotik_identity_name: '',
  };

  const [form, setForm] = useState<ExtendedCreateUserPayload>(initialForm);

  async function load() {
    setLoading(true);
    try {
      const [userData, planData, deviceData] = await Promise.all([
        fetchUsers(),
        listPlans(),
        fetchMikrotiks()
      ]);
      setUsers(userData);
      setPlans(planData);
      setDevices(deviceData);
    } catch (err) {
      console.error("Fetch pipeline operation failure:", err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  // Reset pagination index upon modification of any filtration arguments
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, serviceFilter, statusFilter]);

  const handleCopyToClipboard = (text: string, identifier: string) => {
    if (!text) return;
    
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedField(identifier);
        setTimeout(() => setCopiedField(null), 1500);
      });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed"; 
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        setCopiedField(identifier);
      } catch (err) {
        console.error('Fallback runtime system copying failure:', err);
      }
      
      document.body.removeChild(textArea);
      setTimeout(() => setCopiedField(null), 1500);
    }
  };

  async function handleSubmit() {
    try {
      if (editingId) {
        const updatedUser = await updateUser(editingId, form as ExtendedCreateUserPayload);
        setUsers((prev) => prev.map(u => u.id === editingId ? updatedUser : u));
        setEditingId(null);
      } else {
        const user = await createUser(form as ExtendedCreateUserPayload);
        setUsers((prev) => [user, ...prev]);
      }
      setForm(initialForm);
      setIsFormOpen(false);
    } catch {
      alert("Action failed. Check network layer values.");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Permanently remove this client?')) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert("Could not delete client validation assets.");
    }
  }

  async function handlePPPoE(user: User) {
    try {
      setLoading(true);
      await createPPPoE(user.id);
      setUsers((prev) =>
        prev.map((u) => u.id === user.id ? { ...u, pppoe_created: true } : u)
      );
    } catch {
      alert("PPPoE target creation engine failure.");
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
      address: user.address || '',
      mikrotik: '',
      mikrotik_identity_name: user.mikrotik_identity_name || '',
    });
  }

  const textFields: Array<{
    label: string;
    key: 'full_name' | 'email' | 'phone' | 'location' | 'address';
    type: string;
  }> = [
    { label: 'Full Name', key: 'full_name', type: 'text' },
    { label: 'Email Address', key: 'email', type: 'email' },
    { label: 'Phone Connection', key: 'phone', type: 'text' },
    { label: 'General Location', key: 'location', type: 'text' },
    { label: 'Physical Street Address', key: 'address', type: 'text' },
  ];

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const searchLower = searchTerm.toLowerCase().trim();
      const matchesSearch = !searchLower || 
                            String(u.full_name || '').toLowerCase().includes(searchLower) ||
                            String(u.username || '').toLowerCase().includes(searchLower) ||
                            String(u.mac || '').toLowerCase().includes(searchLower) ||
                            String(u.client_ip || '').includes(searchLower);
                            
      const matchesService = serviceFilter === "ALL" || u.service_type === serviceFilter;
      
      const matchesStatus = statusFilter === "ALL" || 
                            (statusFilter === "ACTIVE" && u.active) || 
                            (statusFilter === "INACTIVE" && !u.active);

      return matchesSearch && matchesService && matchesStatus;
    });
  }, [users, searchTerm, serviceFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

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
          <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-widest animate-pulse">Querying Network Access Nodes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 -m-4 md:m-0">
      <div className="p-4 md:p-6 space-y-4">
        
        {/* TOP HEADER CONTAINER */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter">CLIENTS</h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-widest leading-none">Network Edge Management</p>
          </div>
          
          <button 
            onClick={() => { setIsFormOpen(true); setEditingId(null); setForm(initialForm); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black transition-all shadow-lg shadow-blue-500/20 uppercase tracking-widest"
          >
            <PlusIcon className="w-4 h-4 stroke-[3]" />
            <span>Add Client</span>
          </button>
        </div>

        {/* REFACTORED INTERACTIVE MANAGEMENT FILTERS PANEL */}
        <div className="bg-slate-50/60 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input 
              type="text"
              placeholder="Filter database by subscriber identity, MAC, or IP bindings..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full sm:w-auto flex items-center gap-3 shrink-0">
            <div className="flex-1 sm:flex-initial flex items-center gap-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg">
              <FunnelIcon className="w-3.5 h-3.5 text-slate-400" />
              <select title="select"
                className="bg-transparent text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 outline-none cursor-pointer"
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
              >
                <option value="ALL">ALL MODES</option>
                <option value="PPPOE">PPPOE Only</option>
                <option value="HOTSPOT">HOTSPOT Only</option>
              </select>
            </div>

            <div className="flex-1 sm:flex-initial flex items-center gap-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-slate-400" />
              <select title='select'
                className="bg-transparent text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 outline-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">ALL STATUSES</option>
                <option value="ACTIVE">ACTIVE ONLY</option>
                <option value="INACTIVE">INACTIVE ONLY</option>
              </select>
            </div>
          </div>
        </div>

        {/* REFACTORED FIXED OVERLAY VIEW MODAL FORM */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col">
              
              <div className="p-4 bg-blue-50/50 dark:bg-blue-500/5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800 z-10">
                <h3 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.15em] flex items-center gap-2">
                  {editingId ? <PencilSquareIcon className="w-4.5 h-4.5" /> : <UserPlusIcon className="w-4.5 h-4.5" />}
                  {editingId ? `Modify Client Profile Parameters: ${form.full_name}` : 'Provision Operational Client Profile'}
                </h3>
                <button title='button'
                  onClick={() => { setIsFormOpen(false); setEditingId(null); }}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-md transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              <div className="p-5 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto flex-1">
                {textFields.map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <label htmlFor={field.key} className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{field.label}</label>
                    <input 
                      id={field.key}
                      type={field.type}
                      value={(form as any)[field.key]} 
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      title={field.label}
                      className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-slate-700/60 p-2.5 rounded-lg text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-blue-500 transition-all" 
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} 
                    />
                  </div>
                ))}

                <div className="space-y-1.5">
                  <label htmlFor="mikrotik" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Target Network NAS (MikroTik)</label>
                  <select 
                    id="mikrotik"
                    title="Target Network NAS (MikroTik)"
                    className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-slate-700/60 p-2.5 rounded-lg text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-blue-500 cursor-pointer"
                    value={form.mikrotik}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const matchedDevice = devices.find(d => String(d.id) === selectedId);
                      setForm({ 
                        ...form, 
                        mikrotik: selectedId,
                        mikrotik_identity_name: matchedDevice ? matchedDevice.identity_name : ''
                      });
                    }}
                  >
                    <option value="">Select Target Access Device...</option>
                    {devices.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.identity_name} ({d.api_ip || 'No Managed IP'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Service Plan</label>
                  <select 
                    className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-slate-700/60 p-2.5 rounded-lg text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-blue-500"
                    value={form.plan}
                    onChange={(e) => setForm({ ...form, plan: Number(e.target.value) })}
                  >
                    <option value={0}>Select Package...</option>
                    {plans.map(p => <option key={p.id} value={p.id}>{p.name} || KES {p.price}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Service Mode</label>
                  <select 
                    className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-slate-700/60 p-2.5 rounded-lg text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-blue-500" 
                    value={form.service_type} 
                    onChange={(e) => setForm({ ...form, service_type: e.target.value as any })}
                  >
                    <option value="HOTSPOT">HOTSPOT</option>
                    <option value="PPPOE">PPPOE</option>
                  </select>
                </div>

                <div className="lg:col-span-3 pt-4 flex gap-2 border-t border-slate-100 dark:border-slate-700/60 bg-white dark:bg-slate-800 sticky bottom-0">
                  <button onClick={handleSubmit} className="flex-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md">
                    {editingId ? 'Confirm Update Data' : 'Initialize Client System'}
                  </button>
                  <button onClick={() => { setIsFormOpen(false); setEditingId(null); }} className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded-lg uppercase tracking-widest hover:bg-slate-200 transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ISOLATED COMPONENT MAIN DATA TABLE DISPLAY PANEL */}
        <div className="bg-white dark:bg-slate-800/50 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-gray-900/50 border-b border-slate-100 dark:border-slate-700">
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">contacts</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subscriber</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Bindings</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden lg:table-cell">NAS / Identity</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-500/5 transition-colors group">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-gray-900 flex items-center justify-center font-black text-blue-600 dark:text-blue-400 text-xs shadow-inner shrink-0">
                          {user.full_name?.charAt(0).toUpperCase()}
                        </div>
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
                                <span>{user.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-slate-800 dark:text-slate-100 text-[11px] md:text-sm truncate leading-tight">
                              {user.username}
                            </p>
                            {user.username && (
                              <button 
                                onClick={() => handleCopyToClipboard(user.username!, `usr-${user.id}`)}
                                className="p-1 text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-gray-900 rounded transition-all outline-none"
                                title="Copy Username Target String"
                              >
                                {copiedField === `usr-${user.id}` ? (
                                  <CheckIcon className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                                ) : (
                                  <DocumentDuplicateIcon className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <p className="text-[9px] text-blue-500 font-black tracking-tighter">
                              {user.code_6char || '------'}
                            </p>
                            {user.code_6char && (
                              <button 
                                onClick={() => handleCopyToClipboard(user.code_6char!, `cod-${user.id}`)}
                                className="p-0.5 text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-gray-900 rounded transition-all outline-none"
                                title="Copy Core Service Voucher Code"
                              >
                                {copiedField === `cod-${user.id}` ? (
                                  <CheckIcon className="w-3 h-3 text-emerald-500 stroke-[3]" />
                                ) : (
                                  <DocumentDuplicateIcon className="w-3 h-3" />
                                )}
                              </button>
                            )}
                          </div>

                          <p className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px] font-medium">
                            Plan: {user.plan_name}
                          </p>
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
                          <button onClick={() => handlePPPoE(user)} className="p-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-all" title="Provision PPPoE Profile">
                            <KeyIcon className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => startEdit(user)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all" title="Edit Profile">
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="p-2 text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all" title="Delete Client Profile Asset">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* SLIDING-WINDOW TRUNCATED PAGINATION SELECTION MODULE */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-gray-900/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center sm:text-left">
              Showing {filteredUsers.length === 0 ? 0 : Math.min(filteredUsers.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filteredUsers.length, currentPage * itemsPerPage)} of {filteredUsers.length} entries
            </p>
            
            <div className="flex items-center gap-1.5 max-w-full justify-center">
              <button title='button'
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-20 hover:bg-white dark:hover:bg-slate-800 transition-all shrink-0"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>

              <div className="flex flex-wrap items-center gap-1 justify-center max-w-full">
                {(() => {
                  const pages = [];
                  const range = 1; 

                  for (let i = 1; i <= totalPages; i++) {
                    if (i === 1 || i === totalPages || (i >= currentPage - range && i <= currentPage + range)) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={`w-7 h-7 rounded-lg text-[10px] font-black transition-all shrink-0 ${
                            currentPage === i 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                            : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
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
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-20 hover:bg-white dark:hover:bg-slate-800 transition-all shrink-0"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}