import DeviceItem from "../item/DeviceItem";

import type { UserProfile } from "../types/types";

interface Props {
    profile: UserProfile;
}

export default function DevicesSection({
    profile,
}: Props) {

    const currentDevices = profile.devices.current ?? [];

    return (

        <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">

            <div className="mb-6 flex items-center justify-between">

                <div>

                    <h2 className="text-xl font-bold">

                        Connected Devices

                    </h2>

                    <p className="text-sm text-slate-500">

                        {currentDevices.length} active connection{currentDevices.length !== 1 ? "s" : ""}

                    </p>

                </div>

                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">

                    View device history

                </button>

            </div>

            {currentDevices.length === 0 ? (

                <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 py-12 text-center text-slate-500">

                    No active devices connected.

                </div>

            ) : (

                <div className="space-y-4">

                    {currentDevices.map((device) => (

                        <DeviceItem
                            key={`${device.username}-${device.mac_address}-${device.connected_since}`}
                            device={device}
                        />

                    ))}

                </div>

            )}

        </section>

    );

}