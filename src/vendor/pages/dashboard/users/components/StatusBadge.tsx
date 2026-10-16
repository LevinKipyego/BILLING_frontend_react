import {
    Wifi,
    WifiOff,
    CheckCircle2,
    XCircle,
    Clock3,
    PauseCircle,
} from "lucide-react";

interface Props {
    status:
        | "online"
        | "offline"
        | "active"
        | "expired"
        | "pending"
        | "suspended"
        | "success"
        | "failed";
}

export default function StatusBadge({ status }: Props) {
    const styles = {
        online:
            "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",

        offline:
            "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",

        active:
            "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",

        expired:
            "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",

        pending:
            "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",

        suspended:
            "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",

        success:
            "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",

        failed:
            "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    };

    const icons = {
        online: <Wifi size={12} className="shrink-0" />,
        offline: <WifiOff size={12} className="shrink-0" />,
        active: <CheckCircle2 size={12} className="shrink-0" />,
        expired: <XCircle size={12} className="shrink-0" />,
        pending: <Clock3 size={12} className="shrink-0" />,
        suspended: <PauseCircle size={12} className="shrink-0" />,
        success: <CheckCircle2 size={12} className="shrink-0" />,
        failed: <XCircle size={12} className="shrink-0" />,
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium sm:font-semibold uppercase tracking-wide ${styles[status]}`}
        >
            {icons[status]}
            <span>{(status?.charAt(0).toUpperCase() || '') + (status?.slice(1) || '')}</span>
        </span>
    );
}