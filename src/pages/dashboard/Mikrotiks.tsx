// src/pages/dashboard/mikrotiks.tsx
import { useEffect, useState } from "react";
import {
  fetchMikrotiks,
  createMikrotik,
  deleteMikrotik,
  
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
  ArrowPathIcon
} from "@heroicons/react/24/outline";

export default function Mikrotiks() {
  const [devices, setDevices] = useState<MikrotikDevice[]>( []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    identity_name: "",
    api_ip: "",
    serial_number: ""
  });

  /* Load devices */
  const loadDevices = async () => {
    setLoading(true);
    try {
      const data = await fetchMikrotiks();
      setDevices(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  /* Create device */
  const handleCreate = async () => {
    try {
      await createMikrotik(form);
      setForm({ identity_name: "", api_ip: "", serial_number: "" });
      loadDevices();
    } catch (err: any) {
      setError(err.message);
    }
  };

  /* Delete device */
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this MikroTik device?")) return;
    await deleteMikrotik(id);
    loadDevices();
  };


return (
  <div className="max-w-6xl mx-auto pb-10 space-y-8 animate-fadeIn">
    {/* Header Section */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <CpuChipIcon className="w-8 h-8 text-blue-600" />
          MikroTik Infrastructure
        </h1>
        <p className="text-gray-500 mt-1">Connect and manage your network routers and access points.</p>
      </div>
      <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-bold text-blue-700">{devices.length} Devices Online</span>
      </div>
    </div>

    {error && (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm flex items-center gap-3">
        <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
        <p className="text-red-700 text-sm font-medium">{error}</p>
      </div>
    )}

    {/* Create Device Form Card */}
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <PlusIcon className="w-5 h-5 text-blue-600" />
          Add New Router
        </h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">Identity Name</label>
            <div className="relative">
              <ServerIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                className="w-full border-gray-200 focus:ring-2 focus:ring-blue-500 p-3 pl-10 rounded-xl border outline-none transition-all"
                placeholder="e.g. Core-Router-01"
                value={form.identity_name}
                onChange={(e) => setForm({ ...form, identity_name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">Host / API IP</label>
            <div className="relative">
              <GlobeAltIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                className="w-full border-gray-200 focus:ring-2 focus:ring-blue-500 p-3 pl-10 rounded-xl border outline-none transition-all"
                placeholder="192.168.88.1"
                value={form.api_ip}
                onChange={(e) => setForm({ ...form, api_ip: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">Serial Number</label>
            <div className="relative">
              <HashtagIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                className="w-full border-gray-200 focus:ring-2 focus:ring-blue-500 p-3 pl-10 rounded-xl border outline-none transition-all"
                placeholder="HC20-XXXX-XXXX"
                value={form.serial_number}
                onChange={(e) => setForm({ ...form, serial_number: e.target.value })}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <ArrowPathIcon className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <PlusIcon className="w-5 h-5" />
              Register MikroTik Device
            </>
          )}
        </button>
      </div>
    </section>

    {/* Devices List Table */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-widest font-bold">
              <th className="px-6 py-4">Device Identity</th>
              <th className="px-6 py-4">Network Address</th>
              <th className="px-6 py-4 text-center">Serial Reference</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {devices.map((d) => (
              <tr key={d.id} className="hover:bg-blue-50/20 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white transition-colors">
                      <CpuChipIcon className="w-5 h-5 text-gray-500" />
                    </div>
                    <span className="font-bold text-gray-800">{d.identity_name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {d.api_ip}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-sm text-gray-500 font-mono">
                  {d.serial_number || "N/A"}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Edit Device"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      onClick={() => handleDelete(d.id!)}
                      title="Remove Device"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!devices.length && !loading && (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <ServerIcon className="w-12 h-12 text-gray-200" />
                    <p className="text-gray-400 font-medium">No MikroTik hardware found in your network.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);}
