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
                flex flex-col w-full min-w-0
                space-y-4 sm:space-y-6
                ${sticky ? "lg:sticky lg:top-6 self-start" : ""}
                ${className}
            `}
        >
            {children}
        </div>
    );
}