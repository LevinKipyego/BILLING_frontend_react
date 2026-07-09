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

            <div className="rounded-2xl border bg-white dark:bg-slate-900 p-6">

                <h2 className="font-bold text-lg mb-6">

                    Connection

                </h2>

                <div className="text-center py-12 text-slate-500">

                    Customer is offline.

                </div>

            </div>

        );

    }

    return (

        <div className="rounded-2xl border bg-white dark:bg-slate-900">

            <div className="border-b px-6 py-5 flex justify-between">

                <div>

                    <h2 className="font-bold text-lg">

                        Connection

                    </h2>

                    <p className="text-sm text-slate-500">

                        Current hotspot session

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

            <div className="p-6 space-y-3">

                <InfoRow
                    icon={<Router size={16}/>}
                    label="Router"
                    value={connection.router ?? "-"}
                />

                <InfoRow
                    icon={<Globe size={16}/>}
                    label="IP Address"
                    value={connection.ip_address ?? "-"}
                />

                <InfoRow
                    icon={<MonitorSmartphone size={16}/>}
                    label="MAC Address"
                    value={connection.mac_address ?? "-"}
                />

                <InfoRow
                    icon={<Clock size={16}/>}
                    label="Login Time"
                    value={
                        connection.login_time
                            ? new Date(connection.login_time).toLocaleString()
                            : "-"
                    }
                />

                <InfoRow
                    icon={<Wifi size={16}/>}
                    label="Uptime"
                    value={connection.uptime ?? "-"}
                />

            </div>

        </div>

    );

}