import {
    Router,
    Wifi,
    Shield,
    Upload,
    Download,
    Clock,
} from "lucide-react";

import type { CurrentDevice } from "../types/types";

interface Props {

    device: CurrentDevice;

}

function formatBytes(bytes: number) {

    if (!bytes) return "0 B";

    const units = ["B", "KB", "MB", "GB", "TB"];

    let size = bytes;

    let unit = 0;

    while (size >= 1024 && unit < units.length - 1) {

        size /= 1024;

        unit++;

    }

    return `${size.toFixed(1)} ${units[unit]}`;

}

export default function DeviceItem({

    device,

}: Props) {

    const online = Boolean(device.connected_since);

    return (

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-5">

            <div className="flex items-start justify-between">

                <div className="flex items-start gap-4">

                    <div className="rounded-xl bg-blue-100 dark:bg-blue-900/30 p-3">

                        <Router

                            size={22}

                            className="text-blue-600"

                        />

                    </div>

                    <div>

                        <h3 className="text-lg font-semibold">

                            {device.service}

                        </h3>

                        <p className="text-sm text-slate-500">

                            {device.username}

                        </p>

                    </div>

                </div>

                <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                        online
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    }`}
                >
                    {online ? "Online" : "Offline"}
                </span>

            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                <Info
                    icon={<Shield size={16} />}
                    label="MAC Address"
                    value={device.mac_address || "-"}
                />

                <Info
                    icon={<Wifi size={16} />}
                    label="IP Address"
                    value={device.ip_address || "-"}
                />

                <Info
                    icon={<Router size={16} />}
                    label="Router"
                    value={device.router_name}
                />

                <Info
                    icon={<Clock size={16} />}
                    label="Connected Since"
                    value={
                        device.connected_since
                            ? new Date(
                                  device.connected_since
                              ).toLocaleString()
                            : "-"
                    }
                />

                <Info
                    icon={<Upload size={16} />}
                    label="Upload"
                    value={formatBytes(device.upload_bytes)}
                />

                <Info
                    icon={<Download size={16} />}
                    label="Download"
                    value={formatBytes(device.download_bytes)}
                />

            </div>

        </div>

    );

}

interface InfoProps {

    icon: React.ReactNode;

    label: string;

    value: string;

}

function Info({

    icon,

    label,

    value,

}: InfoProps) {

    return (

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3">

            <div className="flex items-center gap-2 text-slate-500 text-sm">

                {icon}

                <span>{label}</span>

            </div>

            <div className="mt-2 font-medium break-all">

                {value}

            </div>

        </div>

    );

}