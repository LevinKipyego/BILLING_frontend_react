import type { FC } from "react";

import {
    Wifi,
    User,
    Lock,
    Router,
    ShieldCheck,
    ShieldX,
} from "lucide-react";

import CopyButton from "../../../components/common/CopyButton";
import StatusBadge from "../../../components/StatusBadge";
const StatusBadgeAny = StatusBadge as any;
import type { UserProfile } from "../../../components/types/types";

interface Props {
    profile: UserProfile;
}

const Row = ({
    icon,
    label,
    value,
    copy = false,
}: {
    icon: React.ReactNode;
    label: string;
    value?: string | number | null;
    copy?: boolean;
}) => (
    <div className="flex items-center justify-between py-2.5 sm:py-3 border-b border-slate-100 dark:border-slate-800/80 last:border-none gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 sm:gap-3 text-slate-500 dark:text-slate-400 shrink-0">
            {icon}
            <span>{label}</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 font-semibold text-slate-900 dark:text-slate-100 min-w-0 truncate justify-end">
            <span className="truncate">{value ?? "-"}</span>
            {copy && value && (
                <div className="shrink-0">
                    <CopyButton value={String(value)} />
                </div>
            )}
        </div>
    </div>
);

const PPPoECredentialCard: FC<Props> = ({ profile }) => {
    const credential = profile.pppoe.credential;

    if (!credential) {
        return (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-sm">
                <div className="text-center py-8 sm:py-12">
                    <Wifi
                        className="mx-auto mb-3 text-slate-400 dark:text-slate-500"
                        size={36}
                    />
                    <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                        No PPPoE Credential
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                        This customer has never been issued a PPPoE account.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="px-4 sm:px-6 py-3.5 sm:py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white truncate">
                        PPPoE Credential
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
                        Authentication information
                    </p>
                </div>

                <div className="shrink-0">
                    <StatusBadgeAny status={credential.active ? "active" : "suspended"}>
                        {credential.active ? "Active" : "Suspended"}
                    </StatusBadgeAny>
                </div>
            </div>

            <div className="p-4 sm:p-6 space-y-0.5 sm:space-y-1">
                <Row
                    icon={<User size={16} className="shrink-0" />}
                    label="Username"
                    value={credential.username}
                    copy
                />

                <Row
                    icon={<Lock size={16} className="shrink-0" />}
                    label="Password"
                    value={credential.password}
                    copy
                />

                <Row
                    icon={<Router size={16} className="shrink-0" />}
                    label="Router"
                    value={credential.mikrotik as string | undefined}
                />

                <Row
                    icon={<Wifi size={16} className="shrink-0" />}
                    label="Plan"
                    value={
                        profile.pppoe.accounts[0]?.current_subscription?.plan_name
                    }
                />

                <Row
                    icon={
                        credential.suspended
                            ? <ShieldX size={16} className="shrink-0 text-red-500" />
                            : <ShieldCheck size={16} className="shrink-0 text-green-500" />
                    }
                    label="Suspended"
                    value={
                        credential.suspended
                            ? "Yes"
                            : "No"
                    }
                />
            </div>
        </div>
    );
};

export default PPPoECredentialCard;