import React from "react";

interface Props {

    title: string;

    value: string | number;

    icon?: React.ReactNode;

    footer?: React.ReactNode;

    subtitle?: string;

}
export default function SummaryCard({

    title,

    value,

    icon,

    footer,
}: Props) {

    return (

        <div className="flex items-center justify-between">

            <div>

                <p className="text-xs uppercase tracking-wide text-slate-500">
                    {title}
                </p>

                <h3 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white">
                    {value}
                </h3>

                {footer && (
                    <div className="mt-4">
                        {footer}
                    </div>
                )}

            </div>

            {icon && (
                <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-3 text-blue-600 dark:text-blue-400">
                    {icon}
                </div>
            )}

        </div>

    );

}