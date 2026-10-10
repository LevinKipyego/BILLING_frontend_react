
import {
  PencilSquareIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  CodeBracketIcon,
  StarIcon,
  ClockIcon,
  SignalIcon,
  CurrencyDollarIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

import type { Plan } from "./types/plan";
import { formatDuration } from "../CustomerEntryPage/renewsubscriptions/utils/date";

interface PlanListProps {
  plans: Plan[];
  onEdit: (plan: Plan) => void;
  onDelete: (id: number) => void;
  formatDurationReadable: (mins: number) => string;
  onExportTxt?: () => void;
  onExportRsc?: () => void;
}

const surface =
  "border border-slate-200/80 bg-white dark:border-slate-700/80 dark:bg-gray-800";

const mutedText = "text-slate-500 dark:text-slate-400";

function formatPrice(price: string | number) {
  const value = Number(price);
  return Number.isFinite(value)
    ? value.toLocaleString("en-KE", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
    : String(price);
}

function ServiceBadge({ service }: { service?: string }) {
  const value = service || "HOTSPOT";

  return (
    <span className="inline-flex max-w-full items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
      {value}
    </span>
  );
}

function FeaturedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
      <StarIcon className="h-3 w-3" />
      Featured
    </span>
  );
}

function EmptyState() {
  return (
    <div className={`${surface} rounded-2xl px-5 py-12 text-center shadow-sm`}>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
        <Squares2X2Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
        No packages yet
      </h3>
      <p className={`mx-auto mt-1 max-w-sm text-xs leading-5 ${mutedText}`}>
        Your packages will appear here once you create your first plan.
      </p>
    </div>
  );
}

export default function PlanList({
  plans,
  onEdit,
  onDelete,
  formatDurationReadable,
  onExportTxt,
  onExportRsc,
}: PlanListProps) {
  return (
    <div className="min-w-0 space-y-4 text-slate-900 dark:text-slate-100">
      {/* Action bar */}
      <div className={`${surface} flex flex-col gap-3 rounded-2xl p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4`}>
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Service packages
          </h2>
          <p className={`mt-0.5 text-xs ${mutedText}`}>
            {plans.length} {plans.length === 1 ? "package" : "packages"} configured
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
          {onExportTxt && (
            <button
              type="button"
              onClick={onExportTxt}
              disabled={!plans.length}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10 sm:px-4"
            >
              <DocumentArrowDownIcon className="h-4 w-4 shrink-0" />
              <span>Export TXT</span>
            </button>
          )}

          {onExportRsc && (
            <button
              type="button"
              onClick={onExportRsc}
              disabled={!plans.length}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
            >
              <CodeBracketIcon className="h-4 w-4 shrink-0" />
              <span>Export RSC</span>
            </button>
          )}
        </div>
      </div>

      {!plans.length ? (
        <EmptyState />
      ) : (
        <>
          {/* Mobile cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:hidden">
            {plans.map((plan) => (
              <article
                key={plan.id}
                className={`${surface} flex min-w-0 flex-col rounded-2xl p-3.5 shadow-sm transition hover:border-blue-200 dark:hover:border-blue-500/30`}
              >
                {/* Card heading */}
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
                    <SignalIcon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="break-words text-sm font-bold leading-5 text-slate-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <ServiceBadge service={plan.service_type} />
                      {plan.is_featured && <FeaturedBadge />}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/70 p-3 dark:border-blue-500/15 dark:bg-blue-500/5">
                  <p className={`text-[10px] font-medium uppercase tracking-wider ${mutedText}`}>
                    Package price
                  </p>
                  <p className="mt-1 flex flex-wrap items-baseline gap-1 text-xl font-bold tracking-tight text-blue-700 dark:text-blue-300">
                    <span className="text-xs font-semibold">KES</span>
                    {formatPrice(plan.price)}
                  </p>
                </div>

                {/* Package attributes */}
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-900/60">
                    <div className={`flex items-center gap-1.5 text-[10px] ${mutedText}`}>
                      <ClockIcon className="h-3.5 w-3.5 shrink-0" />
                      Duration
                    </div>
                    <p className="mt-1 break-words text-xs font-semibold text-slate-800 dark:text-slate-100">
                      {formatDuration(plan.duration_minutes)}
                    </p>
                  </div>

                  <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-900/60">
                    <div className={`flex items-center gap-1.5 text-[10px] ${mutedText}`}>
                      <CurrencyDollarIcon className="h-3.5 w-3.5 shrink-0" />
                      Speed
                    </div>
                    <p className="mt-1 break-words text-xs font-semibold text-slate-800 dark:text-slate-100">
                      {plan.rate_limit || "Unlimited"}
                    </p>
                  </div>
                </div>

                {/* HTML status */}
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className={`text-[11px] ${mutedText}`}>
                    HTML template
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-700 dark:text-blue-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    Ready
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => onEdit(plan)}
                    className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(plan.id)}
                    className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-4 focus:ring-red-500/10 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Desktop/tablet table */}
          <div className={`${surface} hidden overflow-hidden rounded-2xl shadow-sm md:block`}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                    <th className="px-5 py-4 text-left font-semibold">Package</th>
                    <th className="px-4 py-4 text-center font-semibold">Service</th>
                    <th className="px-4 py-4 text-right font-semibold">Price</th>
                    <th className="px-4 py-4 text-center font-semibold">Duration</th>
                    <th className="px-4 py-4 text-center font-semibold">Speed</th>
                    <th className="px-4 py-4 text-center font-semibold">HTML</th>
                    <th className="px-5 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {plans.map((plan) => (
                    <tr
                      key={plan.id}
                      className="border-b border-slate-100 last:border-b-0 transition hover:bg-blue-50/40 dark:border-slate-700/70 dark:hover:bg-blue-500/5"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                            <SignalIcon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 dark:text-white">
                              {plan.name}
                            </p>
                            {plan.is_featured && (
                              <div className="mt-1">
                                <FeaturedBadge />
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <ServiceBadge service={plan.service_type} />
                      </td>

                      <td className="px-4 py-4 text-right font-semibold tabular-nums">
                        <span className="text-xs text-slate-500">KES </span>
                        {formatPrice(plan.price)}
                      </td>

                      <td className="px-4 py-4 text-center text-slate-600 dark:text-slate-300">
                        {formatDurationReadable(plan.duration_minutes)}
                      </td>

                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300">
                          {plan.rate_limit || "Unlimited"}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                          Ready
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onEdit(plan)}
                            title={`Edit ${plan.name}`}
                            aria-label={`Edit ${plan.name}`}
                            className="rounded-xl border border-slate-200 p-2 text-blue-600 transition hover:border-blue-200 hover:bg-blue-50 dark:border-slate-600 dark:text-blue-400 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10"
                          >
                            <PencilSquareIcon className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onDelete(plan.id)}
                            title={`Delete ${plan.name}`}
                            aria-label={`Delete ${plan.name}`}
                            className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-600 dark:text-slate-400 dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
