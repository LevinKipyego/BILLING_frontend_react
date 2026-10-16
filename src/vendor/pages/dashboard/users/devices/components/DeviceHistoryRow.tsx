import {
    Router,
    Upload,
    Download,
    Clock,
    Wifi,
} from "lucide-react";
import { formatDate } from "../../../CustomerEntryPage/renewsubscriptions/utils/date";
import type { DeviceHistory } from "../../components/types/types";

interface Props {
    device: DeviceHistory;
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

export default function DeviceHistoryRow({
    device,
}: Props) {
    return (
        <tr className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
            <td className="px-3 sm:px-4 py-2.5 sm:py-3.5 whitespace-nowrap">
                <div className="min-w-0">
                    <div className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {device.mac_address}
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                        {device.username}
                    </div>
                </div>
            </td>

            <td className="px-3 sm:px-4 py-2.5 sm:py-3.5 whitespace-nowrap">
                <span
                    className={`inline-flex rounded-full px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wide ${
                        device.service === "HOTSPOT"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                    }`}
                >
                    {device.service}
                </span>
            </td>

            <td className="px-3 sm:px-4 py-2.5 sm:py-3.5 whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                    <Router size={14} className="shrink-0 text-slate-400" />
                    <span>{device.router.name}</span>
                </div>
            </td>

            <td className="px-3 sm:px-4 py-2.5 sm:py-3.5 whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                    <Wifi size={14} className="shrink-0 text-slate-400" />
                    <span>{device.last_ip ?? "-"}</span>
                </div>
            </td>

            <td className="px-3 sm:px-4 py-2.5 sm:py-3.5 text-center whitespace-nowrap font-medium text-xs sm:text-sm text-slate-900 dark:text-white">
                {device.sessions}
            </td>

            <td className="px-3 sm:px-4 py-2.5 sm:py-3.5 whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                    <Upload
                        size={14}
                        className="text-emerald-600 dark:text-emerald-400 shrink-0"
                    />
                    <span>{formatBytes(device.upload_bytes)}</span>
                </div>
            </td>

            <td className="px-3 sm:px-4 py-2.5 sm:py-3.5 whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                    <Download
                        size={14}
                        className="text-blue-600 dark:text-blue-400 shrink-0"
                    />
                    <span>{formatBytes(device.download_bytes)}</span>
                </div>
            </td>

            <td className="px-3 sm:px-4 py-2.5 sm:py-3.5 whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    <Clock size={14} className="shrink-0" />
                    <span>{device.last_seen ? formatDate(device.last_seen) : "-"}</span>
                </div>
            </td>
        </tr>
    );
}

