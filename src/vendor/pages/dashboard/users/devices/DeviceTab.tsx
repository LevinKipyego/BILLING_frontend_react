import DeviceSummaryCard from "./components/DeviceSummaryCard";
import CurrentDeviceCard from "./components/CurrentDeviceCard";
import DeviceHistoryTable from "./components/DeviceHistoryTable";
import DeviceQuickActions from "./components/DeviceQuickActions";

import type { UserProfile } from "../components/types/types";

interface Props {
    profile: UserProfile;
}

export default function DeviceTab({
    profile,
}: Props) {

    const { devices } = profile;

    return (

    <div className="space-y-6">

        <DeviceSummaryCard
            summary={devices.summary}
        />

        <CurrentDeviceCard
            device={devices.current}
        />

        <DeviceQuickActions
            device={devices.current}
        />

        <DeviceHistoryTable
            devices={devices.history}
        />

    </div>

);}