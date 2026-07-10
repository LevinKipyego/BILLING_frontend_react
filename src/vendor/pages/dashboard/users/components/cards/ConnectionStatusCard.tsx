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

            <div className="rounded-2xl border border-dashed p-10 text-center">

                <WifiOff
                    className="mx-auto text-slate-400"
                    size={42}
                />

                <h3 className="mt-4 text-lg font-semibold">

                    No Active Session

                </h3>

                <p className="mt-2 text-sm text-slate-500">

                    This customer is currently offline.

                </p>

            </div>

        );

    }

    return (

        <div className="rounded-2xl border bg-white dark:bg-slate-900 shadow-sm">

            <div className="flex items-center justify-between border-b px-6 py-5">

                <div>

                    <h2 className="text-xl font-bold">

                        Connection Status

                    </h2>

                    <p className="text-sm text-slate-500">

                        Live hotspot session

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

            <div className="grid gap-4 p-6 md:grid-cols-2">

                <InfoRow

                    icon={<Router size={16}/>}

                    label="Router"

                    value={connection.router_name}

                />

                <InfoRow

                    icon={<Globe size={16}/>}

                    label="IP Address"

                    value={connection.ip_address}

                />

                <InfoRow

                    icon={<Monitor size={16}/>}

                    label="MAC Address"

                    value={connection.mac_address}

                />

                <InfoRow

                    icon={<Clock3 size={16}/>}

                    label="Connected"

                    value={

                        new Date(

                            connection.login_time

                        ).toLocaleString()

                    }

                />

                <InfoRow

                    icon={<Wifi size={16}/>}

                    label="Uptime"

                    value={

                        formatDuration(

                            connection.uptime_seconds

                        )

                    }

                />

                <InfoRow

                    icon={<Download size={16}/>}

                    label="Downloaded"

                    value={

                        formatBytes(

                            connection.download_bytes

                        )

                    }

                />

                <InfoRow

                    icon={<Upload size={16}/>}

                    label="Uploaded"

                    value={

                        formatBytes(

                            connection.upload_bytes

                        )

                    }

                />

                <InfoRow

                    icon={<Clock3 size={16}/>}

                    label="Last Seen"

                    value={

                        new Date(

                            connection.last_seen

                        ).toLocaleString()

                    }

                />

            </div>

        </div>

    );

}