interface StatusBadgeProps {
    status: string;
    className?: string;
    showDot?: boolean;
}

interface StyleConfig {
    container: string;
    dot: string;
    pulse?: boolean;
}

const STATUS_STYLES: Record<string, StyleConfig> = {
    /* Success / Active / Online States */
    active: {
        container: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-500/30",
        dot: "bg-emerald-500 dark:bg-emerald-400",
        pulse: true,
    },
    online: {
        container: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-500/30",
        dot: "bg-emerald-500 dark:bg-emerald-400",
        pulse: true,
    },
    success: {
        container: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-500/30",
        dot: "bg-emerald-500 dark:bg-emerald-400",
    },

    /* Warning / Pending / Degraded States */
    suspended: {
        container: "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-950/50 dark:text-amber-400 dark:ring-amber-500/30",
        dot: "bg-amber-500 dark:bg-amber-400",
    },
    degraded: {
        container: "bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-950/50 dark:text-orange-400 dark:ring-orange-500/30",
        dot: "bg-orange-500 dark:bg-orange-400",
    },
    partial: {
        container: "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-950/50 dark:text-amber-400 dark:ring-amber-500/30",
        dot: "bg-amber-500 dark:bg-amber-400",
    },
    pending: {
        container: "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-950/50 dark:text-blue-400 dark:ring-blue-500/30",
        dot: "bg-blue-500 dark:bg-blue-400",
    },

    /* Critical / Error / Offline / Expired States */
    disabled: {
        container: "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-950/50 dark:text-rose-400 dark:ring-rose-500/30",
        dot: "bg-rose-500 dark:bg-rose-400",
    },
    offline: {
        container: "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-950/50 dark:text-rose-400 dark:ring-rose-500/30",
        dot: "bg-rose-500 dark:bg-rose-400",
    },
    expired: {
        container: "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-950/50 dark:text-rose-400 dark:ring-rose-500/30",
        dot: "bg-rose-500 dark:bg-rose-400",
    },
    failed: {
        container: "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-950/50 dark:text-rose-400 dark:ring-rose-500/30",
        dot: "bg-rose-500 dark:bg-rose-400",
    },

    /* Neutral / Archived States */
    deleted: {
        container: "bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-800/60 dark:text-slate-400 dark:ring-slate-700",
        dot: "bg-slate-400 dark:bg-slate-500",
    },
};

const DEFAULT_STYLE: StyleConfig = {
    container: "bg-slate-100 text-slate-700 ring-slate-500/20 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
    dot: "bg-slate-400 dark:bg-slate-500",
};

export default function StatusBadge({
    status,
    className = "",
    showDot = true,
}: StatusBadgeProps) {
    const key = status.toLowerCase();
    const config = STATUS_STYLES[key] ?? DEFAULT_STYLE;

    // Clean up snake_case to Title Case (e.g., "partially_active" -> "Partially Active")
    const formattedStatus = status.replace(/_/g, " ");

    return (
        <span
            className={`
                inline-flex
                items-center
                gap-1.5
                rounded-full
                px-2.5
                py-1
                text-xs
                font-medium
                capitalize
                ring-1
                ring-inset
                transition-colors
                ${config.container}
                ${className}
            `}
        >
            {showDot && (
                <span className="relative flex h-2 w-2 shrink-0">
                    {config.pulse && (
                        <span
                            className={`
                                absolute
                                inline-flex
                                h-full
                                w-full
                                animate-ping
                                rounded-full
                                opacity-75
                                ${config.dot}
                            `}
                        />
                    )}
                    <span
                        className={`
                            relative
                            inline-flex
                            h-2
                            w-2
                            rounded-full
                            ${config.dot}
                        `}
                    />
                </span>
            )}
            <span>{formattedStatus}</span>
        </span>
    );
}