import { MonitorSmartphone } from "lucide-react";

import DeviceItem from "../../components/item/DeviceItem";

import type { CurrentDevice } from "../../components/types/types";

interface Props {

    device: CurrentDevice | null;

}

export default function CurrentDeviceCard({

    device,

}: Props) {

    return (

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">

            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-700 px-6 py-5">

                <MonitorSmartphone

                    size={22}

                    className="text-blue-600"

                />

                <div>

                    <h2 className="text-xl font-bold">

                        Current Device

                    </h2>

                    <p className="mt-1 text-sm text-slate-500">

                        Currently active customer connection.

                    </p>

                </div>

            </div>

            <div className="p-6">

                {device ? (

                    <DeviceItem

                        device={device}

                    />

                ) : (

                    <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 py-12 text-center">

                        <MonitorSmartphone

                            size={40}

                            className="mx-auto text-slate-400"

                        />

                        <h3 className="mt-4 text-lg font-semibold">

                            No Active Device

                        </h3>

                        <p className="mt-2 text-sm text-slate-500">

                            The customer is currently offline.

                        </p>

                    </div>

                )}

            </div>

        </div>

    );

}