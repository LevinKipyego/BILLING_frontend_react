import {

    Eye,

    EyeOff,

    Router,

    Calendar,

    Wifi,

} from "lucide-react";

import { useState } from "react";

import CredentialRow from "../../../components/common/CredentialRow";

import CopyButton from "../../components/CopyButton";

import StatusBadge from "../../../components/StatusBadge";

import type { UserProfile } from "../../../components/types/types";

interface Props {

    profile: UserProfile;

}

export default function HotspotCredentialCard({

    profile,

}: Props) {

    const credential = profile.hotspot.credential;

    const connection = profile.connection;

    const [showPassword, setShowPassword] = useState(false);

    if (!credential) {

        return (

            <div className="rounded-2xl border border-dashed p-10 text-center text-slate-500">

                No hotspot credential assigned.

            </div>

        );

    }

    return (

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6 py-5">

                <div>

                    <h2 className="text-xl font-bold">

                        Hotspot Credential

                    </h2>

                    <p className="text-sm text-slate-500 mt-1">

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

            <div className="p-6">

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

                                className="text-slate-500 hover:text-blue-600"

                            >

                                {

                                    showPassword

                                        ? <EyeOff size={18}/>

                                        : <Eye size={18}/>

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

                        <div className="flex items-center gap-2">

                            <Router size={16}/>

                            {connection?.router ?? "-"}

                        </div>

                    }

                />

                <CredentialRow

                    label="Created"

                    value={

                        <div className="flex items-center gap-2">

                            <Calendar size={16}/>

                            {

                                new Date(

                                    credential.created_at

                                ).toLocaleString()

                            }

                        </div>

                    }

                />

                <CredentialRow

                    label="Connected"

                    value={

                        <div className="flex items-center gap-2">

                            <Wifi size={16}/>

                            {

                                connection?.online

                                    ? "Yes"

                                    : "No"

                            }

                        </div>

                    }

                />

            </div>

        </div>

    );

}