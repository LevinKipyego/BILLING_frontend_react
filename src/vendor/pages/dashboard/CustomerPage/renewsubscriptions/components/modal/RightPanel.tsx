import React from "react";

interface RightPanelProps {

    children: React.ReactNode;

    sticky?: boolean;

    className?: string;
}

export default function RightPanel({

    children,

    sticky = true,

    className = "",

}: RightPanelProps) {

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