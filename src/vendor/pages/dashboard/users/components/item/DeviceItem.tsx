import {
    Router,
    Wifi,
    Shield,
    Upload,
    Download,
    Clock,
    Smartphone,
    Laptop,
    Tablet,
} from "lucide-react";

import type { CurrentDevice } from "../types/types";
import { formatDate } from "../../../CustomerEntryPage/renewsubscriptions/utils/date";

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

    const Icon =
        device.device_type === "PHONE"
            ? Smartphone
            : device.device_type === "LAPTOP"
            ? Laptop
            : device.device_type === "TABLET"
            ? Tablet
            : Router;

    return (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3.5 sm:p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                    <div className="rounded-xl bg-blue-100 dark:bg-blue-900/30 p-2 sm:p-3 shrink-0">
                        <Icon
                            size={18}
                            className="text-blue-600 dark:text-blue-400 sm:w-5 sm:h-5"
                        />
                    </div>

                    <div className="min-w-0">
                        <h3 className="text-sm sm:text-lg font-semibold text-slate-900 dark:text-white truncate">
                            {device.service}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {device.username}
                        </p>
                    </div>
                </div>

                <span
                    className={`rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-medium uppercase tracking-wide shrink-0 ${
                        online
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    }`}
                >
                    {online ? "Online" : "Offline"}
                </span>
            </div>

            <div className="mt-4 sm:mt-6 grid gap-2.5 sm:gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                <Info
                    icon={<Shield size={14} className="shrink-0 text-slate-400" />}
                    label="MAC Address"
                    value={device.mac_address || "-"}
                />

                <Info
                    icon={<Wifi size={14} className="shrink-0 text-slate-400" />}
                    label="IP Address"
                    value={device.ip_address || "-"}
                />

                <Info
                    icon={<Router size={14} className="shrink-0 text-slate-400" />}
                    label="Router"
                    value={device.router.name}
                />

                <Info
                    icon={<Router size={14} className="shrink-0 text-slate-400" />}
                    label="Vendor"
                    value={device.router.vendor?.name ?? "-"}
                />

                <Info
                    icon={<Clock size={14} className="shrink-0 text-slate-400" />}
                    label="Connected Since"
                    value={formatDate(device.connected_since)}
                />

                <Info
                    icon={<Upload size={14} className="shrink-0 text-slate-400" />}
                    label="Upload"
                    value={formatBytes(device.upload_bytes)}
                />

                <Info
                    icon={<Download size={14} className="shrink-0 text-slate-400" />}
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
    value: React.ReactNode;
}

function Info({
    icon,
    label,
    value,
}: InfoProps) {
    return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800/80 p-2.5 sm:p-3 bg-white dark:bg-slate-900 min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide truncate">
                {icon}
                <span className="truncate">{label}</span>
            </div>

            <div className="mt-1 font-medium text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                {value}
            </div>
        </div>
    );
}