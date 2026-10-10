import React, { useCallback, useEffect, useState } from "react";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  CpuChipIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  KeyIcon,
  PencilSquareIcon,
  PlusIcon,
  ServerIcon,
  ShieldCheckIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { NAS } from "../../types/nas";
import { listNAS, createNAS, updateNAS, deleteNAS } from "../../api/nas";

type NASForm = Partial<NAS>;
type FormSection = "identity" | "connection" | "review" | null;

const EMPTY_FORM: NASForm = {
  nasname: "",
  shortname: "",
  type: "other",
  secret: "",
  server: "",
  community: "",
  ports: 0,
  description: "",
};

const inputClass =
  "h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none transition focus:border-slate-400 dark:border-gray-700 dark:bg-gray-900 dark:text-slate-100 dark:focus:border-gray-500 sm:text-[13px]";

const labelClass =
  "mb-1 block text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label className={labelClass}>{label}</label>
      {children}
      {hint && <p className="mt-1 text-[10px] leading-4 text-slate-500 dark:text-slate-400">{hint}</p>}
    </div>
  );
}

function SectionRow({
  title,
  description,
  open,
  complete,
  onClick,
  icon,
}: {
  title: string;
  description: string;
  open: boolean;
  complete?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50/50 dark:hover:bg-gray-800/40"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500 dark:bg-gray-800 dark:text-slate-300">
        {complete ? <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-500" /> : icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-medium text-slate-900 dark:text-white">
          {title}
        </span>
        <span className="mt-0.5 block truncate text-[10px] text-slate-500 dark:text-slate-400">
          {description}
        </span>
      </span>
      <ChevronDownIcon
        className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
          open ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}

export default function NASPage() {
  const [items, setItems] = useState<NAS[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formSection, setFormSection] = useState<FormSection>("identity");
  const [showSecret, setShowSecret] = useState(false);
  const [form, setForm] = useState<NASForm>({ ...EMPTY_FORM });

  const loadNAS = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listNAS();
      setItems(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load NAS entries from RADIUS.");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNAS();
  }, [loadNAS]);

  function openCreateForm() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setFormSection("identity");
    setShowSecret(false);
    setError("");
    setNotice("");
    setShowForm(true);
  }

  function startEdit(nas: NAS) {
    setEditingId(nas.id);
    setForm({ ...nas, secret: "" });
    setFormSection("identity");
    setShowSecret(false);
    setError("");
    setNotice("");
    setShowForm(true);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setFormSection("identity");
    setShowSecret(false);
  }

  function updateField<K extends keyof NASForm>(key: K, value: NASForm[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);
    try {
      const payload: NASForm = { ...form };
      if (editingId && !payload.secret) delete payload.secret;
      if (editingId) {
        await updateNAS(editingId, payload);
        setNotice("NAS configuration updated successfully.");
      } else {
        await createNAS(payload);
        setNotice("NAS server added successfully.");
      }
      closeForm();
      await loadNAS();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unable to save this NAS configuration.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(nas: NAS) {
    const confirmed = window.confirm(
      `Delete NAS ${nas.nasname}? Devices using this entry may no longer authenticate through RADIUS.`,
    );
    if (!confirmed) return;
    setError("");
    setNotice("");
    setLoading(true);
    try {
      await deleteNAS(nas.id);
      setNotice(`NAS ${nas.nasname} was deleted.`);
      await loadNAS();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete NAS entry.");
    } finally {
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <ArrowPathIcon className="h-4 w-4 animate-spin text-blue-600" />
          <div>
            <p className="text-xs font-medium text-slate-800 dark:text-slate-100">Loading NAS servers</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Retrieving RADIUS configuration…</p>
          </div>
        </div>
      </div>
    );
  }

  const toggleFormSection = (section: Exclude<FormSection, null>) => {
    setFormSection((current) => (current === section ? null : section));
  };

  return (
    <main className="space-y-3 text-slate-800 dark:text-slate-200">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg px-4 sm:px-5 py-3.5 shadow-sm">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <ServerIcon className="h-4 w-4" />
            </span>
            <div>
              <h1 className="text-sm sm:text-base font-medium text-slate-900 dark:text-white">
                NAS Infrastructure
              </h1>
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                Manage network devices trusted by your RADIUS server.
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2">
          <button
            type="button"
            onClick={() => void loadNAS()}
            disabled={loading}
            aria-label="Refresh NAS list"
            className="h-9 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-slate-300 px-3 rounded-lg text-xs font-medium hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowPathIcon className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            type="button"
            onClick={openCreateForm}
            className="flex-1 sm:flex-initial h-9 bg-blue-600 hover:bg-blue-700 text-white px-3.5 rounded-lg font-medium transition-colors text-xs shadow-sm flex items-center justify-center gap-1.5"
          >
            <PlusIcon className="h-3.5 w-3.5" /> Add NAS Server
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
          <InformationCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="min-w-0 flex-1">{error}</p>
          <button type="button" onClick={() => setError("")} aria-label="Dismiss error"><XMarkIcon className="h-4 w-4" /></button>
        </div>
      )}
      {notice && (
        <div role="status" className="flex items-start gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
          <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="min-w-0 flex-1">{notice}</p>
          <button type="button" onClick={() => setNotice("")} aria-label="Dismiss notice"><XMarkIcon className="h-4 w-4" /></button>
        </div>
      )}

      {/* Metrics Row */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <p className="text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">Configured NAS</p>
          <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{items.length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <p className="text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">Device Types</p>
          <p className="mt-1 text-lg font-bold  text-slate-900 dark:text-white">{new Set(items.map((item) => item.type || "other")).size}</p>
        </div>
        <div className="col-span-2 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3.5 dark:border-blue-900/40 dark:bg-blue-950/20 sm:col-span-1">
          <div className="flex items-start gap-2">
            <ShieldCheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-200">RADIUS Trust List</p>
              <p className="mt-0.5 text-[10px] text-blue-800/80 dark:text-blue-200/80">Only register devices you administer and expect to authenticate.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Progressive Accordion Form */}
      {showForm && (
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3.5 dark:border-gray-800 sm:px-5">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.07em] text-blue-600 dark:text-blue-400">{editingId ? "Update Configuration" : "New Configuration"}</span>
              <h2 className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white">{editingId ? "Edit NAS Server" : "Add a NAS Server"}</h2>
            </div>
            <button type="button" onClick={closeForm} aria-label="Close form" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-800"><XMarkIcon className="h-4 w-4" /></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="divide-y divide-slate-100 dark:divide-gray-800">
              {/* Identity Accordion Section */}
              <div>
                <SectionRow
                  title="1. Network Device Identity"
                  description={form.nasname ? `Address: ${form.nasname}` : "Configure IP address and hostname"}
                  open={formSection === "identity"}
                  complete={Boolean(form.nasname?.trim())}
                  onClick={() => toggleFormSection("identity")}
                  icon={<GlobeAltIcon className="h-3.5 w-3.5" />}
                />
                {formSection === "identity" && (
                  <div className="grid gap-3.5 px-4 pb-4 pt-1 sm:grid-cols-2 sm:px-5">
                    <Field label="NAS IP Address / Hostname" hint="Use the router or access server's RADIUS source address.">
                      <div className="relative">
                        <GlobeAltIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input autoFocus required className={`${inputClass} pl-9`} placeholder="10.0.0.1" value={form.nasname || ""} onChange={(e) => updateField("nasname", e.target.value)} />
                      </div>
                    </Field>
                    <Field label="Short Name (Optional)" hint="A friendly reference label.">
                      <input className={inputClass} placeholder="Core-Router-01" value={form.shortname || ""} onChange={(e) => updateField("shortname", e.target.value)} />
                    </Field>
                  </div>
                )}
              </div>

              {/* Connection Accordion Section */}
              <div>
                <SectionRow
                  title="2. Connection & Secrets"
                  description={form.type ? `Device: ${form.type}` : "Configure shared secret and ports"}
                  open={formSection === "connection"}
                  complete={Boolean(editingId || form.secret)}
                  onClick={() => toggleFormSection("connection")}
                  icon={<KeyIcon className="h-3.5 w-3.5" />}
                />
                {formSection === "connection" && (
                  <div className="space-y-3.5 px-4 pb-4 pt-1 sm:px-5">
                    <Field label="Shared Secret" hint={editingId ? "Leave blank to keep existing secret." : "Enter a strong, unique shared secret."}>
                      <div className="relative">
                        <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input className={`${inputClass} pr-16 pl-9`} type={showSecret ? "text" : "password"} required={!editingId} autoComplete="new-password" placeholder={editingId ? "Retain current secret" : "Enter shared secret"} value={form.secret || ""} onChange={(e) => updateField("secret", e.target.value)} />
                        <button type="button" onClick={() => setShowSecret((visible) => !visible)} className="absolute inset-y-1 right-1 rounded-md px-2.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-gray-800">
                          {showSecret ? "Hide" : "Show"}
                        </button>
                      </div>
                    </Field>
                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <Field label="Device Type" hint="For example, MikroTik or Cisco.">
                        <div className="relative">
                          <CpuChipIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <input className={`${inputClass} pl-9`} placeholder="MikroTik" value={form.type || ""} onChange={(e) => updateField("type", e.target.value)} />
                        </div>
                      </Field>
                      <Field label="Port (Optional)" hint="Leave as 0 if unspecified.">
                        <input type="number" min={0} className={inputClass} placeholder="0" value={form.ports ?? 0} onChange={(e) => updateField("ports", Number(e.target.value) || 0)} />
                      </Field>
                    </div>
                  </div>
                )}
              </div>

              {/* Review & Details Accordion Section */}
              <div>
                <SectionRow
                  title="3. Review & Description"
                  description={form.description ? "Description provided" : "Optional site notes"}
                  open={formSection === "review"}
                  complete={true}
                  onClick={() => toggleFormSection("review")}
                  icon={<InformationCircleIcon className="h-3.5 w-3.5" />}
                />
                {formSection === "review" && (
                  <div className="space-y-3.5 px-4 pb-4 pt-1 sm:px-5">
                    <Field label="Description / Location (Optional)" hint="Branch, rack, or site role.">
                      <textarea rows={2} className="w-full rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-900 outline-none transition focus:border-slate-400 dark:border-gray-700 dark:bg-gray-900 dark:text-slate-100 dark:focus:border-gray-500 resize-y" placeholder="Main office gateway — rack 1" value={form.description || ""} onChange={(e) => updateField("description", e.target.value)} />
                    </Field>
                    <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-gray-700">
                      <div className="border-b border-slate-200 bg-slate-50 px-3.5 py-2.5 dark:border-gray-700 dark:bg-gray-800/60"><p className="text-[11px] font-semibold text-slate-800 dark:text-slate-100">Summary</p></div>
                      <dl className="divide-y divide-slate-100 text-xs dark:divide-gray-800">
                        <div className="flex items-center justify-between gap-4 px-3.5 py-2.5"><dt className="text-slate-500 dark:text-slate-400">NAS Address</dt><dd className=" text-slate-900 dark:text-slate-100">{form.nasname || "N/A"}</dd></div>
                        <div className="flex items-center justify-between gap-4 px-3.5 py-2.5"><dt className="text-slate-500 dark:text-slate-400">Short Name</dt><dd className=" text-slate-900 dark:text-slate-100">{form.shortname || "—"}</dd></div>
                        <div className="flex items-center justify-between gap-4 px-3.5 py-2.5"><dt className="text-slate-500 dark:text-slate-400">Device Type</dt><dd className=" text-slate-900 dark:text-slate-100">{form.type || "other"}</dd></div>
                      </dl>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center px-4 py-3.5 border-t border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-900">
              <button type="button" onClick={closeForm} className="h-9 px-3.5 border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-medium hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading || !form.nasname?.trim() || (!editingId && !form.secret)} className="h-9 bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50">
                {loading ? <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" /> : <CheckCircleIcon className="h-3.5 w-3.5" />}
                {loading ? "Saving…" : editingId ? "Save Changes" : "Create NAS Server"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* NAS Server List Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden border border-slate-200 dark:border-gray-700">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center">
          <h3 className="text-xs font-medium text-slate-900 dark:text-white uppercase tracking-wider">
            Registered Servers ({items.length})
          </h3>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
            No NAS servers configured.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 p-3.5 sm:p-4 lg:grid-cols-2">
            {items.map((nas) => (
              <article key={nas.id} className="rounded-lg border border-slate-200 dark:border-gray-800 p-3.5 space-y-3 bg-slate-50/50 dark:bg-gray-800/20">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300">
                      <ServerIcon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-medium text-slate-900 dark:text-white text-xs truncate">{nas.nasname}</h4>
                      <p className="text-[10px] text-slate-400 truncate">{nas.shortname || "No short name"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => startEdit(nas)} aria-label="Edit" className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 rounded-md">
                      <PencilSquareIcon className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => void handleDelete(nas)} aria-label="Delete" className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-md">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] pt-2 border-t border-slate-200/60 dark:border-gray-800">
                  <div>
                    <span className="text-slate-400">Type: </span>
                    <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{nas.type || "other"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Port: </span>
                    <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{nas.ports || "0"}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Troubleshooting Notes */}
      <details className="group rounded-lg border border-slate-200 bg-white dark:border-gray-700 dark:bg-gray-900 overflow-hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-xs font-medium text-slate-800 dark:text-slate-100">
          <span className="flex items-center gap-2"><InformationCircleIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" /> NAS Troubleshooting Notes</span>
          <ChevronDownIcon className="h-4 w-4 text-slate-400 transition group-open:rotate-180" />
        </summary>
        <div className="space-y-2 border-t border-slate-100 px-4 py-3 text-[11px] leading-5 text-slate-600 dark:border-gray-800 dark:text-slate-400 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0">
          <p><strong className="text-slate-800 dark:text-slate-200">No Access-Request:</strong> Verify RADIUS server routing and firewall rules.</p>
          <p><strong className="text-slate-800 dark:text-slate-200">Invalid Authenticator:</strong> Confirm shared secret matches exactly.</p>
          <p><strong className="text-slate-800 dark:text-slate-200">Unknown Client:</strong> Ensure NAS source IP matches registered record.</p>
        </div>
      </details>
    </main>
  );
}