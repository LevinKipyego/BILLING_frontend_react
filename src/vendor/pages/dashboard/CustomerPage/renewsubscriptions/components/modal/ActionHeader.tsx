import {
    Loader2,
    X,
} from "lucide-react";

import type {
    LucideIcon,
} from "lucide-react";

interface ActionHeaderProps {
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    loading?: boolean;
    onClose(): void;
}

export default function ActionHeader({
    title,
    subtitle,
    icon: Icon,
    loading = false,
    onClose,
}: ActionHeaderProps) {
    return (
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur-sm sm:px-6 sm:py-5 dark:border-slate-800 dark:bg-slate-900/95">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100/50 dark:border-blue-900/30">
                        {loading ? (
                            <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-blue-600 dark:text-blue-400" />
                        ) : Icon ? (
                            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                        ) : null}
                    </div>

                    <div className="min-w-0 pt-0.5">
                        <h2
                            id="customer-action-modal-title"
                            className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate"
                        >
                            {title}
                        </h2>

                        {subtitle && (
                            <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close dialog"
                    className="
                        shrink-0
                        rounded-xl
                        p-2
                        text-slate-400
                        transition-colors
                        hover:bg-slate-100
                        hover:text-slate-600
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        dark:text-slate-400
                        dark:hover:bg-slate-800
                        dark:hover:text-slate-200
                    "
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
}