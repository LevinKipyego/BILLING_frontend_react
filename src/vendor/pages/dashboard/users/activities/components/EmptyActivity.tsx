import { Clock3 } from "lucide-react";

export default function EmptyActivity() {
    return (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-12 text-center">
            <Clock3
                size={32}
                className="mx-auto text-slate-400 dark:text-slate-500 sm:w-10 sm:h-10"
            />

            <h3 className="mt-3 text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                No Activity
            </h3>

            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                No customer activity has been recorded yet.
            </p>
        </div>
    );
}
