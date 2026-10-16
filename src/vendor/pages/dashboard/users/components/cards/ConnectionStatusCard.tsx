import {
    Wifi,
    WifiOff,
    Router,
    Clock3,
    Globe,
    Monitor,
    Download,
    Upload,
} from "lucide-react";

import StatusBadge from "../StatusBadge";
import InfoRow from "../InfoRow";
import { formatDate } from "../../../CustomerEntryPage/renewsubscriptions/utils/date";
import type { ConnectionStatus } from "../types/types";

interface Props {
    connection: ConnectionStatus | null;
}

function formatBytes(bytes: number) {
    if (bytes < 1024)
        return `${bytes} B`;

    if (bytes < 1024 ** 2)
        return `${(bytes / 1024).toFixed(1)} KB`;

    if (bytes < 1024 ** 3)
        return `${(bytes / 1024 ** 2).toFixed(2)} MB`;

    return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

function formatDuration(seconds: number) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0)
        return `${days}d ${hours}h`;

    if (hours > 0)
        return `${hours}h ${minutes}m`;

    return `${minutes}m`;
}

export default function ConnectionStatusCard({
    connection,
}: Props) {
    if (!connection) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 text-center">
                <WifiOff
                    className="mx-auto text-slate-400 sm:w-10 sm:h-10"
                    size={32}
                />
                <h3 className="mt-3 text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                    No Active Session
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    This customer is currently offline.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3.5 sm:py-5">
                <div>
                    <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                        Connection Status
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Live session details
                    </p>
                </div>

                <StatusBadge
                    status={
                        connection.online
                            ? "online"
                            : "offline"
                    }
                />
            </div>

            <div className="grid gap-3 sm:gap-4 p-4 sm:p-6 md:grid-cols-2">
                <InfoRow
                    icon={<Router size={15} className="shrink-0" />}
                    label="Router"
                    value={connection.router_name}
                />

                <InfoRow
                    icon={<Globe size={15} className="shrink-0" />}
                    label="IP Address"
                    value={connection.ip_address}
                />

                <InfoRow
                    icon={<Monitor size={15} className="shrink-0" />}
                    label="MAC Address"
                    value={connection.mac_address}
                />

                <InfoRow
                    icon={<Clock3 size={15} className="shrink-0" />}
                    label="Connected"
                    value={formatDate(connection.login_time)}
                />

                <InfoRow
                    icon={<Wifi size={15} className="shrink-0" />}
                    label="Uptime"
                    value={formatDuration(connection.uptime_seconds)}
                />

                <InfoRow
                    icon={<Download size={15} className="shrink-0" />}
                    label="Downloaded"
                    value={formatBytes(connection.download_bytes)}
                />

                <InfoRow
                    icon={<Upload size={15} className="shrink-0" />}
                    label="Uploaded"
                    value={formatBytes(connection.upload_bytes)}
                />

                <InfoRow
                    icon={<Clock3 size={15} className="shrink-0" />}
                    label="Last Seen"
                    value={formatDate(connection.last_seen)}
                />
            </div>
        </div>
    );
}

