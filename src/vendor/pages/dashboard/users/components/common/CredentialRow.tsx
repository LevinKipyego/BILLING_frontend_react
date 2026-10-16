import type { ReactNode } from "react";

interface Props {
    label: string;
    value?: ReactNode;
    action?: ReactNode;
}

export default function CredentialRow({
    label,
    value,
    action,
}: Props) {
    return (
        <div className="flex items-center justify-between gap-2 py-2 sm:py-3 border-b border-slate-200 dark:border-slate-800 last:border-b-0">
            <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 truncate">
                    {label}
                </p>
                <div className="mt-0.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {value ?? "-"}
                </div>
            </div>

            {action && (
                <div className="shrink-0">
                    {action}
                </div>
            )}
        </div>
    );
}