import React from "react";

interface CardProps {

    title: string;

    subtitle?: string;

    actions?: React.ReactNode;

    children: React.ReactNode;

}

export default function Card({

    title,

    subtitle,

    actions,

    children,

}: CardProps) {

    return (

        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">

            <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4">

                <div>

                    <h3 className="text-lg font-semibold text-gray-900">

                        {title}

                    </h3>

                    {subtitle && (

                        <p className="mt-1 text-sm text-gray-500">

                            {subtitle}

                        </p>

                    )}

                </div>

                {actions}

            </div>

            <div className="p-5">

                {children}

            </div>

        </section>

    );

}