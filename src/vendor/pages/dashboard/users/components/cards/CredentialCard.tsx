import {
    User,
    Lock,
    Router,
    Calendar,
    ShieldCheck,
    ShieldX,
} from "lucide-react";

import CopyButton from "../../components/common/CopyButton";
import StatusBadge from "../StatusBadge";

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

        <div className="flex items-center justify-between py-3 border-b last:border-none">

            <div className="flex items-center gap-3 text-slate-500">

                {icon}

                <span>{label}</span>

            </div>

            <div className="flex items-center gap-2 font-semibold">

                {value ?? "-"}

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

            <div className="rounded-2xl border bg-white dark:bg-slate-900 p-8">

                <div className="text-center">

                    <h3 className="font-semibold">

                        No Credential Found

                    </h3>

                    <p className="text-sm text-slate-500 mt-2">

                        This customer has not yet been issued credentials.

                    </p>

                </div>

            </div>

        );

    }

    return (

        <div className="rounded-2xl border bg-white dark:bg-slate-900 shadow-sm">

            <div className="flex items-center justify-between px-6 py-5 border-b">

                <div>

                    <h2 className="font-bold text-lg">

                        {title}

                    </h2>

                    <p className="text-sm text-slate-500">

                        Authentication Details

                    </p>

                </div>

                <StatusBadge

                    status={credential.active ? "active" : "suspended"}


                />

            </div>

            <div className="p-6">

                <Row

                    icon={<User size={18}/>}

                    label="Username"

                    value={credential.username}

                    copy

                />

                <Row

                    icon={<Lock size={18}/>}

                    label="Password"

                    value={credential.password}

                    copy

                />

                {credential.mikrotik_name && (

                    <Row

                        icon={<Router size={18}/>}

                        label="Router"

                        value={credential.mikrotik_name}

                    />

                )}

                <Row

                    icon={<Calendar size={18}/>}

                    label="Created"

                    value={new Date(

                        credential.created_at

                    ).toLocaleDateString()}

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

}