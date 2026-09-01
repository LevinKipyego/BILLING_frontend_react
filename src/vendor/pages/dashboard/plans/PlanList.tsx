import {
  PencilSquareIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";
import type { Plan } from "./types/plan";

interface PlanListProps {
  plans: Plan[];
  onEdit: (plan: Plan) => void;
  onDelete: (id: number) => void;
  formatDurationReadable: (mins: number) => string;

  // optional
  onExportTxt?: () => void;
  onExportRsc?: () => void;
}
import { formatDuration } from  "../CustomerEntryPage/renewsubscriptions/utils/date";


export default function PlanList({
  plans,
  onEdit,
  onDelete,
  formatDurationReadable,
  onExportTxt,
  onExportRsc,
}: PlanListProps) {
  return (
    <div className="space-y-4">
      {/* ========================================================= */}
      {/* Action Bar */}
      {/* ========================================================= */}

      <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
        <button
          onClick={onExportTxt}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-gray-700 transition"
        >
          <DocumentArrowDownIcon className="w-5 h-5" />
          Export TXT
        </button>

        <button
          onClick={onExportRsc}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition"
        >
          <CodeBracketIcon className="w-5 h-5" />
          Export RSC
        </button>
      </div>

      {/* ========================================================= */}
      {/* MOBILE */}
      {/* ========================================================= */}

      <div className="md:hidden space-y-3">
        {plans.map((p) => (
          <div
            key={p.id}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800 p-4 shadow-sm"
          >
            {/* Header */}

            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white">
                  {p.name}
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  HTML Ready ✓
                </p>
              </div>

              <span className="rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-[10px] font-bold uppercase text-blue-700 dark:text-blue-300">
                {p.service_type || "HOTSPOT"}
              </span>
            </div>

            {/* Details */}

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-500 text-xs">Price</p>

                <p className="font-semibold">
                  KES {p.price}
                </p>
              </div>

              <div>
                <p className="text-slate-500 text-xs">Duration</p>

                <p className="font-semibold">
                  {formatDuration(p.duration_minutes)}
                </p>
              </div>

              <div className="col-span-2">
                <p className="text-slate-500 text-xs">
                  Speed
                </p>

                <span className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-700 px-3 py-1 text-xs font-semibold">
                  {p.rate_limit || "Unlimited"}
                </span>
              </div>
            </div>

            {/* Buttons */}

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => onEdit(p)}
                className="flex-1 rounded-lg bg-blue-600 text-white py-2.5 flex items-center justify-center gap-2 font-medium hover:bg-blue-700 transition"
              >
                <PencilSquareIcon className="w-5 h-5" />
                Edit
              </button>

              <button
                onClick={() => onDelete(p.id)}
                className="flex-1 rounded-lg border border-red-300 text-red-600 py-2.5 flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                <TrashIcon className="w-5 h-5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================= */}
      {/* DESKTOP */}
      {/* ========================================================= */}

      <div className="hidden md:block overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-gray-900">
            <tr className="text-xs uppercase tracking-wider text-slate-500">
              <th className="px-6 py-4 text-left">Plan</th>
              <th className="text-center">Service</th>
              <th className="text-center">Price</th>
              <th className="text-center">Duration</th>
              <th className="text-center">Speed</th>
              <th className="text-center">HTML</th>
              <th className="px-6 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {plans.map((p) => (
              <tr
                key={p.id}
                className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition"
              >
                <td className="px-6 py-4 font-semibold">
                  {p.name}
                </td>

                <td className="text-center">
                  <span className="rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-semibold">
                    {p.service_type || "HOTSPOT"}
                  </span>
                </td>

                <td className="text-center font-medium">
                  KES {p.price}
                </td>

                <td className="text-center">
                  {formatDurationReadable(
                    p.duration_minutes
                  )}
                </td>

                <td className="text-center">
                  {p.rate_limit || "Unlimited"}
                </td>

                <td className="text-center">
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Ready
                  </span>
                </td>

                <td className="px-6">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(p)}
                      className="rounded-lg p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                    >
                      <PencilSquareIcon className="w-5 h-5 text-blue-600" />
                    </button>

                    <button
                      onClick={() => onDelete(p.id)}
                      className="rounded-lg p-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                    >
                      <TrashIcon className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}