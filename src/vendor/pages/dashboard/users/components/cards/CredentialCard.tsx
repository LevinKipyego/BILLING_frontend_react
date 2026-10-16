import {
    User,
    Lock,
    Router,
    Calendar,
    ShieldCheck,
    ShieldX,
} from "lucide-react";

import CopyButton from "../common/CopyButton";
import StatusBadge from "../StatusBadge";
import { formatDate } from "../../../CustomerEntryPage/renewsubscriptions/utils/date";

interface Credential {
    username: string;
    password: string;
    active: boolean;
    suspended: boolean;
    created_at: string;
    mikrotik_name?: string;
}

interface Props {
    title: string;
    credential: Credential | null;
}

function Row({
    icon,
    label,
    value,
    copy = false,
}: {
    icon: React.ReactNode;
    label: string;
    value?: string | number | null;
    copy?: boolean;
}) {
    return (
        <div className="flex items-center justify-between py-2 sm:py-3 border-b border-slate-100 dark:border-slate-800/80 last:border-none text-xs sm:text-sm">
            <div className="flex items-center gap-2 sm:gap-3 text-slate-500 dark:text-slate-400 shrink-0">
                {icon}
                <span>{label}</span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 font-semibold text-slate-900 dark:text-slate-100 min-w-0">
                <span className="truncate max-w-[140px] sm:max-w-xs">{value ?? "-"}</span>
                {copy && value && (
                    <CopyButton
                        value={String(value)}
                    />
                )}
            </div>
        </div>
    );
}

export default function CredentialCard({
    title,
    credential,
}: Props) {
    if (!credential) {
        return (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
                <div className="text-center">
                    <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                        No Credential Found
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                        This customer has not yet been issued credentials.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-5 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <h2 className="font-bold text-sm sm:text-lg text-slate-900 dark:text-white">
                        {title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Authentication Details
                    </p>
                </div>

                <StatusBadge
                    status={credential.active ? "active" : "suspended"}
                />
            </div>

            <div className="p-4 sm:p-6">
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

                {credential.mikrotik_name && (
                    <Row
                        icon={<Router size={16} className="shrink-0" />}
                        label="Router"
                        value={credential.mikrotik_name}
                    />
                )}

                <Row
                    icon={<Calendar size={16} className="shrink-0" />}
                    label="Created"
                    value={formatDate(credential.created_at)}
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
}