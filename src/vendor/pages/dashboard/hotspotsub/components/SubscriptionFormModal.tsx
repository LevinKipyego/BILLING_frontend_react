
import { useMemo } from "react";
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  WifiIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

type SubscriptionFormModalProps = {
  open: boolean;
  editingId: string | number | null;
  form: {
    plan: string | number;
    start_at: string;
    end_at: string;
    active: boolean;
    [key: string]: any;
  };
  plans: Array<{
    id: string | number;
    name: string;
    [key: string]: any;
  }>;
  saving: boolean;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function SubscriptionFormModal({
  open,
  editingId,
  form,
  plans,
  saving,
  onChange,
  onSubmit,
  onClose,
}: SubscriptionFormModalProps) {
  const selectedPlan = useMemo(
    () => plans.find((plan) => String(plan.id) === String(form.plan)),
    [plans, form.plan]
  );

  if (!open) return null;

  const inputClass =
    "block w-full min-w-0 rounded-xl border border-gray-300 bg-white px-3.5 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400";

  const labelClass =
    "mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200";

  const startIsValid =
    !form.start_at ||
    !form.end_at ||
    new Date(form.end_at) >= new Date(form.start_at);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="subscription-modal-title"
        className="flex max-h-[94dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800 sm:max-h-[90vh] sm:rounded-3xl"
      >
        {/* Header */}
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 px-5 py-5 dark:border-gray-700 sm:px-7 sm:py-6">
          <div className="flex min-w-0 items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <WifiIcon className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
                  Hotspot Management
                </span>

                {editingId && (
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                    Editing
                  </span>
                )}
              </div>

              <h2
                id="subscription-modal-title"
                className="text-xl font-bold tracking-tight text-gray-900 dark:text-white"
              >
                {editingId ? "Edit subscription" : "Create subscription"}
              </h2>

              <p className="mt-1 text-sm leading-5 text-gray-500 dark:text-gray-300">
                Configure the subscriber's plan, validity period and access.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close modal"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </header>

        {/* Form */}
        <form
          id="subscription-form"
          onSubmit={onSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 space-y-7 overflow-y-auto px-5 py-6 sm:px-7">
            {/* Plan assignment */}
            <section>
              <div className="mb-4 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <WifiIcon className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Plan assignment
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-300">
                    Choose the package for this subscriber.
                  </p>
                </div>
              </div>

              <label htmlFor="subscription-plan" className={labelClass}>
                Subscription plan <span className="text-rose-500">*</span>
              </label>

              <select
                id="subscription-plan"
                name="plan"
                value={form.plan}
                onChange={onChange}
                required
                className={inputClass}
              >
                <option value="">Select a plan</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>

              {selectedPlan ? (
                <div className="mt-3 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-3.5 dark:border-blue-800 dark:bg-blue-900/20">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-blue-400">
                    <CheckCircleIcon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {selectedPlan.name}
                    </p>
                    <p className="mt-0.5 text-xs leading-5 text-gray-500 dark:text-gray-300">
                      This plan will be assigned to the subscription.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-300">
                  Select a plan to continue.
                </p>
              )}
            </section>

            <div className="border-t border-gray-100 dark:border-gray-700" />

            {/* Validity period */}
            <section>
              <div className="mb-4 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                  <CalendarDaysIcon className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Validity period
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-300">
                    Set when the subscription starts and expires.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="subscription-start" className={labelClass}>
                    Start date and time{" "}
                    <span className="text-rose-500">*</span>
                  </label>

                  <div className="relative">
                    <CalendarDaysIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      id="subscription-start"
                      type="datetime-local"
                      name="start_at"
                      value={form.start_at}
                      onChange={onChange}
                      max={form.end_at || undefined}
                      required
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subscription-end" className={labelClass}>
                    Expiry date and time{" "}
                    <span className="text-rose-500">*</span>
                  </label>

                  <div className="relative">
                    <ClockIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      id="subscription-end"
                      type="datetime-local"
                      name="end_at"
                      value={form.end_at}
                      onChange={onChange}
                      min={form.start_at || undefined}
                      required
                      className={`${inputClass} pl-10`}
                    />
                  </div>

                  {!startIsValid && (
                    <p className="mt-2 text-xs font-medium text-rose-600 dark:text-rose-400">
                      The expiry date must be on or after the start date.
                    </p>
                  )}
                </div>
              </div>
            </section>

            <div className="border-t border-gray-100 dark:border-gray-700" />

            {/* Access status */}
            <section>
              <div className="mb-4 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <ShieldCheckIcon className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Access status
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-300">
                    Control whether this subscription is enabled.
                  </p>
                </div>
              </div>

              <label
                htmlFor="subscription-active"
                className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4 transition ${
                  form.active
                    ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-900/20"
                    : "border-gray-200 bg-gray-50/70 dark:border-gray-700 dark:bg-gray-900/30"
                }`}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      form.active
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                        : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <ShieldCheckIcon className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {form.active
                        ? "Subscription active"
                        : "Subscription inactive"}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-300">
                      {form.active
                        ? "The subscription is marked as enabled."
                        : "The subscription is marked as disabled."}
                    </p>
                  </div>
                </div>

                <span className="relative inline-flex shrink-0 items-center">
                  <input
                    id="subscription-active"
                    type="checkbox"
                    name="active"
                    checked={Boolean(form.active)}
                    onChange={onChange}
                    className="peer sr-only"
                  />
                  <span className="h-6 w-11 rounded-full bg-gray-300 transition peer-checked:bg-emerald-500 peer-focus-visible:ring-4 peer-focus-visible:ring-emerald-500/20 dark:bg-gray-600" />
                  <span className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
                </span>
              </label>
            </section>
          </div>

          {/* Footer */}
          <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-gray-100 bg-white px-5 py-4 dark:border-gray-700 dark:bg-gray-800 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <p className="hidden text-xs text-gray-500 dark:text-gray-300 sm:block">
              <span className="text-rose-500">*</span> Required fields
            </p>

            <div className="flex w-full gap-3 sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="min-h-11 flex-1 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 sm:flex-none"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving || !startIsValid}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-40 sm:flex-none"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4" />
                    {editingId ? "Save changes" : "Create subscription"}
                  </>
                )}
              </button>
            </div>
          </footer>
        </form>
      </section>
    </div>
  );
}
