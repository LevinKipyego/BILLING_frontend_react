import React from "react";

interface SummaryPanelProps {

    title?: string;

    children: React.ReactNode;

    className?: string;
}

export default function SummaryPanel({

    title = "Summary",

    children,

    className = "",

}: SummaryPanelProps) {

    return (

        <section

            className={`
                border-t border-gray-200
                bg-gray-50
                px-6
                py-5
                ${className}
            `}

        >

            <h3 className="mb-4 text-lg font-semibold">

                {title}

            </h3>

            {children}

        </section>

    );

}