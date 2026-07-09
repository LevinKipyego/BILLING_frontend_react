import {
    Ban,
    Play,
    RefreshCw,
    WifiOff,
    MessageSquare,
    MapPinned,
    UserCog,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import type { UserProfile } from "../types/types";

import QuickActionCard from "../cards/QuickActionCard";

interface Props {

    profile: UserProfile;

}

export default function QuickActionsSection({

    profile,

}: Props) {

    const navigate = useNavigate();

    const hasService =
        profile.overview.active_services > 0;

    return (

        <section className="space-y-5">

            <div>

                <h2 className="text-xl font-bold">

                    Operations

                </h2>

                <p className="text-sm text-slate-500">

                    Frequently used customer management actions.

                </p>

            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

                <QuickActionCard
                    title="Suspend"
                    description="Temporarily disable customer access."
                    icon={<Ban size={22} />}
                    color="bg-red-600"
                    disabled={!hasService}
                    onClick={() => {
                        // TODO
                    }}
                />

                <QuickActionCard
                    title="Resume"
                    description="Restore customer connectivity."
                    icon={<Play size={22} />}
                    color="bg-green-600"
                    disabled={!hasService}
                    onClick={() => {
                        // TODO
                    }}
                />

                <QuickActionCard
                    title="Disconnect"
                    description="Terminate the current online session."
                    icon={<WifiOff size={22} />}
                    color="bg-orange-500"
                    disabled={!hasService}
                    onClick={() => {
                        // TODO
                    }}
                />

                <QuickActionCard
                    title="Renew Package"
                    description="Create a new subscription."
                    icon={<RefreshCw size={22} />}
                    color="bg-blue-600"
                    onClick={() => {
                        // Future: navigate to renewal flow
                    }}
                />

                <QuickActionCard
                    title="Send SMS"
                    description="Notify the customer."
                    icon={<MessageSquare size={22} />}
                    color="bg-purple-600"
                    onClick={() => {
                        // TODO
                    }}
                />

                <QuickActionCard
                    title="View on Map"
                    description="Open customer location."
                    icon={<MapPinned size={22} />}
                    color="bg-cyan-600"
                    onClick={() => {
                        // Future GIS integration
                    }}
                />

                <QuickActionCard
                    title="Manage Account"
                    description="Open advanced customer settings."
                    icon={<UserCog size={22} />}
                    color="bg-slate-700"
                    onClick={() => navigate(`/users/${profile.user.id}/edit`)}
                />

            </div>

        </section>

    );

}