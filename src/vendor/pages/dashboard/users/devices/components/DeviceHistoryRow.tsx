import {
    Router,
    Upload,
    Download,
    Clock,
    Wifi,
} from "lucide-react";

import type { DeviceHistoryItem } from "../../components/types/types";

interface Props {

    device: DeviceHistoryItem;

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

        <tr className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40">

            <td className="px-4 py-4">

                <div>

                    <div className="font-medium">

                        {device.mac_address}

                    </div>

                    <div className="text-xs text-slate-500">

                        {device.username}

                    </div>

                </div>

            </td>

            <td className="px-4 py-4">

                <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        device.service === "HOTSPOT"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                    }`}
                >
                    {device.service}
                </span>

            </td>

            <td className="px-4 py-4">

                <div className="flex items-center gap-2">

                    <Router size={15} />

                    {device.router_name}

                </div>

            </td>

            <td className="px-4 py-4">

                <div className="flex items-center gap-2">

                    <Wifi size={15} />

                    {device.last_ip ?? "-"}

                </div>

            </td>

            <td className="px-4 py-4 text-center">

                {device.sessions}

            </td>

            <td className="px-4 py-4">

                <div className="flex items-center gap-2">

                    <Upload
                        size={15}
                        className="text-emerald-600"
                    />

                    {formatBytes(device.upload_bytes)}

                </div>

            </td>

            <td className="px-4 py-4">

                <div className="flex items-center gap-2">

                    <Download
                        size={15}
                        className="text-blue-600"
                    />

                    {formatBytes(device.download_bytes)}

                </div>

            </td>

            <td className="px-4 py-4">

                <div className="flex items-center gap-2">

                    <Clock size={15} />

                    {new Date(device.last_seen).toLocaleString()}

                </div>

            </td>

        </tr>

    );

}
