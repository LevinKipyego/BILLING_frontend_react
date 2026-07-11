import DeviceItem from "../item/DeviceItem";

import type { CurrentDevice, UserProfile } from "../types/types";

interface Props {

    profile: UserProfile;

}

export default function DevicesSection({

    profile,

}: Props) {

    const currentDevice = profile.devices.current as CurrentDevice | null;

    return (

        <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">

            <div className="mb-6 flex items-center justify-between">

                <div>

                    <h2 className="text-xl font-bold">

                        Current Device

                    </h2>

                    <p className="text-sm text-slate-500">

                        The customer's currently active network connection.

                    </p>

                </div>

                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">

                    View device history

                </button>

            </div>

            {!currentDevice ? (

                <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 py-12 text-center text-slate-500">

                    No active device connected.

                </div>

            ) : (

                <DeviceItem

                    device={currentDevice}

                />

            )}

        </section>

    );

}