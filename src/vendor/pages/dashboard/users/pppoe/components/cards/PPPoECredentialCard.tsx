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
    <div className="flex items-center justify-between py-3 border-b last:border-none">

        <div className="flex items-center gap-3 text-slate-500">

            {icon}

            <span>{label}</span>

        </div>

        <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">

            {value ?? "-"}

            {copy && value && (
                <CopyButton
                    value={String(value)}
                />
            )}

        </div>

    </div>
);

const PPPoECredentialCard: FC<Props> = ({ profile }) => {

    const credential = profile.pppoe.credential;

    if (!credential) {

        return (

            <div className="rounded-2xl border bg-white dark:bg-slate-900 p-6">

                <div className="text-center py-12">

                    <Wifi
                        className="mx-auto mb-3 text-slate-400"
                        size={48}
                    />

                    <h3 className="font-semibold">

                        No PPPoE Credential

                    </h3>

                    <p className="text-sm text-slate-500 mt-2">

                        This customer has never been issued a PPPoE account.

                    </p>

                </div>

            </div>

        );

    }

    return (

        <div className="rounded-2xl border bg-white dark:bg-slate-900 shadow-sm">

            <div className="px-6 py-5 border-b flex items-center justify-between">

                <div>

                    <h2 className="font-bold text-lg">

                        PPPoE Credential

                    </h2>

                    <p className="text-sm text-slate-500">

                        Authentication information

                    </p>

                </div>

                <StatusBadgeAny status={credential.active ? "active" : "suspended"}>
                    {credential.active ? "Active" : "Suspended"}
                </StatusBadgeAny>

            </div>

            <div className="p-6 space-y-2">

                <Row
                    icon={<User size={18} />}
                    label="Username"
                    value={credential.username}
                    copy
                />

                <Row
                    icon={<Lock size={18} />}
                    label="Password"
                    value={credential.password}
                    copy
                />

                <Row
                    icon={<Router size={18} />}
                    label="Router"
                    value={credential.mikrotik}
                />

                <Row
                    icon={<Wifi size={18} />}
                    label="Plan"
                    value={
                        profile.pppoe.current_subscription?.plan_name
                    }
                />

                <Row
                    icon={
                        credential.suspended
                            ? <ShieldX size={18}/>
                            : <ShieldCheck size={18}/>
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