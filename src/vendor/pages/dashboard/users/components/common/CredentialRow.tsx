import type { ReactNode } from "react";

interface Props {

    label: string;

    value?: ReactNode;

    action?: ReactNode;

}

export default function CredentialRow({

    label,

    value,

    action,

}: Props) {

    return (

        <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700 last:border-b-0">

            <div>

                <p className="text-xs uppercase tracking-wide text-slate-500">

                    {label}

                </p>

                <div className="mt-1 font-semibold text-slate-900 dark:text-white">

                    {value ?? "-"}

                </div>

            </div>

            {action}

        </div>

    );

}