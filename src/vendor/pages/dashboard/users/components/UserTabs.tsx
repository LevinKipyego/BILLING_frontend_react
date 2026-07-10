import { useState } from "react";

import type { UserProfile } from "../components/types/types";

import OverviewTab from "./tabs/OverviewTab";
import HotspotTab from "../hotspot/HotspotTab";
import PPPoETab from "../pppoe/PppoeTab";
import PaymentsTab from "../payments/PaymentTab";

interface Props {
    profile: UserProfile;
    reload: () => Promise<void>;
}

type Tab =
    | "overview"
    | "hotspot"
    | "pppoe"
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

    return (

        <div className="space-y-6">

            {/* Tab Navigation */}

            <div className="overflow-x-auto">

                <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">

                    {tabs.map((tab) => (

                        <button
                            key={tab.id}
                            onClick={() =>
                                setActiveTab(tab.id)
                            }
                            className={`px-5 py-3 text-sm font-semibold transition-all whitespace-nowrap border-b-2 ${
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

            {/* Tab Content */}

            {activeTab === "overview" && (

                <OverviewTab
                    profile={profile}
                    reload={reload}
                />

            )}

            {activeTab === "hotspot" && (

                <HotspotTab
                    profile={profile}
                />

            )}

            {activeTab === "pppoe" && (

                <PPPoETab
                    profile={profile}
                />
            
            )}

            {activeTab === "payments" && (

                <PaymentsTab
                    profile={profile}
                />

            )}

                

            {activeTab === "activity" && (

                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center">

                    <h2 className="text-xl font-bold mb-2">

                        Activity

                    </h2>

                    <p className="text-slate-500">

                        User activity timeline will appear here.

                    </p>

                </div>

            )}

        </div>

    );

}