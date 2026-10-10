import {
  ClockIcon,
  CheckCircleIcon,
  UserCircleIcon,
  WifiIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import type { HotspotSubscription } from "../../../../types/subscriptions";
import StatusBadge from "./StatusBadge";
import { formatDateTime } from "../utils";

interface Props {
  items: HotspotSubscription[];
  onEdit: (item: HotspotSubscription) => void;
}

export default function SubscriptionList({ items, onEdit }: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-[24px] border border-dashed border-gray-300 bg-white px-6 py-14 text-center dark:border-gray-700 dark:bg-gray-800/50">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          <WifiIcon className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-sm font-bold text-gray-900 dark:text-white">
          No subscriptions found
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Try changing your search or status filter.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800/50 lg:block">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50/70 dark:border-gray-700 dark:bg-gray-800">
            <tr className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
              <th className="p-5">Subscriber info</th>
              <th className="p-5">Assigned plan</th>
              <th className="p-5">Timeline (start → end)</th>
              <th className="p-5">State</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((item) => {
              const start = formatDateTime(item.start_at);
              const end = formatDateTime(item.end_at);
              return (
                <tr
                  key={item.id}
                  className="group transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-blue-100 p-2 text-blue-600 dark:bg-blue-500/10">
                        <UserCircleIcon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {item.user_name || `User #${item.user}`}
                        </p>
                        <p className="mt-0.5 break-all text-[11px] font-medium uppercase tracking-tight text-gray-500 dark:text-gray-400">
                          Credential: {item.credential_password || "—"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <WifiIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                        {item.plan_name || `Plan #${item.plan}`}
                      </span>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-6">
                      <DateCell label="START" value={start} start />
                      <DateCell label="END" value={end} />
                    </div>
                  </td>
                  <td className="p-5">
                    <StatusBadge active={item.active} />
                  </td>
                  <td className="p-5 text-right">
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
                      title="Manage subscription"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Refined Mobile Subscription Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
        {items.map((item) => {
          const start = formatDateTime(item.start_at);
          const end = formatDateTime(item.end_at);

          return (
            <article
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500/30"
            >
              {/* Subscriber Header */}
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600 dark:from-blue-500/15 dark:to-indigo-500/10 dark:text-blue-400">
                    <UserCircleIcon className="h-6 w-6" />
                  </div>

                  <div className="min-w-0 flex-1 pt-0.5">
                    <h3 className="truncate text-sm font-bold text-gray-900 dark:text-white">
                      {item.user_name || `User #${item.user}`}
                    </h3>

                    <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                      Credential:{" "}
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {item.credential_password || "—"}
                      </span>
                    </p>
                  </div>

                  <StatusBadge active={item.active} />
                </div>

                {/* Assigned Plan */}
                <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-blue-100/80 bg-blue-50/60 px-3.5 py-3 dark:border-blue-500/15 dark:bg-blue-500/5">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm dark:bg-gray-800 dark:text-blue-400">
                      <WifiIcon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Assigned plan
                      </p>
                      <p className="mt-0.5 truncate text-sm font-bold text-gray-900 dark:text-white">
                        {item.plan_name || `Plan #${item.plan}`}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-lg bg-white px-2 py-1 text-[10px] font-bold text-blue-600 dark:bg-gray-800 dark:text-blue-400">
                    #{item.plan}
                  </span>
                </div>

                {/* Subscription Timeline */}
                <div className="mt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Validity period
                    </p>
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="min-w-0">
                      <div className="mb-2 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                          Starts
                        </span>
                      </div>

                      <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                        {start.date}
                      </p>
                      <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                        {start.time}
                      </p>
                    </div>

                    <div className="min-w-0 border-l border-gray-100 pl-3 dark:border-gray-700">
                      <div className="mb-2 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                        <span className="text-[10px] font-bold uppercase tracking-wide text-rose-700 dark:text-rose-400">
                          Expires
                        </span>
                      </div>

                      <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                        {end.date}
                      </p>
                      <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                        {end.time}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtle Action Footer */}
              <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/70 px-4 py-3 dark:border-gray-700 dark:bg-gray-900/30">
                <span className="text-[10px] font-medium text-gray-400">
                  Subscription #{item.id}
                </span>

                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-100/70 active:scale-[0.98] dark:text-blue-400 dark:hover:bg-blue-500/10"
                >
                  <PencilSquareIcon className="h-4 w-4" />
                  Manage
                  <span aria-hidden="true" className="ml-0.5 transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </button>
              </div>
            </article>
          );
        })}
      </div>

    </>
  );
}

function DateCell({
  label,
  value,
  start = false,
}: {
  label: string;
  value: { date: string; time: string };
  start?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span
        className={`mb-1 flex items-center gap-1 text-[10px] font-bold ${
          start
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-rose-600 dark:text-rose-400"
        }`}
      >
        {start ? <CheckCircleIcon className="h-3 w-3" /> : <ClockIcon className="h-3 w-3" />}
        {label}
      </span>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{value.date}</span>
      <span className="text-[10px] text-gray-400">{value.time}</span>
    </div>
  );
}