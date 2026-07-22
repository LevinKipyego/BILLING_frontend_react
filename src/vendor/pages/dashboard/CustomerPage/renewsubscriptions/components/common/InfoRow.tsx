import React from "react";

import type { LucideIcon } from "lucide-react";

interface InfoRowProps {

    icon?: LucideIcon;

    label: string;

    value?: React.ReactNode;

    children?: React.ReactNode;

}

export default function InfoRow({

    icon: Icon,

    label,

    value,

    children,

}: InfoRowProps) {

    return (

        <div className="flex items-start gap-3">

            {Icon && (

                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">

                    <Icon className="h-4 w-4 text-gray-600" />

                </div>

            )}

            <div className="min-w-0 flex-1">

                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">

                    {label}

                </p>

                {children ?? (

                    <p className="mt-1 break-words text-sm font-medium text-gray-900">

                        {value ?? "-"}

                    </p>

                )}

            </div>

        </div>

    );

}