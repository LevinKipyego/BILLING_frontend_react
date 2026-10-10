import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  SignalIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  CpuChipIcon,
  ExclamationCircleIcon,
  MapPinIcon,
  PencilSquareIcon,
  PlusIcon,
  ServerIcon,
  TrashIcon,
  XMarkIcon,
  ChevronDownIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

import {
  fetchMikrotiks,
  createMikrotik,
  deleteMikrotik,
  updateMikrotik,
} from "../../api/devices";
import type { MikrotikDevice } from "../../types/device";

type MikrotikRecord = MikrotikDevice & {
  Model?: string | null;
  OSversion?: string | null;
  site_name?: string | null;
  region?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status?: string;
  enabled?: boolean;
  created_at?: string;
};

type DeviceForm = {
  identity_name: string;
  Model: string;
  OSversion: string;
  serial_number: string;
  site_name: string;
  api_ip: string;
  region: string;
  latitude: string;
  longitude: string;
};

type FormSection = "identity" | "hardware" | "review" | null;

const EMPTY_FORM: DeviceForm = {
  identity_name: "",
  Model: "",
  OSversion: "",
  serial_number: "",
  site_name: "",
  api_ip: "",
  region: "",
  latitude: "",
  longitude: "",
};

const inputClass =
  "h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none transition focus:border-slate-400 dark:border-gray-700 dark:bg-gray-900 dark:text-slate-100 dark:focus:border-gray-500 sm:text-[13px]";

const labelClass =
  "mb-1 block text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500";

const cardClass =
  "rounded-lg border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900";

function displayValue(value: unknown) {
  return value === null || value === undefined || value === "" ? "Not provided" : String(value);
}

function asFormValue(value: unknown) {
  return value === null || value === undefined ? "" : String(value);
}

function StatusPill({ status }: { status?: string }) {
  const isUp = status?.toLowerCase() === "up" || status?.toLowerCase() === "online";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${
        isUp
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "border-slate-200 bg-slate-100 text-slate-600 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-300"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isUp ? "bg-emerald-500" : "bg-slate-400"}`} />
      {status || "Unknown"}
    </span>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  optional = false,
  hint,
  min,
  max,
  step,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  optional?: boolean;
  hint?: string;
  min?: string;
  max?: string;
  step?: string;
  required?: boolean;
}) {
  return (
    <div className="min-w-0">
      <label className={labelClass}>
        {label}
        {optional && <span className="ml-1 font-normal text-slate-400 lowercase">(optional)</span>}
      </label>
      <input
        className={inputClass}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        required={required}
      />
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

export default function Mikrotiks() {
  const [devices, setDevices] = useState<MikrotikRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formSection, setFormSection] = useState<FormSection>("identity");
  const [form, setForm] = useState<DeviceForm>(EMPTY_FORM);

  const loadDevices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMikrotiks();
      setDevices((data || []) as MikrotikRecord[]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not load MikroTik devices.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDevices();
  }, [loadDevices]);

  const setField = (name: keyof DeviceForm, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormSection("identity");
    setError(null);
    setNotice(null);
    setShowForm(true);
  };

  const startEdit = (device: MikrotikRecord) => {
    setForm({
      identity_name: asFormValue(device.identity_name),
      Model: asFormValue(device.Model),
      OSversion: asFormValue(device.OSversion),
      serial_number: asFormValue(device.serial_number),
      site_name: asFormValue(device.site_name),
      api_ip: asFormValue(device.api_ip),
      region: asFormValue(device.region),
      latitude: asFormValue(device.latitude),
      longitude: asFormValue(device.longitude),
    });
    setEditingId(String(device.id));
    setFormSection("identity");
    setError(null);
    setNotice(null);
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormSection("identity");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSaving(true);
    setError(null);
    setNotice(null);

    const payload = {
      identity_name: form.identity_name.trim(),
      api_ip: form.api_ip.trim(),
      Model: form.Model.trim() || null,
      OSversion: form.OSversion.trim() || null,
      serial_number: form.serial_number.trim(),
      site_name: form.site_name.trim(),
      region: form.region.trim(),
      latitude: form.latitude.trim() === "" ? null : Number(form.latitude),
      longitude: form.longitude.trim() === "" ? null : Number(form.longitude),
    };

    if (
      (payload.latitude !== null && (!Number.isFinite(payload.latitude) || payload.latitude < -90 || payload.latitude > 90)) ||
      (payload.longitude !== null && (!Number.isFinite(payload.longitude) || payload.longitude < -180 || payload.longitude > 180))
    ) {
      setError("Coordinates are invalid. Latitude must be between -90 and 90; longitude must be between -180 and 180.");
      setFormSection("hardware");
      setSaving(false);
      return;
    }

    try {
      if (editingId) {
        await updateMikrotik(editingId, payload as Parameters<typeof updateMikrotik>[1]);
        setNotice("MikroTik device details updated.");
      } else {
        await createMikrotik(payload as Parameters<typeof createMikrotik>[0]);
        setNotice("MikroTik device registered.");
      }
      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      setFormSection("identity");
      await loadDevices();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not save this MikroTik device.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this MikroTik device? This may affect RADIUS authentication for this router.")) return;
    setError(null);
    setNotice(null);
    try {
      await deleteMikrotik(id);
      setNotice("MikroTik device deleted.");
      await loadDevices();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to remove this device.");
    }
  };

  const onlineCount = devices.filter((device) => {
    const status = String(device.status || "").toLowerCase();
    return status === "up" || status === "online";
  }).length;

  const toggleFormSection = (section: Exclude<FormSection, null>) => {
    setFormSection((current) => (current === section ? null : section));
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl space-y-3 px-3 py-3.5 text-slate-800 transition-colors sm:px-5 sm:py-5 lg:px-6 dark:text-slate-100">
      
      {/* Header Toolbar */}
      <div className={`${cardClass} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-4 sm:px-5 py-3.5`}>
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <CpuChipIcon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-medium text-slate-900 dark:text-white">
              MikroTik Nodes
            </h1>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              Manage router identity, hardware details and deployment locations.
            </p>
          </div>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2">
          <button
            type="button"
            onClick={() => void loadDevices()}
            disabled={loading}
            aria-label="Refresh list"
            className="h-9 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-slate-300 px-3 rounded-lg text-xs font-medium hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowPathIcon className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="flex-1 sm:flex-initial h-9 bg-blue-600 hover:bg-blue-700 text-white px-3.5 rounded-lg font-medium transition-colors text-xs shadow-sm flex items-center justify-center gap-1.5"
          >
            <PlusIcon className="h-3.5 w-3.5" /> Add Device
          </button>
        </div>
      </div>

      {(error || notice) && (
        <div
          role={error ? "alert" : "status"}
          className={`flex items-start gap-2.5 rounded-lg border p-3 text-xs ${
            error
              ? "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400"
              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          }`}
        >
          {error ? <ExclamationCircleIcon className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />}
          <p className="min-w-0 flex-1">{error || notice}</p>
          <button type="button" onClick={() => { setError(null); setNotice(null); }} aria-label="Dismiss message">
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className={`${cardClass} p-3.5`}>
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">Registered Devices</p>
            <ServerIcon className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-1 text-lg font-bold font-mono text-slate-900 dark:text-white">{devices.length}</p>
        </div>
        <div className={`${cardClass} p-3.5`}>
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">Reported Online</p>
            <SignalIcon className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-1 text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">{onlineCount}</p>
        </div>
        <div className={`${cardClass} p-3.5`}>
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">Location Details</p>
            <MapPinIcon className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-1 text-lg font-bold font-mono text-slate-900 dark:text-white">{devices.filter((d) => d.latitude != null && d.longitude != null).length}</p>
        </div>
      </section>

      {/* Router Inventory List Section */}
      <section className={`${cardClass} overflow-hidden`}>
        <div className="px-4 py-3 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center">
          <h3 className="text-xs font-medium text-slate-900 dark:text-white uppercase tracking-wider">
            Registered Routers ({devices.length})
          </h3>
        </div>

        {loading && devices.length === 0 ? (
          <div className="flex items-center justify-center gap-2 px-4 py-12 text-xs text-slate-500">
            <ArrowPathIcon className="h-4 w-4 animate-spin" /> Loading devices…
          </div>
        ) : devices.length === 0 ? (
          <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
            No MikroTik devices configured.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 p-3.5 sm:p-4 lg:grid-cols-2">
            {devices.map((device) => (
              <article key={device.id} className="rounded-lg border border-slate-200 dark:border-gray-800 p-3.5 space-y-3 bg-slate-50/50 dark:bg-gray-800/20">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300">
                      <CpuChipIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-medium text-slate-900 dark:text-white text-xs truncate">{displayValue(device.identity_name)}</h4>
                      <p className="font-mono text-[10px] text-slate-400 truncate mt-0.5">{displayValue(device.api_ip)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <StatusPill status={device.status} />
                    <button type="button" onClick={() => startEdit(device)} aria-label="Edit" className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 rounded-md">
                      <PencilSquareIcon className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => void handleDelete(String(device.id))} aria-label="Delete" className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-md">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t border-slate-200/60 dark:border-gray-800 text-[11px]">
                  <div><span className="text-slate-400">Model: </span><span className="font-medium text-slate-700 dark:text-slate-300">{displayValue(device.Model)}</span></div>
                  <div><span className="text-slate-400">RouterOS: </span><span className="font-medium text-slate-700 dark:text-slate-300">{displayValue(device.OSversion)}</span></div>
                  <div><span className="text-slate-400">Serial: </span><span className="font-mono font-medium text-slate-700 dark:text-slate-300">{displayValue(device.serial_number)}</span></div>
                  <div><span className="text-slate-400">Site: </span><span className="font-medium text-slate-700 dark:text-slate-300">{[device.site_name, device.region].filter(Boolean).join(" · ") || "Not provided"}</span></div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <span className={`rounded-full px-2 py-1 ${device.enabled ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
                    {device.enabled ? "Enabled" : "Disabled"}
                  </span>
                  {device.created_at && <span>Added {new Date(device.created_at).toLocaleDateString()}</span>}
                </div>
                
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Accordion Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-xs" onMouseDown={(event) => { if (event.target === event.currentTarget) closeForm(); }}>
          <section role="dialog" aria-modal="true" className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3.5 dark:border-gray-800 sm:px-5">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.07em] text-blue-600 dark:text-blue-400">
                  {editingId ? "Update Configuration" : "New Registration"}
                </span>
                <h2 className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white">
                  {editingId ? "Edit MikroTik Device" : "Register MikroTik Device"}
                </h2>
              </div>
              <button type="button" onClick={closeForm} disabled={saving} aria-label="Close form" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-800">
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="min-h-0 flex-1 overflow-y-auto">
              <div className="divide-y divide-slate-100 dark:divide-gray-800">
                {/* 1. Identity Section */}
                <div>
                  <SectionRow
                    title="1. Network Device Identity"
                    description={form.identity_name ? `Name: ${form.identity_name}` : "Name and management IP address"}
                    open={formSection === "identity"}
                    complete={Boolean(form.identity_name.trim() && form.api_ip.trim())}
                    onClick={() => toggleFormSection("identity")}
                    icon={<GlobeAltIcon className="h-3.5 w-3.5" />}
                  />
                  {formSection === "identity" && (
                    <div className="space-y-3.5 px-4 pb-4 pt-1 sm:px-5">
                      <Field label="Identity Name" value={form.identity_name} onChange={(value) => setField("identity_name", value)} placeholder="e.g. EMBU-CORE-01" required />
                      <Field label="API / Management IP" value={form.api_ip} onChange={(value) => setField("api_ip", value)} placeholder="e.g. 192.168.100.103" hint="Enter the router's reachable management address." required />
                      <Field label="Serial Number" value={form.serial_number} onChange={(value) => setField("serial_number", value)} placeholder="e.g. A1B2C3D4" optional />
                    </div>
                  )}
                </div>

                {/* 2. Hardware & Location Section */}
                <div>
                  <SectionRow
                    title="2. Hardware & Location Details"
                    description={form.Model ? `Model: ${form.Model}` : "Model, version, site, and coordinates"}
                    open={formSection === "hardware"}
                    complete={Boolean(form.Model.trim() || form.site_name.trim())}
                    onClick={() => toggleFormSection("hardware")}
                    icon={<MapPinIcon className="h-3.5 w-3.5" />}
                  />
                  {formSection === "hardware" && (
                    <div className="space-y-3.5 px-4 pb-4 pt-1 sm:px-5">
                      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                        <Field label="Device Model" value={form.Model} onChange={(value) => setField("Model", value)} placeholder="e.g. RB5009UG+S+" optional />
                        <Field label="RouterOS Version" value={form.OSversion} onChange={(value) => setField("OSversion", value)} placeholder="e.g. 7.16.2" optional />
                        <Field label="Site Name" value={form.site_name} onChange={(value) => setField("site_name", value)} placeholder="e.g. Embu Main POP" optional />
                        <Field label="Region / County" value={form.region} onChange={(value) => setField("region", value)} placeholder="e.g. Embu" optional />
                        <Field label="Latitude" type="number" value={form.latitude} onChange={(value) => setField("latitude", value)} placeholder="-0.5390" min="-90" max="90" step="any" optional hint="Range: −90 to 90." />
                        <Field label="Longitude" type="number" value={form.longitude} onChange={(value) => setField("longitude", value)} placeholder="37.4575" min="-180" max="180" step="any" optional hint="Range: −180 to 180." />
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Review Section */}
                <div>
                  <SectionRow
                    title="3. Review & Summary"
                    description="Confirm details before saving"
                    open={formSection === "review"}
                    complete={true}
                    onClick={() => toggleFormSection("review")}
                    icon={<CheckCircleIcon className="h-3.5 w-3.5" />}
                  />
                  {formSection === "review" && (
                    <div className="space-y-3.5 px-4 pb-4 pt-1 sm:px-5">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {([
                          ["Identity Name", form.identity_name],
                          ["API / Management IP", form.api_ip],
                          ["Serial Number", form.serial_number],
                          ["Model", form.Model],
                          ["RouterOS Version", form.OSversion],
                          ["Site Name", form.site_name],
                          ["Region", form.region],
                          ["Latitude", form.latitude],
                          ["Longitude", form.longitude],
                        ] as [string, string][]).map(([label, value]) => (
                          <div key={label} className="min-w-0 rounded-lg border border-slate-200 p-2.5 dark:border-gray-700">
                            <p className="text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400">{label}</p>
                            <p className="mt-0.5 break-words text-xs font-medium text-slate-900 dark:text-white">{value.trim() || "Not provided"}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/50 px-4 py-3.5 dark:border-gray-800 dark:bg-gray-900">
                <button type="button" onClick={closeForm} disabled={saving} className="h-9 px-3.5 border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-medium hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving || !form.identity_name.trim() || !form.api_ip.trim()} className="h-9 bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-sm">
                  {saving ? <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" /> : <CheckCircleIcon className="h-3.5 w-3.5" />}
                  {saving ? "Saving…" : editingId ? "Save Changes" : "Register Device"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}