import DeviceSummaryCard from "./components/DeviceSummaryCard";
import OnlineDevicesSection from "./components/OnlineDeviceSection";
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

           

            <DeviceHistoryTable
                devices={devices.history}
            />

            <DeviceQuickActions
                devices={devices.current}
            />

        </div>

    );

}