import {
    Smartphone,
    Laptop,
    Router,
    Tablet,
    Wifi,
    Clock,
    ArrowDown,
    ArrowUp,
    Globe,
} from "lucide-react";

import type { CurrentDevice } from "../../components/types/types";

interface Props {
    device: CurrentDevice;
}

const formatBytes = (bytes?: number) => {

    if (!bytes) return "0 B";

    const units = ["B", "KB", "MB", "GB", "TB"];

    let value = bytes;
    let unit = 0;

    while (value >= 1024 && unit < units.length - 1) {

        value /= 1024;
        unit++;

    }

    return `${value.toFixed(1)} ${units[unit]}`;
};

export default function OnlineDeviceCard({
    device,
}: Props) {

    const Icon =
        device.device_type === "PHONE"
            ? Smartphone
            : device.device_type === "TABLET"
            ? Tablet
            : device.device_type === "LAPTOP"
            ? Laptop
            : Router;

    return (

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">

            <div className="flex items-center justify-between mb-6">

                <div className="flex items-center gap-3">

                    <div className="rounded-xl bg-blue-100 dark:bg-blue-900/30 p-3">

                        <Icon className="text-blue-600" size={22} />

                    </div>

                    <div>

                        <h3 className="font-semibold">
                            {device.username}
                        </h3>

                        <p className="text-sm text-slate-500">
                            {device.service}
                        </p>

                    </div>

                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">

                    Online

                </span>

            </div>

            <div className="grid gap-4 md:grid-cols-2">

                <Info
                    icon={<Wifi size={16} />}
                    label="Router"
                    value={device.router.name}
                />

                <Info
                    icon={<Globe size={16} />}
                    label="IP Address"
                    value={device.ip_address}
                />

                <Info
                    icon={<Clock size={16} />}
                    label="Connected"
                    value={
                        device.connected_since
                            ? new Date(device.connected_since).toLocaleString()
                            : "-"
                    }
                />

                <Info
                    icon={<Router size={16} />}
                    label="MAC Address"
                    value={device.mac_address}
                />

                <Info
                    icon={<ArrowDown size={16} />}
                    label="Download"
                    value={formatBytes(
                        device.download_bytes
                    )}
                />

                <Info
                    icon={<ArrowUp size={16} />}
                    label="Upload"
                    value={formatBytes(
                        device.upload_bytes
                    )}
                />

            </div>

        </div>

    );

}

function Info({

    icon,

    label,

    value,

}: {

    icon: React.ReactNode;

    label: string;

    value: React.ReactNode;

}) {

    return (

        <div>

            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">

                {icon}

                {label}

            </div>

            <p className="font-medium break-all">

                {value || "-"}

            </p>

        </div>

    );

}