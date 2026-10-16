import type { ReactNode } from "react";

interface Props {
    title: string;
    description: string;
    icon: ReactNode;
    color?: string;
    onClick?: () => void;
    disabled?: boolean;
}

export default function QuickActionCard({
    title,
    description,
    icon,
    color = "bg-blue-600",
    onClick,
    disabled = false,
}: Props) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full rounded-2xl border border-slate-200 dark:border-slate-800
                        bg-white dark:bg-slate-900 p-3.5 sm:p-5 text-left
                        transition hover:shadow-lg hover:-translate-y-1
                        disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            <div className={`${color} h-9 w-9 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center text-white shrink-0`}>
                {icon}
            </div>

            <h3 className="mt-3 sm:mt-5 text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                {title}
            </h3>

            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                {description}
            </p>
        </button>
    );
}

