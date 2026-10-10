import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

export default function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[10px] font-bold uppercase ${
        active
          ? "border-emerald-200 bg-emerald-100/60 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
          : "border-gray-200 bg-gray-100/60 text-gray-500 dark:border-gray-700 dark:bg-gray-700/30 dark:text-gray-400"
      }`}
    >
      {active ? (
        <>
          <CheckCircleIcon className="h-3.5 w-3.5" /> Active
        </>
      ) : (
        <>
          <XCircleIcon className="h-3.5 w-3.5" /> Disabled
        </>
      )}
    </span>
  );
}
