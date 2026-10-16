import {
    Wifi,
    Clock,
    Router,
    Globe,
    MonitorSmartphone,
} from "lucide-react";

import StatusBadge from "../../../components/StatusBadge";
import InfoRow from "../../../components/InfoRow";
import type { HotspotConnection } from "../../../components/types/types";

interface Props {
    connection: HotspotConnection | null;
}

export default function ConnectionStatusCard({
    connection,
}: Props) {
    if (!connection) {
        return (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-sm">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4">
                    Connection
                </h2>

                <div className="text-center py-8 sm:py-12 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Customer is offline.
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3.5 sm:py-5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                        Connection
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        Current hotspot session
                    </p>
                </div>

                <div className="shrink-0">
                    <StatusBadge
                        status={
                            connection.online
                                ? "online"
                                : "offline"
                        }
                    />
                </div>
            </div>

            <div className="p-4 sm:p-6 space-y-1">
                <InfoRow
                    icon={<Router size={15} className="text-slate-400 shrink-0" />}
                    label="Router"
                    value={connection.router ?? "-"}
                />

                <InfoRow
                    icon={<Globe size={15} className="text-slate-400 shrink-0" />}
                    label="IP Address"
                    value={connection.ip_address ?? "-"}
                />

                <InfoRow
                    icon={<MonitorSmartphone size={15} className="text-slate-400 shrink-0" />}
                    label="MAC Address"
                    value={connection.mac_address ?? "-"}
                />

                <InfoRow
                    icon={<Clock size={15} className="text-slate-400 shrink-0" />}
                    label="Login Time"
                    value={
                        connection.login_time
                            ? new Date(connection.login_time).toLocaleString()
                            : "-"
                    }
                />

                <InfoRow
                    icon={<Wifi size={15} className="text-slate-400 shrink-0" />}
                    label="Uptime"
                    value={connection.uptime ?? "-"}
                />
            </div>
        </div>
    );
}

