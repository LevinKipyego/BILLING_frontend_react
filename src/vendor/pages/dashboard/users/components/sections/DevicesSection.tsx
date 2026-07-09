import DeviceItem from "../item/DeviceItem";

import type { UserProfile } from "../types/types";

interface Props {
    profile: UserProfile;
}

export default function DevicesSection({
    profile,
}: Props) {

    return (

        <section className="rounded-2xl border bg-white dark:bg-slate-900 p-6">

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h2 className="text-xl font-bold">

                        Connected Devices

                    </h2>

                    <p className="text-sm text-slate-500">

                        Devices associated with this customer.

                    </p>

                </div>

                <button className="text-blue-600 hover:text-blue-700">

                    View all

                </button>

            </div>

            {profile.devices.length === 0 ? (

                <div className="py-12 text-center text-slate-500">

                    No devices found.

                </div>

            ) : (

                profile.devices.map(device => (

                    <DeviceItem

                        key={`${device.source}-${device.identifier ?? device.name}`}

                        device={device}

                    />

                ))

            )}

        </section>

    );

}