import { useMemo, useState, type ReactNode } from "react";

import type { UserProfile } from "../components/types/types";

import OverviewTab from "./tabs/OverviewTab";
import HotspotTab from "../hotspot/HotspotTab";
import PPPoETab from "../pppoe/PppoeTab";
import PaymentsTab from "../payments/PaymentTab";
import ActivityTab from "../activities/ActivityTab";
import DeviceTab from "../devices/DeviceTab";

interface Props {
    profile: UserProfile;
    reload: () => Promise<void>;
}

type Tab =
    | "overview"
    | "hotspot"
    | "pppoe"
    | "device"
    | "payments"
    | "activity";

const tabs: {
    id: Tab;
    label: string;
}[] = [
    {
        id: "overview",
        label: "Overview",
    },
    {
        id: "hotspot",
        label: "Hotspot",
    },
    {
        id: "pppoe",
        label: "PPPoE",
    },
    {
        id: "device",
        label: "Devices",
    },
    {
        id: "payments",
        label: "Payments",
    },
    {
        id: "activity",
        label: "Activity",
    },
];

export default function UserTabs({

    profile,

    reload,

}: Props) {

    const [activeTab, setActiveTab] =
        useState<Tab>("overview");

    const tabComponents = useMemo<Record<Tab, ReactNode>>(
        () => ({

            overview: (

                <OverviewTab
                    profile={profile}
                    reload={reload}
                />

            ),

            hotspot: (

                <HotspotTab
                    profile={profile}
                />

            ),

            pppoe: (

                <PPPoETab
                    profile={profile}
                />

            ),

            device: (

                <DeviceTab
                    profile={profile}
                />

            ),

            payments: (

                <PaymentsTab
                    profile={profile}
                />

            ),

            activity: (

                <ActivityTab
                    profile={profile}
                />

            ),

        }),

        [

            profile,

            reload,

        ]

    );

    return (

        <div className="space-y-6">

            {/* Navigation */}

            <div className="overflow-x-auto">

                <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">

                    {tabs.map((tab) => (

                        <button

                            key={tab.id}

                            onClick={() =>

                                setActiveTab(tab.id)

                            }

                            className={`px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
                                activeTab === tab.id
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white"
                            }`}

                        >

                            {tab.label}

                        </button>

                    ))}

                </div>

            </div>

            {/* Active Tab */}

            {tabComponents[activeTab]}

        </div>

    );

}