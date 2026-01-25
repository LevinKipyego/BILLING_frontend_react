import { useEffect, useState } from "react";
import type { Plan } from "../../types/plan";
import type { MikrotikDevice } from "../../types/device";
import { listPlans, createPlan, deletePlan } from "../../api/plans";
import { listMikrotiks } from "../../types/device";
import { PlusIcon, TrashIcon, SignalIcon, ClockIcon, BanknotesIcon } from "@heroicons/react/24/outline";

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [mikrotiks, setMikrotiks] = useState<MikrotikDevice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    duration_minutes: "",
    rate_limit: "",
    mikrotik: "", // UUID from backend
  });

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [plansData, mikrotiksData] = await Promise.all([
        listPlans(),
        listMikrotiks(),
      ]);

      setPlans(plansData);
      setMikrotiks(mikrotiksData);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await createPlan({
        name: form.name,
        price: Number(form.price),
        duration_minutes: Number(form.duration_minutes),
        rate_limit: form.rate_limit,
        mikrotik: form.mikrotik, // backend UUID
      });

      setForm({
        name: "",
        price: "",
        duration_minutes: "",
        rate_limit: "",
        mikrotik: "",
      });

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
  <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-fadeIn">
    {/* Header Section */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Service Plans</h1>
        <p className="text-gray-500 mt-1">Manage and deploy bandwidth packages to your MikroTik routers.</p>
      </div>
      <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold border border-blue-100 self-start">
        {plans.length} Active Plans
      </div>
    </div>

    {error && (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-shake">
        <p className="text-red-700 text-sm font-medium">{error}</p>
      </div>
    )}

    {/* Create Plan Card */}
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 bg-gray-50/50">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <PlusIcon className="w-5 h-5 text-blue-600" />
          Create New Plan
        </h2>
      </div>
      
      <form onSubmit={handleCreate} className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Plan Name</label>
            <input
              className="w-full border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 rounded-xl border transition-all"
              placeholder="e.g. Premium Gold"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Price (KES)</label>
            <input
              className="w-full border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 rounded-xl border transition-all"
              placeholder="0.00"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Duration (Min)</label>
            <input
              className="w-full border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 rounded-xl border transition-all"
              placeholder="60"
              type="number"
              value={form.duration_minutes}
              onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Speed Limit</label>
            <input
              className="w-full border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 rounded-xl border transition-all"
              placeholder="5M/5M"
              value={form.rate_limit}
              onChange={(e) => setForm({ ...form, rate_limit: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Target Router</label>
            <select
              className="w-full border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 rounded-xl border transition-all bg-white"
              value={form.mikrotik}
              onChange={(e) => setForm({ ...form, mikrotik: e.target.value })}
              required
            >
              <option value="">Choose MikroTik...</option>
              {mikrotiks.map((mt) => (
                <option key={mt.id} value={mt.id}>
                  {mt.identity_name}
                </option>
              ))}
            </select>
          </div>

          <button
            disabled={!form.mikrotik}
            className="lg:col-span-5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <PlusIcon className="w-5 h-5" />
            Deploy Plan to Router
          </button>
        </div>
      </form>
    </section>

    {/* Plans Table/Cards */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-400 text-xs uppercase tracking-widest">
              <th className="px-6 py-4 font-bold">Plan Details</th>
              <th className="px-6 py-4 font-bold hidden md:table-cell text-center">Price</th>
              <th className="px-6 py-4 font-bold hidden md:table-cell text-center">Duration</th>
              <th className="px-6 py-4 font-bold hidden md:table-cell text-center">Rate Limit</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {plans.map((p) => (
              <tr key={p.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800">{p.name}</span>
                    <span className="text-xs text-gray-400 md:hidden flex items-center gap-1 mt-1">
                       {p.price} KES • {p.duration_minutes} mins
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell text-center font-medium text-gray-600">
                  KES {p.price}
                </td>
                <td className="px-6 py-4 hidden md:table-cell text-center text-gray-600">
                  <div className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs">
                    <ClockIcon className="w-3 h-3" /> {p.duration_minutes}m
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell text-center">
                  <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    {p.rate_limit || "Unlimited"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete Plan"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {!plans.length && (
          <div className="py-20 text-center space-y-3">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <SignalIcon className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-400 font-medium">No active plans found on this router.</p>
          </div>
        )}
      </div>
    </div>
  </div>
);}
