import OnlineDeviceCard from "./OnlineDeviceCard";

import type { CurrentDevice } from "../../components/types/types";

interface Props {
    devices: CurrentDevice[];
}

export default function OnlineDevicesSection({
    devices,
}: Props) {

    return (

        <section className="space-y-5">

            <div>

                <h2 className="text-xl font-bold">

                    Online Devices

                </h2>

                <p className="text-sm text-slate-500">

                    {devices.length} active connection{devices.length !== 1 ? "s" : ""}

                </p>

            </div>

            {devices.length === 0 ? (

                <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center">

                    <h3 className="text-lg font-semibold">

                        No Online Devices

                    </h3>

                    <p className="mt-2 text-slate-500">

                        This customer has no active sessions.

                    </p>

                </div>

            ) : (

                <div className="grid gap-6 xl:grid-cols-2">

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