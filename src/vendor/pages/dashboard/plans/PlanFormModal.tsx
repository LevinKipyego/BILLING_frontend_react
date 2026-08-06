import { XMarkIcon } from "@heroicons/react/24/outline";
import type { TimeUnit } from "./types/plan";
import type { MikrotikDevice } from "../../../types/device";

interface PlanFormModalProps {
  showForm: boolean;
  editingId: number | null;
  form: {
    name: string;
    price: string;
    rate_limit: string;
    mikrotik: string;
    service_type: string;
  };
  durationInput: string;
  timeUnit: TimeUnit;
  mikrotiks: MikrotikDevice[];
  loading: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  setForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      price: string;
      rate_limit: string;
      mikrotik: string;
      service_type: string;
    }>
  >;
  setDurationInput: (val: string) => void;
  setTimeUnit: (unit: TimeUnit) => void;
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
  if (!showForm) return null;

  const inputClass =
    "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-800 dark:text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  const labelClass =
    "mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-3 md:p-6">
      <div className="flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-800">

        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {editingId ? "Edit Package" : "Create Package"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Configure pricing, duration and router settings.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={onSubmit}
          className="flex-1 overflow-y-auto px-6 py-6 space-y-6"
        >
          {/* Name */}
          <div>
            <label className={labelClass}>Package Name</label>
            <input
              required
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="24 Hours Unlimited"
              className={inputClass}
            />
          </div>

          {/* Price + Service */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>Price (KES)</label>
              <input
                type="number"
                required
                value={form.price}
                placeholder="50"
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Service Type</label>
              <select
                value={form.service_type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    service_type: e.target.value,
                  })
                }
                className={inputClass}
              >
                <option value="HOTSPOT">Hotspot</option>
                <option value="PPPOE">PPPoE</option>
                <option value="IPOE">IPoE</option>
              </select>
            </div>
          </div>

          {/* Duration */}
          <div className="grid gap-5 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className={labelClass}>Duration</label>
              <input
                type="number"
                required
                value={durationInput}
                placeholder="1"
                onChange={(e) =>
                  setDurationInput(e.target.value)
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Unit</label>
              <select
                value={timeUnit}
                onChange={(e) =>
                  setTimeUnit(e.target.value as TimeUnit)
                }
                className={inputClass}
              >
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>
          </div>

          {/* Rate Limit */}
          <div>
            <label className={labelClass}>Rate Limit</label>
            <input
              value={form.rate_limit}
              placeholder="5M/5M"
              onChange={(e) =>
                setForm({
                  ...form,
                  rate_limit: e.target.value,
                })
              }
              className={inputClass}
            />
          </div>

          {/* Router */}
          <div>
            <label className={labelClass}>Target Router</label>
            <select
              value={form.mikrotik}
              onChange={(e) =>
                setForm({
                  ...form,
                  mikrotik: e.target.value,
                })
              }
              className={inputClass}
            >
              <option value="">Global / All Routers</option>

              {mikrotiks.map((router) => (
                <option key={router.id} value={router.id}>
                  {router.identity_name || router.api_ip}
                </option>
              ))}
            </select>
          </div>
        </form>

        {/* Footer */}
        <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            onClick={onSubmit}
            disabled={loading}
            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Update Package"
              : "Create Package"}
          </button>
        </div>
      </div>
    </div>
  );
}