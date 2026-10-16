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
import { formatDate } from "../../../CustomerEntryPage/renewsubscriptions/utils/date";
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
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="rounded-xl bg-blue-100 dark:bg-blue-900/30 p-2 sm:p-3 shrink-0">
                        <Icon className="text-blue-600 dark:text-blue-400 w-5 h-5 sm:w-[22px] sm:h-[22px]" />
                    </div>

                    <div className="min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                            {device.username}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {device.service}
                        </p>
                    </div>
                </div>

                <span className="rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-medium text-green-700 dark:text-green-400 uppercase tracking-wide shrink-0">
                    Online
                </span>
            </div>

            <div className="grid gap-2.5 sm:gap-4 md:grid-cols-2">
                <Info
                    icon={<Wifi size={14} className="shrink-0 text-slate-400" />}
                    label="Router"
                    value={device.router.name}
                />

                <Info
                    icon={<Globe size={14} className="shrink-0 text-slate-400" />}
                    label="IP Address"
                    value={device.ip_address}
                />

                <Info
                    icon={<Clock size={14} className="shrink-0 text-slate-400" />}
                    label="Connected"
                    value={
                        device.connected_since
                            ? formatDate(device.connected_since)
                            : "-"
                    }
                />

                <Info
                    icon={<Router size={14} className="shrink-0 text-slate-400" />}
                    label="MAC Address"
                    value={device.mac_address}
                />

                <Info
                    icon={<ArrowDown size={14} className="shrink-0 text-slate-400" />}
                    label="Download"
                    value={formatBytes(
                        device.download_bytes
                    )}
                />

                <Info
                    icon={<ArrowUp size={14} className="shrink-0 text-slate-400" />}
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
        <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 p-2.5 sm:p-3 bg-slate-50/50 dark:bg-slate-800/20 min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide truncate">
                {icon}
                <span className="truncate">{label}</span>
            </div>

            <p className="font-medium text-xs sm:text-sm text-slate-900 dark:text-slate-100 break-all">
                {value || "-"}
            </p>
        </div>
    );
}

