
import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import {
  ArrowPathIcon,
  CheckCircleIcon,
  CubeIcon,
  ExclamationCircleIcon,
  PlusIcon,
  SignalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import type { Plan, TabType, TimeUnit } from "./plans/types/plan";
import { listMikrotiks, type MikrotikDevice } from "../../types/device";
import {
  listPlans,
  createPlan,
  updatePlan,
  deletePlan,
} from "../../api/plans";

import PlanTabs from "./plans/PlanTab";
import PlanFilter from "./plans/PlanFilter";
import HotspotHtmlView from "./plans/views/HotspotHtmlView";
import PlanList from "./plans/PlanList";
import RouterConfigView from "./plans/views/RouterOSconfigView";
import PlanPagination from "./plans/Pagination";
import PlanFormModal from "./plans/PlanFormModal";

const ITEMS_PER_PAGE = 7;

const INITIAL_FORM = {
  name: "",
  price: "",
  rate_limit: "5M/5M",
  mikrotik: "",
  service_type: "HOTSPOT",
  is_featured: true,
};

type PlanFormState = typeof INITIAL_FORM;

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [mikrotiks, setMikrotiks] = useState<MikrotikDevice[]>([]);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [activeTab, setActiveTab] =
    useState<TabType>("hotspot_html");

  const [copiedId, setCopiedId] =
    useState<string | number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("days");
  const [durationInput, setDurationInput] = useState("");

  const [form, setForm] = useState<PlanFormState>(INITIAL_FORM);

  const loadData = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    setError("");

    try {
      const [plansData, mikrotiksData] = await Promise.all([
        listPlans(),
        listMikrotiks(),
      ]);

      setPlans(
        (plansData ?? []).map((plan) => ({
          ...plan,
          is_featured: plan.is_featured ?? false,
        })),
      );
      setMikrotiks(mikrotiksData ?? []);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load service plans. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredPlans = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return plans;

    return plans.filter((plan) => {
      const name = (plan.name ?? "").toLowerCase();
      const rate = (plan.rate_limit ?? "").toLowerCase();
      const service = (plan.service_type ?? "").toLowerCase();

      return (
        name.includes(query) ||
        rate.includes(query) ||
        service.includes(query)
      );
    });
  }, [plans, searchTerm]);

  const totalPages = Math.ceil(
    filteredPlans.length / ITEMS_PER_PAGE,
  );

  const paginatedPlans = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredPlans.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPlans, currentPage]);

  const formatDurationReadable = (minutes: number) => {
    if (!minutes || minutes < 0) return "";

    if (minutes % 1440 === 0) {
      const days = minutes / 1440;
      return `${days} ${days === 1 ? "day" : "days"}`;
    }

    if (minutes % 60 === 0) {
      const hours = minutes / 60;
      return `${hours} ${hours === 1 ? "hour" : "hours"}`;
    }

    return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  };

  const generateHotspotButtonHtml = (plan: Plan) => {
    const durationLabel = formatDurationReadable(
      plan.duration_minutes,
    );

    const description = `1 device ${durationLabel}`.trim();
    const price = Number(plan.price);

    // Escape single quotes in strings embedded in JavaScript.
    const safeDescription = description.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

    return `<button class="pkg" onclick="openPayment(${price.toFixed(
      2,
    )},'${safeDescription}',${plan.id})">Ksh ${plan.price} · 1 device · ${durationLabel}</button>`;
  };

  const generateFullHtmlSnippet = useMemo(() => {
    const hotspotPlans = plans.filter(
      (plan) =>
        plan.service_type === "HOTSPOT" || !plan.service_type,
    );

    const targetPlans =
      hotspotPlans.length > 0 ? hotspotPlans : plans;

    return targetPlans
      .map((plan) => `  ${generateHotspotButtonHtml(plan)}`)
      .join("\n");
  }, [plans]);

  const generateJsDataObject = useMemo(() => {
    return JSON.stringify(
      plans.map((plan) => ({
        id: plan.id,
        name: plan.name,
        amount: Number(plan.price),
        rate_limit: plan.rate_limit || "5M/5M",
        duration_minutes: plan.duration_minutes,
        duration_readable: formatDurationReadable(
          plan.duration_minutes,
        ),
        service_type: plan.service_type || "HOTSPOT",
      })),
      null,
      2,
    );
  }, [plans]);

  const generateMikrotikScript = (plan: Plan) => {
    const profileName = (
      plan.mikrotik_profile || plan.name
    ).replace(/\s+/g, "_");

    const rate = plan.rate_limit || "";
    const service = plan.service_type || "HOTSPOT";

    if (service === "HOTSPOT") {
      let command = `/ip hotspot user profile add name="${profileName}"`;

      if (rate) {
        command += ` rate-limit="${rate}"`;
      }

      if (plan.duration_minutes) {
        const totalMinutes = plan.duration_minutes;
        const days = Math.floor(totalMinutes / 1440);
        const hours = Math.floor((totalMinutes % 1440) / 60);
        const minutes = totalMinutes % 60;

        const timeParts = [
          days ? `${days}d` : "",
          hours ? `${hours}h` : "",
          minutes ? `${minutes}m` : "",
        ].filter(Boolean);

        command += ` session-timeout="${timeParts.join(" ")}"`;
      }

      return command;
    }

    if (service === "PPPOE") {
      return `/ppp profile add name="${profileName}"${
        rate ? ` rate-limit="${rate}"` : ""
      }`;
    }

    return `/queue type add name="${profileName}"${
      rate ? ` rate-limit="${rate}"` : ""
    }`;
  };

  const handleCopy = async (
    id: string | number,
    content: string,
  ) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setNotice("Copied to clipboard.");
      setError("");

      window.setTimeout(() => {
        setCopiedId((current) =>
          current === id ? null : current,
        );
      }, 2000);

      window.setTimeout(() => setNotice(""), 2500);
    } catch {
      setError(
        "Could not copy automatically. Check browser clipboard permissions.",
      );
    }
  };

  const calculateMinutes = (): number => {
    const value = Number(durationInput);

    if (!Number.isFinite(value) || value <= 0) return 0;

    if (timeUnit === "days") return value * 1440;
    if (timeUnit === "hours") return value * 60;

    return value;
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setDurationInput("");
    setTimeUnit("days");
    setForm({ ...INITIAL_FORM });
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Enter a name for this package.");
      return;
    }

    const price = Number(form.price);
    const duration = calculateMinutes();

    if (!Number.isFinite(price) || price < 0) {
      setError("Enter a valid package price.");
      return;
    }

    if (!duration) {
      setError("Enter a valid package duration.");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");

    const payload = {
      name: form.name.trim(),
      price,
      duration_minutes: duration,
      rate_limit: form.rate_limit,
      mikrotik: form.mikrotik
        ? String(form.mikrotik)
        : undefined,
      service_type: form.service_type,
      is_featured: form.is_featured,
    };

    try {
      if (editingId !== null) {
        await updatePlan(editingId, payload);
        setNotice("Package updated successfully.");
      } else {
        await createPlan(payload);
        setNotice("Package created successfully.");
      }

      resetForm();
      await loadData(false);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save the package.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Delete this package? This action cannot be undone.",
    );

    if (!confirmed) return;

    setLoading(true);
    setError("");
    setNotice("");

    try {
      await deletePlan(id);
      setNotice("Package deleted successfully.");

      const remainingCount = filteredPlans.length - 1;
      const lastPage = Math.max(
        1,
        Math.ceil(remainingCount / ITEMS_PER_PAGE),
      );

      if (currentPage > lastPage) {
        setCurrentPage(lastPage);
      }

      await loadData(false);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete the package.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(plan: Plan) {
    setError("");
    setNotice("");
    setEditingId(plan.id);

    const minutes = plan.duration_minutes || 0;

    if (minutes > 0 && minutes % 1440 === 0) {
      setTimeUnit("days");
      setDurationInput(String(minutes / 1440));
    } else if (minutes > 0 && minutes % 60 === 0) {
      setTimeUnit("hours");
      setDurationInput(String(minutes / 60));
    } else {
      setTimeUnit("minutes");
      setDurationInput(String(minutes));
    }

    setForm({
      name: plan.name ?? "",
      price: String(plan.price ?? ""),
      rate_limit: plan.rate_limit || "5M/5M",
      mikrotik: String(
        plan.mikrotik || plan.mikrotik_profile || "",
      ),
      service_type: plan.service_type || "HOTSPOT",
      is_featured: Boolean(plan.is_featured),
    });

    setShowForm(true);
  }

  if (initialLoading) {
    return (
      <div className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-4 bg-slate-50 px-4 dark:bg-gray-900">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-white shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <SignalIcon className="h-7 w-7 animate-pulse text-blue-600 dark:text-blue-400" />
        </div>

        <div className="text-center">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Loading service plans
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Fetching packages and router configuration…
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full min-w-0 bg-slate-50/70 px-3 py-4 dark:bg-gray-900 sm:px-5 sm:py-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-5 sm:space-y-6">
        {/* Page header */}
        <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-gray-800 sm:p-5 lg:p-6">
          <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 sm:h-12 sm:w-12">
                <CubeIcon className="h-6 w-6" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
                  Network services
                </p>

                <h1 className="mt-1 text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl lg:text-2xl">
                  Service plans
                </h1>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500 dark:text-slate-400 sm:text-sm">
                  Manage packages, prepare hotspot HTML exports,
                  and generate MikroTik configuration commands.
                </p>
              </div>
            </div>

            <div className="flex w-full shrink-0 items-center gap-2 sm:w-auto">
              <button
                type="button"
                onClick={() => void loadData()}
                disabled={loading}
                aria-label="Refresh service plans"
                title="Refresh service plans"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-gray-800 dark:text-slate-300 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10 dark:hover:text-blue-300"
              >
                <ArrowPathIcon
                  className={`h-5 w-5 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
              </button>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setError("");
                  setNotice("");
                  setShowForm(true);
                }}
                className="inline-flex h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 sm:flex-none sm:px-5"
              >
                <PlusIcon className="h-5 w-5 shrink-0" />
                <span>New package</span>
              </button>
            </div>
          </div>

          {/* Compact summary */}
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 dark:border-slate-700 sm:flex sm:items-center sm:gap-6">
            <div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Total packages
              </p>
              <p className="mt-1 text-xl font-bold tabular-nums text-slate-900 dark:text-white">
                {plans.length.toLocaleString()}
              </p>
            </div>

            <div className="hidden h-9 w-px bg-slate-200 dark:bg-slate-700 sm:block" />

            <div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Search results
              </p>
              <p className="mt-1 text-xl font-bold tabular-nums text-blue-700 dark:text-blue-300">
                {filteredPlans.length.toLocaleString()}
              </p>
            </div>

            <div className="col-span-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 sm:ml-auto sm:col-span-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Plan manager
            </div>
          </div>
        </header>

        {/* Feedback messages */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-800 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300 sm:p-4"
          >
            <ExclamationCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="min-w-0 flex-1 break-words">{error}</div>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="rounded-lg p-1 transition hover:bg-rose-100 dark:hover:bg-rose-500/20"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}

        {notice && !error && (
          <div
            role="status"
            className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
          >
            <CheckCircleIcon className="h-5 w-5 shrink-0" />
            <span className="min-w-0 flex-1">{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
              className="rounded-lg p-1 transition hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* View navigation */}
        <section className="min-w-0">
          <PlanTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onCopyAllHtml={() =>
              void handleCopy("full_html", generateFullHtmlSnippet)
            }
            copiedId={copiedId}
          />
        </section>

        {/* Search and count */}
        <section className="min-w-0">
          <PlanFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            totalCount={filteredPlans.length}
          />
        </section>

        {/* Active view */}
        <section className="min-w-0">
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

          {filteredPlans.length === 0 && (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center dark:border-slate-700 dark:bg-gray-800">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <CubeIcon className="h-6 w-6" />
              </div>

              <h2 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                {searchTerm.trim()
                  ? "No matching packages"
                  : "No packages yet"}
              </h2>

              <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500 dark:text-slate-400 sm:text-sm">
                {searchTerm.trim()
                  ? "Try a different package name, rate limit, or service type."
                  : "Create your first service package to start managing your plans."}
              </p>

              {searchTerm.trim() ? (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Clear search
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4" />
                  Create package
                </button>
              )}
            </div>
          )}
        </section>

        {/* Pagination */}
        {filteredPlans.length > 0 && (
          <section className="min-w-0">
            <PlanPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalFilteredCount={filteredPlans.length}
              itemsPerPage={ITEMS_PER_PAGE}
              setCurrentPage={setCurrentPage}
            />
          </section>
        )}

        {/* Create / edit modal */}
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
    </main>
  );
}