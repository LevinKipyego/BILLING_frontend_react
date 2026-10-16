import OnlineDeviceCard from "./OnlineDeviceCard";

import type { CurrentDevice } from "../../components/types/types";

interface Props {
    devices?: CurrentDevice[];
}

export default function OnlineDevicesSection({
    devices = [],
}: Props) {
    return (
        <section className="space-y-3 sm:space-y-5">
            <div>
                <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                    Online Devices
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    {devices?.length ?? 0} active connection{(devices?.length ?? 0) !== 1 ? "s" : ""}
                </p>
            </div>

            {(devices?.length ?? 0) === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 text-center">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                        No Online Devices
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        This customer has no active sessions.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:gap-6 xl:grid-cols-2">
                    {devices.map((device) => (
                        <OnlineDeviceCard
                            key={`${device.username}-${device.router.id}-${device.connected_since}`}
                            device={device}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
