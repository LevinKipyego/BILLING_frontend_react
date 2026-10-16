import { HardDrive } from "lucide-react";

import DeviceHistoryRow from "./DeviceHistoryRow";

import type { DeviceHistory } from "../../components/types/types";

interface Props {
    devices: DeviceHistory[];
}

export default function DeviceHistoryTable({
    devices,
}: Props) {
    return (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3.5 sm:py-5 gap-2">
                <div>
                    <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                        Device History
                    </h2>
                    <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Devices previously used by this customer.
                    </p>
                </div>

                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 shrink-0">
                    {devices.length} Device{devices.length !== 1 ? "s" : ""}
                </span>
            </div>

            {devices.length === 0 ? (
                <div className="py-8 sm:py-16 text-center">
                    <HardDrive
                        size={32}
                        className="mx-auto text-slate-400 dark:text-slate-500 sm:w-10 sm:h-10"
                    />

                    <h3 className="mt-3 text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                        No Device History
                    </h3>

                    <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        This customer has not connected any devices yet.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto scrollbar-none">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-slate-800/40">
                            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                <th className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap">
                                    Device
                                </th>

                                <th className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap">
                                    Service
                                </th>

                                <th className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap">
                                    Router
                                </th>

                                <th className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap">
                                    IP Address
                                </th>

                                <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-center whitespace-nowrap">
                                    Sessions
                                </th>

                                <th className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap">
                                    Upload
                                </th>

                                <th className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap">
                                    Download
                                </th>

                                <th className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap">
                                    Last Seen
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                            {devices.map((device) => (
                                <DeviceHistoryRow
                                    key={`${device.mac_address}-${device.service}`}
                                    device={device}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

