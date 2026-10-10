
import { useId } from "react";
import {
  XMarkIcon,
  StarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  SignalIcon,
  ServerStackIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

import type { TimeUnit } from "./types/plan";
import type { MikrotikDevice } from "../../../types/device";

interface PlanFormValues {
  name: string;
  price: string;
  rate_limit: string;
  mikrotik: string;
  service_type: string;
  is_featured: boolean;
}


interface PlanFormModalProps {
  showForm: boolean;
  editingId: number | null;
  form: PlanFormValues;
  durationInput: string;
  timeUnit: TimeUnit;
  mikrotiks: MikrotikDevice[];
  loading: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  setForm: React.Dispatch<React.SetStateAction<PlanFormValues>>;
  setDurationInput: (val: string) => void;
  setTimeUnit: (unit: TimeUnit) => void;
}

const RATE_LIMIT_OPTIONS = [
  { value: "512k/512k", label: "512 Kbps", description: "Basic browsing" },
  { value: "1M/1M", label: "1 Mbps", description: "Light usage" },
  { value: "2M/2M", label: "2 Mbps", description: "Everyday browsing" },
  { value: "3M/3M", label: "3 Mbps", description: "Standard usage" },
  { value: "5M/5M", label: "5 Mbps", description: "HD streaming" },
  { value: "10M/10M", label: "10 Mbps", description: "Heavy usage" },
  { value: "20M/20M", label: "20 Mbps", description: "High-speed access" },
  { value: "50M/50M", label: "50 Mbps", description: "Premium access" },
  { value: "100M/100M", label: "100 Mbps", description: "Ultra-fast access" },
  { value: "unlimited", label: "Unlimited", description: "No rate limit" },
] as const;

const inputClass =
  "w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-blue-700";

const labelClass =
  "mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300";

const surfaceClass =
  "overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-700/80 dark:bg-slate-900/40";

function RequiredMark() {
  return (
    <span className="ml-1 font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">
      *
    </span>
  );
}

function OptionalMark() {
  return (
    <span className="ml-1.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">
      Optional
    </span>
  );
}

interface SectionProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function AccordionSection({
  icon: Icon,
  title,
  description,
  defaultOpen = false,
  children,
}: SectionProps) {
  return (
    <details
      className={`${surfaceClass} group`}
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/60 sm:px-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
          <Icon className="h-5 w-5" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-slate-900 dark:text-white">
            {title}
          </span>
          <span className="mt-0.5 block text-xs leading-5 text-slate-500 dark:text-slate-400">
            {description}
          </span>
        </span>

        <ChevronDownIcon className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
      </summary>

      <div className="border-t border-slate-100 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-900/30 sm:p-5">
        {children}
      </div>
    </details>
  );
}

export default function PlanFormModal({
  showForm,
  editingId,
  form,
  durationInput,
  timeUnit,
  mikrotiks,
  loading,
  onClose,
  onSubmit,
  setForm,
  setDurationInput,
  setTimeUnit,
}: PlanFormModalProps) {
  const generatedId = useId();
  const formId = `plan-form-${generatedId}`;

  if (!showForm) return null;

  const updateForm = <K extends keyof PlanFormValues>(
    key: K,
    value: PlanFormValues[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const selectedRate = RATE_LIMIT_OPTIONS.find(
    (option) => option.value === form.rate_limit,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${formId}-title`}
        className="flex max-h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 dark:border-slate-700 dark:bg-slate-800 sm:rounded-3xl"
      >
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 px-4 py-4 dark:border-slate-700 sm:px-6 sm:py-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <SignalIcon className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h2
                id={`${formId}-title`}
                className="text-base font-bold text-slate-900 dark:text-white sm:text-lg"
              >
                {editingId ? "Edit package" : "Create package"}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Configure your package and network access settings.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close package form"
            className="shrink-0 rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </header>

        {/* Scrollable form */}
        <form
          id={formId}
          onSubmit={onSubmit}
          className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-4 sm:space-y-4 sm:p-5"
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span>
              <RequiredMark /> Required field
            </span>
            <span>Optional fields can be left blank or disabled.</span>
          </div>

          {/* Package details */}
          <AccordionSection
            icon={CurrencyDollarIcon}
            title="Package details"
            description="Name, pricing, service type and visibility"
            defaultOpen
          >
            <div className="space-y-4">
              <div>
                <label htmlFor={`${formId}-name`} className={labelClass}>
                  Package name <RequiredMark />
                </label>
                <input
                  id={`${formId}-name`}
                  required
                  maxLength={100}
                  autoFocus
                  value={form.name}
                  onChange={(event) => updateForm("name", event.target.value)}
                  placeholder="e.g. Home Unlimited"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${formId}-price`} className={labelClass}>
                    Price (KES) <RequiredMark />
                  </label>
                  <input
                    id={`${formId}-price`}
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={form.price}
                    onChange={(event) => updateForm("price", event.target.value)}
                    placeholder="50.00"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor={`${formId}-service`} className={labelClass}>
                    Service type <RequiredMark />
                  </label>
                  <select
                    id={`${formId}-service`}
                    required
                    value={form.service_type}
                    onChange={(event) =>
                      updateForm("service_type", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="HOTSPOT">Hotspot</option>
                    <option value="PPPOE">PPPoE</option>
                    <option value="IPOE">IPoE</option>
                  </select>
                </div>
              </div>

              {/* Featured package: blue surface */}
              <div className="flex items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 dark:border-blue-500/20 dark:bg-blue-500/5">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
                    <StarIcon className="h-4 w-4" />
                  </div>

                  <div>
                    <label
                      htmlFor={`${formId}-featured`}
                      className="block cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-100"
                    >
                      Featured package
                      <OptionalMark />
                    </label>
                    <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Highlight this package in customer-facing plans.
                    </p>
                  </div>
                </div>

                <button
                  id={`${formId}-featured`}
                  type="button"
                  role="switch"
                  aria-checked={form.is_featured}
                  aria-label="Featured package"
                  onClick={() => updateForm("is_featured", !form.is_featured)}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                    form.is_featured
                      ? "bg-blue-600"
                      : "bg-slate-300 dark:bg-slate-600"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                      form.is_featured
                        ? "translate-x-[22px]"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </AccordionSection>

          {/* Access duration */}
          <AccordionSection
            icon={ClockIcon}
            title="Access duration"
            description="Set how long a customer can use the package"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label htmlFor={`${formId}-duration`} className={labelClass}>
                  Duration value <RequiredMark />
                </label>
                <input
                  id={`${formId}-duration`}
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={durationInput}
                  onChange={(event) => setDurationInput(event.target.value)}
                  placeholder="1"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor={`${formId}-unit`} className={labelClass}>
                  Time unit <RequiredMark />
                </label>
                <select
                  id={`${formId}-unit`}
                  required
                  value={timeUnit}
                  onChange={(event) =>
                    setTimeUnit(event.target.value as TimeUnit)
                  }
                  className={inputClass}
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
          </AccordionSection>

          {/* Network configuration */}
          <AccordionSection
            icon={ServerStackIcon}
            title="Network configuration"
            description="Choose speed limits and router assignment"
          >
            <div className="space-y-4">
              <div>
                <label htmlFor={`${formId}-rate`} className={labelClass}>
                  Rate limit <RequiredMark />
                </label>
                <select
                  id={`${formId}-rate`}
                  required
                  value={form.rate_limit}
                  onChange={(event) =>
                    updateForm("rate_limit", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select a speed profile
                  </option>

                  {RATE_LIMIT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} — {option.description}
                    </option>
                  ))}
                </select>

                <p className="mt-1.5 text-[11px] leading-4 text-slate-500 dark:text-slate-400">
                  {selectedRate
                    ? selectedRate.value === "unlimited"
                      ? "No speed cap will be applied by this package."
                      : `Selected profile: ${selectedRate.value}.`
                    : "Choose the upload and download speed profile."}
                </p>
              </div>

              <div>
                <label htmlFor={`${formId}-router`} className={labelClass}>
                  Target router
                  <OptionalMark />
                </label>
                <select
                  id={`${formId}-router`}
                  value={form.mikrotik}
                  onChange={(event) => updateForm("mikrotik", event.target.value)}
                  className={inputClass}
                >
                  <option value="">Global / All routers</option>

                  {mikrotiks.map((router) => (
                    <option key={router.id} value={String(router.id)}>
                      {router.identity_name || router.api_ip}
                    </option>
                  ))}
                </select>

                <p className="mt-1.5 text-[11px] leading-4 text-slate-500 dark:text-slate-400">
                  Select a specific router or use your backend's global
                  package behavior.
                </p>
              </div>
            </div>
          </AccordionSection>
        </form>

        {/* Sticky footer */}
        <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800 sm:flex-row sm:justify-end sm:px-6 sm:py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            form={formId}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {loading
              ? "Saving package..."
              : editingId
                ? "Update package"
                : "Create package"}
          </button>
        </footer>
      </section>
    </div>
  );
}
