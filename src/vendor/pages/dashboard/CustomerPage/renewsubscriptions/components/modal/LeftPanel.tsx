import React from "react";

interface LeftPanelProps {

    children: React.ReactNode;

    sticky?: boolean;

    className?: string;
}

export default function LeftPanel({

    children,

    sticky = false,

    className = "",

}: LeftPanelProps) {

    return (

        <div

            className={`
                space-y-6
                ${sticky ? "lg:sticky lg:top-6 self-start" : ""}
                ${className}
            `}

        >

            {children}

        </div>

    );

}