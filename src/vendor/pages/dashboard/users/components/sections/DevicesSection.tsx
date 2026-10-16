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
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6">
            <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                        Connected Devices
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        {currentDevices.length} active connection{currentDevices.length !== 1 ? "s" : ""}
                    </p>
                </div>

                <button className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700">
                    View device history
                </button>
            </div>

            {currentDevices.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-800 py-8 sm:py-12 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    No active devices connected.
                </div>
            ) : (
                <div className="space-y-3 sm:space-y-4">
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
