import {
    Laptop,
    Wifi,
    Router,
    Clock,
} from "lucide-react";

import InfoRow from "../../components/InfoRow";

import type { DeviceSummary } from "../../components/types/types";
import { formatDate } from "../../../CustomerEntryPage/renewsubscriptions/utils/date";

interface Props {
    summary: DeviceSummary;
}

export default function DeviceSummaryCard({
    summary,
}: Props) {
    return (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3.5 sm:py-5">
                <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                    Device Summary
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    Customer device statistics
                </p>
            </div>

            <div className="grid gap-3 sm:gap-4 p-4 sm:p-6 md:grid-cols-2">
                <InfoRow
                    icon={<Laptop size={15} className="shrink-0" />}
                    label="Known Devices"
                    value={summary.known_devices.toString()}
                />

                <InfoRow
                    icon={<Wifi size={15} className="shrink-0" />}
                    label="Online Devices"
                    value={summary.online_devices.toString()}
                />

                <InfoRow
                    icon={<Router size={15} className="shrink-0" />}
                    label="Last Router"
                    value={summary.last_router?.name ?? "-"}
                />

                <InfoRow
                    icon={<Clock size={15} className="shrink-0" />}
                    label="Last Seen"
                    value={
                        summary.last_seen
                            ? formatDate(summary.last_seen)
                            : "-"
                    }
                />
            </div>
        </div>
    );
}
