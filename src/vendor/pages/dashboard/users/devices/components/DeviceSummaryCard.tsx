import {
    Laptop,
    Wifi,
    Router,
    Clock,
} from "lucide-react";

import InfoRow from "../../components/InfoRow";

import type { DeviceSummary } from "../../components/types/types";

interface Props {

    summary: DeviceSummary;

}

export default function DeviceSummaryCard({

    summary,

}: Props) {

    return (

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">

            <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-5">

                <h2 className="text-xl font-bold">

                    Device Summary

                </h2>

                <p className="text-sm text-slate-500 mt-1">

                    Customer device statistics

                </p>

            </div>

            <div className="grid md:grid-cols-2 gap-4 p-6">

                <InfoRow

                    icon={<Laptop size={18}/>}

                    label="Known Devices"

                    value={summary.known_devices.toString()}

                />

                <InfoRow

                    icon={<Wifi size={18}/>}

                    label="Online Devices"

                    value={summary.online_devices.toString()}

                />

                <InfoRow

                    icon={<Router size={18}/>}

                    label="Last Router"

                    value={summary.last_router?.name ?? "-"}

                />

                <InfoRow

                    icon={<Clock size={18}/>}

                    label="Last Seen"

                    value={

                        summary.last_seen

                            ? new Date(summary.last_seen).toLocaleString()

                            : "-"

                    }

                />

            </div>

        </div>

    );

}