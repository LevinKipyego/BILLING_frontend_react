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
        <section className="space-y-3 sm:space-y-5">
            <div>
                <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                    Operations
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    Frequently used customer management actions.
                </p>
            </div>

            <div className="grid gap-3 sm:gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                <QuickActionCard
                    title="Suspend"
                    description="Temporarily disable customer access."
                    icon={<Ban size={18} className="sm:w-5 sm:h-5" />}
                    color="bg-red-600"
                    disabled={!hasService}
                    onClick={() => {
                        // TODO
                    }}
                />

                <QuickActionCard
                    title="Resume"
                    description="Restore customer connectivity."
                    icon={<Play size={18} className="sm:w-5 sm:h-5" />}
                    color="bg-green-600"
                    disabled={!hasService}
                    onClick={() => {
                        // TODO
                    }}
                />

                <QuickActionCard
                    title="Disconnect"
                    description="Terminate current online session."
                    icon={<WifiOff size={18} className="sm:w-5 sm:h-5" />}
                    color="bg-orange-500"
                    disabled={!hasService}
                    onClick={() => {
                        // TODO
                    }}
                />

                <QuickActionCard
                    title="Renew Package"
                    description="Create a new subscription."
                    icon={<RefreshCw size={18} className="sm:w-5 sm:h-5" />}
                    color="bg-blue-600"
                    onClick={() => {
                        // Future: navigate to renewal flow
                    }}
                />

                <QuickActionCard
                    title="Send SMS"
                    description="Notify the customer."
                    icon={<MessageSquare size={18} className="sm:w-5 sm:h-5" />}
                    color="bg-purple-600"
                    onClick={() => {
                        // TODO
                    }}
                />

                <QuickActionCard
                    title="View on Map"
                    description="Open customer location."
                    icon={<MapPinned size={18} className="sm:w-5 sm:h-5" />}
                    color="bg-cyan-600"
                    onClick={() => {
                        // Future GIS integration
                    }}
                />

                <QuickActionCard
                    title="Manage Account"
                    description="Open advanced settings."
                    icon={<UserCog size={18} className="sm:w-5 sm:h-5" />}
                    color="bg-slate-700"
                    onClick={() => navigate(`/users/${profile.user.id}/edit`)}
                />
            </div>
        </section>
    );
}
