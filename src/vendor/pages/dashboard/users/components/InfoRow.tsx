import React from "react";

interface Props {
    icon?: React.ReactNode;
    label: string;
    value: React.ReactNode;
}

export default function InfoRow({
    icon,
    label,
    value,
}: Props) {
    return (
        <div className="flex items-center gap-2.5 min-w-0">
            {icon && (
                <div className="text-slate-400 dark:text-slate-500 shrink-0">
                    {icon}
                </div>
            )}
            <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide truncate">
                    {label}
                </p>
                <p className="font-medium sm:font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                    {value}
                </p>
            </div>
        </div>
    );
}