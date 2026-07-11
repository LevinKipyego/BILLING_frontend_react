import { HardDrive } from "lucide-react";

import DeviceHistoryRow from "./DeviceHistoryRow";

import type { DeviceHistoryItem } from "../../components/types/types";

interface Props {

    devices: DeviceHistoryItem[];

}

export default function DeviceHistoryTable({

    devices,

}: Props) {

    return (

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6 py-5">

                <div>

                    <h2 className="text-xl font-bold">

                        Device History

                    </h2>

                    <p className="mt-1 text-sm text-slate-500">

                        Devices previously used by this customer.

                    </p>

                </div>

                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-sm font-medium">

                    {devices.length} Device{devices.length !== 1 ? "s" : ""}

                </span>

            </div>

            {devices.length === 0 ? (

                <div className="py-16 text-center">

                    <HardDrive

                        size={42}

                        className="mx-auto text-slate-400"

                    />

                    <h3 className="mt-4 text-lg font-semibold">

                        No Device History

                    </h3>

                    <p className="mt-2 text-sm text-slate-500">

                        This customer has not connected any devices yet.

                    </p>

                </div>

            ) : (

                <div className="overflow-x-auto">

                    <table className="min-w-full">

                        <thead className="bg-slate-50 dark:bg-slate-800/40">

                            <tr className="text-left text-sm font-semibold">

                                <th className="px-4 py-3">

                                    Device

                                </th>

                                <th className="px-4 py-3">

                                    Service

                                </th>

                                <th className="px-4 py-3">

                                    Router

                                </th>

                                <th className="px-4 py-3">

                                    IP Address

                                </th>

                                <th className="px-4 py-3 text-center">

                                    Sessions

                                </th>

                                <th className="px-4 py-3">

                                    Upload

                                </th>

                                <th className="px-4 py-3">

                                    Download

                                </th>

                                <th className="px-4 py-3">

                                    Last Seen

                                </th>

                            </tr>

                        </thead>

                        <tbody>

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