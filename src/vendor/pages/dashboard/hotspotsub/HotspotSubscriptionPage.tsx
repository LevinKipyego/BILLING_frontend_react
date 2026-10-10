import { useCallback, useEffect, useMemo, useState } from "react";
import { PlusIcon, WifiIcon, SignalIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

import { fetchHotspotSubscriptions } from "../../../api/hotspotsubscription";
import { apiFetch } from "../../../api/client";
import { listPlans } from "../../../api/plans";
import type { HotspotSubscription } from "../../../types/subscriptions";
import type { Plan } from "../../../types/plan";

import SubscriptionFilters from "./components/SubscriptionFilters";
import SubscriptionFormModal from "./components/SubscriptionFormModal";
import SubscriptionList from "./components/SubscriptionList";
import SubscriptionPagination from "./components/SubscriptionPagination";
import type { SubscriptionFormState } from "./types";
import { toLocalISO } from "./utils";

const ITEMS_PER_PAGE = 8;

const emptyForm = (): SubscriptionFormState => ({
  plan: "",
  user: 0,
  user_name: "",
  credential_password: "",
  plan_name: "",
  transaction_code: "",
  credential: 0,
  start_at: "",
  end_at: "",
  active: true,
  created_by_transaction: "",
});

export default function HotspotSubscriptionPage() {
  const [data, setData] = useState<HotspotSubscription[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState<SubscriptionFormState>(emptyForm);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [subscriptions, availablePlans] = await Promise.all([
        fetchHotspotSubscriptions(),
        listPlans(),
      ]);
      setData(subscriptions);
      setPlans(availablePlans);
    } catch (error) {
      console.error("Failed to load hotspot subscriptions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, sortOrder]);

  const processedData = useMemo(() => {
    const searchLower = search.toLowerCase().trim();

    return data
      .filter((subscription) => {
        const matchesSearch =
          !searchLower ||
          String(subscription.user).includes(searchLower) ||
          String(subscription.plan).includes(searchLower) ||
          String(subscription.user_name || "").toLowerCase().includes(searchLower) ||
          String(subscription.plan_name || "").toLowerCase().includes(searchLower) ||
          String(subscription.credential_password || "").toLowerCase().includes(searchLower);

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" ? subscription.active : !subscription.active);

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const dateA = new Date(a.start_at).getTime();
        const dateB = new Date(b.start_at).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
  }, [data, search, statusFilter, sortOrder]);

  const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);
  const safePage = Math.min(currentPage, Math.max(totalPages, 1));
  const paginatedData = processedData.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value, type } = event.target;
    const nextValue =
      type === "checkbox" && event.target instanceof HTMLInputElement
        ? event.target.checked
        : name === "plan" || name === "created_by_transaction"
          ? value === "" ? "" : Number(value)
          : name === "user" || name === "credential"
            ? Number(value)
            : value;

    setForm((current) => ({ ...current, [name]: nextValue }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.start_at || !form.end_at) return;

    const start = new Date(form.start_at);
    const end = new Date(form.end_at);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      window.alert("Enter valid start and end dates.");
      return;
    }
    if (end <= start) {
      window.alert("The end date and time must be after the start date and time.");
      return;
    }

    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `/hotspot/subscriptions/${editingId}/`
        : "/hotspot/subscriptions/";

      const payload = {
        ...form,
        start_at: start.toISOString(),
        end_at: end.toISOString(),
      };

      await apiFetch(url, { method, body: JSON.stringify(payload) });
      setIsFormOpen(false);
      setEditingId(null);
      setForm(emptyForm());
      await loadData();
    } catch (error) {
      console.error("Failed to save hotspot subscription:", error);
      window.alert("Could not save the subscription. Check the form and try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(item: HotspotSubscription) {
    setEditingId(item.id);
    setForm({
      ...emptyForm(),
      ...item,
      plan: item.plan ?? "",
      start_at: toLocalISO(item.start_at),
      end_at: toLocalISO(item.end_at),
    });
    setIsFormOpen(true);
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm());
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(emptyForm());
  }

  const activeCount = data.filter((item) => item.active).length;

  return (
    <main className="min-h-screen bg-slate-50 p-4 transition-colors duration-300 dark:bg-gray-900 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-[1600px]">
        {/* Header Section */}
        <header className="mb-6 flex flex-col justify-between gap-4 md:mb-7 md:flex-row md:items-center">
          <div className="min-w-0">
            <div className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
              <WifiIcon className="h-4 w-4" />
              Access management
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Hotspot <span className="text-blue-600 dark:text-blue-400">Subscriptions</span>
            </h1>
            <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Manage subscriber access, plan assignments, and subscription validity.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 active:scale-[0.99] md:w-auto"
          >
            <PlusIcon className="h-5 w-5" />
            New Subscription
          </button>
        </header>

        {/* Summary Statistics Cards */}
        <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SummaryCard
            label="Total subscriptions"
            value={data.length}
            icon={<WifiIcon className="h-5 w-5" />}
            tone="blue"
          />
          <SummaryCard
            label="Active subscriptions"
            value={activeCount}
            icon={<CheckCircleIcon className="h-5 w-5" />}
            tone="green"
          />
          <SummaryCard
            label="Inactive subscriptions"
            value={data.length - activeCount}
            icon={<SignalIcon className="h-5 w-5" />}
            tone="slate"
          />
        </section>

        {/* Filters Bar */}
        <SubscriptionFilters
          search={search}
          statusFilter={statusFilter}
          sortOrder={sortOrder}
          onSearchChange={setSearch}
          onStatusChange={setStatusFilter}
          onSortToggle={() => setSortOrder((current) => (current === "desc" ? "asc" : "desc"))}
        />

        {/* Data List / Table Section */}
        {loading && data.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-[24px] border border-gray-200 bg-white text-sm font-medium text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-blue-400">
            <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            Syncing subscriptions...
          </div>
        ) : (
          <>
            {loading && (
              <div className="mb-3 text-xs font-medium text-blue-600 dark:text-blue-400">
                Refreshing subscription data…
              </div>
            )}
            <SubscriptionList items={paginatedData} onEdit={handleEdit} />
            <SubscriptionPagination
              totalItems={processedData.length}
              currentPage={safePage}
              totalPages={totalPages}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {/* Operational Note Box */}
        <aside className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-500/20 dark:bg-blue-500/5 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">
            Operational note
          </p>
          <p className="mt-1 text-sm leading-6 text-blue-900/80 dark:text-blue-200/80">
            Subscription state and validity timestamps should stay consistent with the hotspot user and plan records. If a subscriber should not have access, confirm the subscription state and expiry time before changing their credentials.
          </p>
        </aside>
      </div>

      {/* Accordion Form Modal */}
      <SubscriptionFormModal
        open={isFormOpen}
        editingId={editingId}
        form={form}
        plans={plans}
        saving={saving}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />
    </main>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: "blue" | "green" | "slate";
}) {
  const styles = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    slate: "bg-slate-100 text-slate-600 dark:bg-gray-700 dark:text-gray-300",
  }[tone];

  return (
    <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/70 sm:p-5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${styles}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}