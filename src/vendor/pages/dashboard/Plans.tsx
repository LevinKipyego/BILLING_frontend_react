import { useEffect, useState, useMemo } from "react";
import type { Plan, TabType, TimeUnit } from "./plans/types/plan";
import { listMikrotiks, type MikrotikDevice } from "../../types/device";
import { listPlans, createPlan, updatePlan, deletePlan } from "../../api/plans";

import { PlusIcon, SignalIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

import PlanTabs from "./plans/PlanTab";
import PlanFilter from "./plans/PlanFilter";
import HotspotHtmlView from "./plans/views/HotspotHtmlView";
import PlanList from "./plans/PlanList";
import RouterConfigView from "./plans/views/RouterOSconfigView";
import PlanPagination from "./plans/Pagination";
import PlanFormModal from "./plans/PlanFormModal";

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [mikrotiks, setMikrotiks] = useState<MikrotikDevice[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>("hotspot_html");
  const [copiedId, setCopiedId] = useState<string | number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const [timeUnit, setTimeUnit] = useState<TimeUnit>("days");
  const [durationInput, setDurationInput] = useState("");
  
  const [form, setForm] = useState({
    name: "",
    price: "",
    rate_limit: "5M/5M",
    mikrotik: "",
    service_type: "HOTSPOT"
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
  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

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

  const formatDurationReadable = (mins: number) => {
    if (!mins) return "";
    if (mins >= 1440 && mins % 1440 === 0) return `${mins / 1440}hrs`;
    if (mins >= 60 && mins % 60 === 0) return `${mins / 60}hrs`;
    return `${mins}mins`;
  };

  const generateHotspotButtonHtml = (p: Plan) => {
    const durationLabel = formatDurationReadable(p.duration_minutes);
    const descLabel = `1 device ${durationLabel}`.trim();
    const priceFormatted = Number(p.price).toFixed(2);
    return `<button class="pkg" onclick="openPayment(${priceFormatted},'${descLabel}',${p.id})">Ksh ${p.price} · 1 device · ${durationLabel}</button>`;
  };

  const generateFullHtmlSnippet = useMemo(() => {
    const hotspotPlans = plans.filter(p => p.service_type === "HOTSPOT" || !p.service_type);
    const targetList = hotspotPlans.length > 0 ? hotspotPlans : plans;
    return targetList.map(p => `  ${generateHotspotButtonHtml(p)}`).join("\n");
  }, [plans]);

  const generateJsDataObject = useMemo(() => {
    return JSON.stringify(
      plans.map(p => ({
        id: p.id,
        name: p.name,
        amount: Number(p.price),
        rate_limit: p.rate_limit || "5M/5M",
        duration_minutes: p.duration_minutes,
        duration_readable: formatDurationReadable(p.duration_minutes),
        service_type: p.service_type || "HOTSPOT"
      })),
      null,
      2
    );
  }, [plans]);

  const generateMikrotikScript = (p: Plan) => {
    const profileName = p.mikrotik_profile || p.name.replace(/\s+/g, "_");
    const rate = p.rate_limit || "";
    const service = p.service_type || "HOTSPOT";

    if (service === "HOTSPOT") {
      let cmd = `/ip hotspot user profile add name="${profileName}"`;
      if (rate) cmd += ` rate-limit="${rate}"`;
      if (p.duration_minutes) {
        const hours = Math.floor(p.duration_minutes / 60);
        const mins = p.duration_minutes % 60;
        const days = Math.floor(hours / 24);
        const remHours = hours % 24;
        const timeStr = days > 0 ? `${days}d ${remHours}h` : `${remHours}h ${mins}m`;
        cmd += ` session-timeout="${timeStr}"`;
      }
      return cmd;
    } else if (service === "PPPOE") {
      return `/ppp profile add name="${profileName}"${rate ? ` rate-limit="${rate}"` : ""}`;
    }
    return `/queue type add name="${profileName}"${rate ? ` rate-limit="${rate}"` : ""}`;
  };

  const handleCopy = (idKey: string | number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(idKey);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const calculateMinutes = (): number => {
    const val = Number(durationInput) || 0;
    if (timeUnit === "days") return val * 1440;
    if (timeUnit === "hours") return val * 60;
    return val;
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setDurationInput("");
    setForm({
      name: "",
      price: "",
      rate_limit: "5M/5M",
      mikrotik: "",
      service_type: "HOTSPOT"
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      name: form.name,
      price: Number(form.price),
      duration_minutes: calculateMinutes(),
      rate_limit: form.rate_limit,
      mikrotik: form.mikrotik ? String(form.mikrotik) : undefined,
      service_type: form.service_type
    };
    

    try {
      if (editingId) {
        await updatePlan(editingId, payload);
      } else {
        await createPlan(payload);
      }
      resetForm();
      await loadData();
    } catch (err: any) {
      setError(err.message || "Failed to save plan.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this plan?")) return;
    await deletePlan(id);
    loadData();
  }

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
      mikrotik: String(p.mikrotik || p.mikrotik_profile || ""),
      service_type: p.service_type || "HOTSPOT"
    });
    setShowForm(true);
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-gray-900">
        <SignalIcon className="w-8 h-8 text-blue-600 animate-pulse" />
        <span className="mt-2 text-xs font-bold text-slate-400">Loading Hotspot Engine...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-3 md:p-8 space-y-4 md:space-y-6 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Service Plans & Hotspot HTML Exporter
          </h1>
          <p className="text-[10px] md:text-sm text-slate-500 dark:text-slate-400 font-bold uppercase">
            Manage packages and generate front-end snippet codes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadData} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-black text-white px-5 py-2.5 rounded-lg text-xs font-black uppercase shadow-md"
          >
            <PlusIcon className="w-4 h-4 stroke-[3]" />
            <span>New Package</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-lg text-rose-700 text-xs font-bold">
          {error}
        </div>
      )}

      {/* Tabs */}
      <PlanTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onCopyAllHtml={() => handleCopy("full_html", generateFullHtmlSnippet)}
        copiedId={copiedId}
      />

      {/* Search Filter */}
      <PlanFilter 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        totalCount={filteredPlans.length} 
      />

      {/* Dynamic Views */}
      {activeTab === "hotspot_html" && (
        <HotspotHtmlView 
          plans={paginatedPlans}
          generateHotspotButtonHtml={generateHotspotButtonHtml}
          fullHtmlSnippet={generateFullHtmlSnippet}
          jsDataObject={generateJsDataObject}
          onCopy={handleCopy}
          copiedId={copiedId}
        />
      )}

      {activeTab === "directory" && (
        <PlanList 
          plans={paginatedPlans}
          onEdit={handleEdit}
          onDelete={handleDelete}
          formatDurationReadable={formatDurationReadable}
        />
      )}

      {activeTab === "configs" && (
        <RouterConfigView 
          plans={paginatedPlans}
          generateMikrotikScript={generateMikrotikScript}
          onCopy={handleCopy}
          copiedId={copiedId}
        />
      )}

      {/* Pagination Controls */}
      <PlanPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        totalFilteredCount={filteredPlans.length}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Modal Form */}
      <PlanFormModal 
        showForm={showForm}
        editingId={editingId}
        form={form}
        durationInput={durationInput}
        timeUnit={timeUnit}
        mikrotiks={mikrotiks}
        loading={loading}
        onClose={resetForm}
        onSubmit={handleSubmit}
        setForm={setForm}
        setDurationInput={setDurationInput}
        setTimeUnit={setTimeUnit}
      />
    </div>
  );
}