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
        | "suspended";
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

    };

    const icons = {

        online: <Wifi size={14} />,
        offline: <WifiOff size={14} />,
        active: <CheckCircle2 size={14} />,
        expired: <XCircle size={14} />,
        pending: <Clock3 size={14} />,
        suspended: <PauseCircle size={14} />,

    };

    return (

        <span
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}
        >

            {icons[status]}

            {status.charAt(0).toUpperCase() + status.slice(1)}

        </span>

    );

}