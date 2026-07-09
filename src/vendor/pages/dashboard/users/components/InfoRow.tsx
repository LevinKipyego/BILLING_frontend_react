import React from "react";

interface Props {

    icon?: React.ReactNode;

    label: string;

    value: React.ReactNode;

}

export default function InfoRow({

    icon,

    label,

    value,

}: Props) {

    return (

        <div className="flex items-center gap-3">

            {icon && (

                <div className="text-slate-500">

                    {icon}

                </div>

            )}

            <div>

                <p className="text-xs text-slate-500">

                    {label}

                </p>

                <p className="font-semibold text-slate-900 dark:text-slate-100">

                    {value}

                </p>

            </div>

        </div>

    );

}