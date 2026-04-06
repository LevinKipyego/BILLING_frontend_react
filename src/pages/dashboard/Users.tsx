import { useEffect, useState, useRef } from 'react'; // Added useRef
import { 
  UserPlusIcon, 
  TrashIcon, 
  PencilSquareIcon, 
  KeyIcon, 
  MagnifyingGlassIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import type { User, CreateUserPayload } from '../../types/user';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  createPPPoE,
} from '../../api/users';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Reference to the form container for smooth scrolling
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
      setUsers(await fetchUsers());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit() {
    try {
      if (editingId) {
        const updatedUser = await updateUser(editingId, form);
        setUsers((prev) => prev.map(u => u.id === editingId ? updatedUser : u));
        setEditingId(null);
        alert("Client updated successfully");
      } else {
        const user = await createUser(form);
        setUsers((prev) => [user, ...prev]);
      }
      setForm(initialForm);
    } catch (err) { 
      alert(editingId ? "Failed to update user" : "Failed to create user"); 
    }
  }

  function startEdit(user: User) {
    setEditingId(user.id);
    setForm({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      plan: user.plan,
      service_type: user.service_type,
    });

    // Smooth scroll to the form
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleCancel() {
    setEditingId(null);
    setForm(initialForm);
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this client?')) return;
    try {
        await deleteUser(id);
        setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
        alert("Could not delete from database/MikroTik.");
    }
  }

  async function handlePPPoE(user: User) {
    await createPPPoE(user.id);
    setUsers((prev) =>
      prev.map((u) => u.id === user.id ? { ...u, pppoe_created: true } : u)
    );
  }

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone?.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Client Directory</h1>
          <p className="text-sm text-gray-500">Manage your ISP subscribers and service credentials.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search clients..." 
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none w-full md:w-64"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>
      </div>

      {/* Quick Create/Edit Card - Added ref and scroll margin */}
      <div 
        ref={formRef}
        className={`bg-white rounded-2xl shadow-sm border transition-all scroll-mt-10 ${
            editingId ? 'border-blue-500 ring-4 ring-blue-50 scale-[1.01]' : 'border-gray-100'
        }`}
      >
        <div className={`p-4 border-b flex justify-between items-center ${editingId ? 'bg-blue-50/50 border-blue-100' : 'bg-gray-50/50 border-gray-50'}`}>
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
            {editingId ? <PencilSquareIcon className="w-5 h-5 text-blue-600" /> : <UserPlusIcon className="w-5 h-5 text-blue-600" />}
            {editingId ? `Editing Client: ${form.full_name}` : 'Quick Onboard Client'}
          </h3>
          {editingId && (
            <button onClick={handleCancel} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <XMarkIcon className="w-4 h-4" /> Cancel Edit
            </button>
          )}
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-widest">Full Name</label>
            <input value={form.full_name} placeholder="Jane Doe" className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:border-blue-500" onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-widest">Email Address</label>
            <input value={form.email} placeholder="jane@example.com" className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:border-blue-500" onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-widest">Phone Number</label>
            <input value={form.phone} placeholder="254..." className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:border-blue-500" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-widest">Location</label>
            <input value={form.location} placeholder="Nairobi, KE" className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:border-blue-500" onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-widest">Service Plan ID</label>
            <input value={form.plan} type="number" placeholder="101" className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:border-blue-500" onChange={(e) => setForm({ ...form, plan: Number(e.target.value) })} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-widest">Service Type</label>
            <select disabled={!!editingId} className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:border-blue-500 appearance-none bg-white disabled:bg-gray-100 disabled:text-gray-400" value={form.service_type} onChange={(e) => setForm({ ...form, service_type: e.target.value as any })}>
              <option value="HOTSPOT">Hotspot Service</option>
              <option value="PPPOE">PPPoE Subscription</option>
            </select>
          </div>
          <div className="lg:col-span-3 pt-2 flex gap-2">
            <button onClick={handleSubmit} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95 flex items-center justify-center gap-2">
              {editingId ? <CheckIcon className="w-5 h-5" /> : <UserPlusIcon className="w-5 h-5" />}
              {editingId ? 'Save Changes' : 'Register Client'}
            </button>
            {editingId && (
                <button onClick={handleCancel} className="px-8 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all">
                    Cancel
                </button>
            )}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Client Details</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest hidden md:table-cell">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Contacts</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest ">Service</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user) => {
                const isPPPOE = user.service_type === 'PPPOE';
                const needsCredentials = isPPPOE && !user.pppoe_created;
                const isCurrentlyEditing = editingId === user.id;

                return (
                  <tr key={user.id} className={`transition-colors group ${isCurrentlyEditing ? 'bg-blue-50' : 'hover:bg-blue-50/30'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isPPPOE ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'}`}>
                          {user.full_name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{user.full_name || 'Anonymous User'}</p>
                          <p className="text-xs text-gray-400 font-medium">ID: #{user.id.toString().padStart(4, '0')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <GlobeAltIcon className="w-3 h-3" /> {user.location || 'N/A'}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <EnvelopeIcon className="w-3 h-3" /> {user.email || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                          <PhoneIcon className="w-3 h-3" /> {user.phone || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${isPPPOE ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                        {user.service_type}
                      </span>
                      {user.pppoe_created && (
                        <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                          <KeyIcon className="w-3 h-3" /> Creds Active
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {needsCredentials && (
                          <button 
                            onClick={() => handlePPPoE(user)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Create PPPoE"
                          >
                            <KeyIcon className="w-5 h-5" />
                          </button>
                        )}
                        <button 
                            onClick={() => startEdit(user)} 
                            className={`p-2 rounded-lg transition-colors ${isCurrentlyEditing ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50'}`}
                            title="Edit Client"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors" title="Delete Client">
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {loading && (
        <div className="fixed bottom-10 right-10 bg-white shadow-2xl rounded-full px-6 py-3 flex items-center gap-3 border border-blue-100 animate-bounce">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
          <span className="text-sm font-bold text-gray-700">Syncing with MikroTik...</span>
        </div>
      )}
    </div>
  );
}