import {
    Calendar,
    UserCircle2,
} from "lucide-react";

import StatusBadge from "../StatusBadge";

interface Props {

    title: string;

    status:
        | "active"
        | "expired"
        | "pending"
        | "suspended";

    plan?: string;

    username?: string;

    expires?: string | null;

}

export default function ServiceCard({

    title,

    status,

    plan,

    username,

    expires,

}: Props) {

    return (

        <div className="rounded-2xl border bg-white dark:bg-slate-900 p-6 shadow-sm">

            <div className="flex justify-between">

                <h2 className="text-lg font-bold">

                    {title}

                </h2>

                <StatusBadge status={status} />

            </div>

            <div className="mt-6 space-y-4">

                <div>

                    <p className="text-xs text-slate-500">

                        Current Plan

                    </p>

                    <p className="font-semibold">

                        {plan ?? "-"}

                    </p>

                </div>

                <div className="flex gap-2">

                    <UserCircle2 size={16}/>

                    {username ?? "-"}

                </div>

                <div className="flex gap-2">

                    <Calendar size={16}/>

                    {expires ?? "-"}

                </div>

            </div>

        </div>

    );

}