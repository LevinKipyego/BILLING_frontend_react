import {
    Eye,
    EyeOff,
    Router,
    Calendar,
    Wifi,
} from "lucide-react";

import { useState } from "react";
import CredentialRow from "../../../components/common/CredentialRow";
import CopyButton from "../../../components/common/CopyButton";
import StatusBadge from "../../../components/StatusBadge";
import type { UserProfile } from "../../../components/types/types";

interface Props {
    profile: UserProfile;
}

export default function HotspotCredentialCard({
    profile,
}: Props) {
    const credential = profile.hotspot.accounts[0]?.credential;
    const connection = profile.connection;
    const [showPassword, setShowPassword] = useState(false);

    if (!credential) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 shadow-sm">
                No hotspot credential assigned.
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3.5 sm:py-5">
                <div>
                    <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                        Hotspot Credential
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Authentication details for hotspot access.
                    </p>
                </div>

                <StatusBadge
                    status={
                        credential.active
                            ? "active"
                            : "offline"
                    }
                />
            </div>

            <div className="p-4 sm:p-6 space-y-1">
                <CredentialRow
                    label="Username"
                    value={credential.username}
                    action={
                        <CopyButton
                            label="Username"
                            value={credential.username}
                        />
                    }
                />

                <CredentialRow
                    label="Password"
                    value={
                        showPassword
                            ? credential.password
                            : "••••••••••••"
                    }
                    action={
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                {
                                    showPassword
                                        ? <EyeOff size={16} />
                                        : <Eye size={16} />
                                }
                            </button>

                            <CopyButton
                                label="Password"
                                value={credential.password}
                            />
                        </div>
                    }
                />

                <CredentialRow
                    label="Router"
                    value={
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                            <Router size={15} className="text-slate-400 shrink-0" />
                            <span>{connection?.router ?? "-"}</span>
                        </div>
                    }
                />

                <CredentialRow
                    label="Created"
                    value={
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                            <Calendar size={15} className="text-slate-400 shrink-0" />
                            <span>
                                {
                                    new Date(
                                        credential.created_at
                                    ).toLocaleString()
                                }
                            </span>
                        </div>
                    }
                />

                <CredentialRow
                    label="Connected"
                    value={
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                            <Wifi size={15} className="text-slate-400 shrink-0" />
                            <span>
                                {
                                    connection?.online
                                        ? "Yes"
                                        : "No"
                                }
                            </span>
                        </div>
                    }
                />
            </div>
        </div>
    );
}

