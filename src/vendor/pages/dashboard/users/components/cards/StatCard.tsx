import React from "react";

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: React.ReactNode;
    color?: string;
}

export default function StatCard({
    title,
    value,
    subtitle,
    icon,
    color = "text-blue-600 dark:text-blue-400",
}: StatCardProps) {

    return (

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all">

            <div className="flex justify-between items-start">

                <div>

                    <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">

                        {title}

                    </p>

                    <h2 className="mt-2 text-lg font-black text-slate-900 dark:text-white">

                        {value}

                    </h2>

                    {subtitle && (

                        <p className="mt-2 text-xs text-slate-500">

                            {subtitle}

                        </p>

                    )}

                </div>

                {icon && (

                    <div className={`${color}`}>

                        {icon}

                    </div>

                )}

            </div>

        </div>

    );

}