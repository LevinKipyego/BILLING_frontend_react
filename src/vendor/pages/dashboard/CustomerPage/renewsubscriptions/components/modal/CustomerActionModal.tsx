import {
    useEffect,
    type ReactNode,
} from "react";

import type {
    LucideIcon,
} from "lucide-react";

import ActionHeader from "./ActionHeader";
import ActionFooter from "./ActionFooter";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import SummaryPanel from "./SummaryPanel";

export interface CustomerActionModalProps {

    open: boolean;

    title: string;

    subtitle?: string;

    icon?: LucideIcon;

    service?: string;

    status?: string;

    loading?: boolean;

    submitting?: boolean;

    disabled?: boolean;

    submitLabel?: string;

    cancelLabel?: string;

    size?: "lg" | "xl" | "2xl";

    left?: ReactNode;

    right?: ReactNode;

    summary?: ReactNode;

    footer?: ReactNode;

    onClose(): void;

    onSubmit(): void;

}

const SIZE_CLASSES = {

    lg: "max-w-5xl",

    xl: "max-w-6xl",

    "2xl": "max-w-7xl",

} as const;

export default function CustomerActionModal({

    open,

    title,

    subtitle,

    icon,

    

    loading = false,

    submitting = false,

    disabled = false,

    submitLabel = "Confirm",

    cancelLabel = "Cancel",

    size = "2xl",

    left,

    right,

    summary,

    footer,

    onClose,

    onSubmit,

}: CustomerActionModalProps) {

    useEffect(() => {

        if (!open) {

            return;

        }

        const handleKeyDown = (

            event: KeyboardEvent,

        ) => {

            if (event.key === "Escape") {

                onClose();

            }

        };

        document.body.style.overflow = "hidden";

        window.addEventListener(

            "keydown",

            handleKeyDown,

        );

        return () => {

            document.body.style.overflow = "";

            window.removeEventListener(

                "keydown",

                handleKeyDown,

            );

        };

    }, [

        open,

        onClose,

    ]);

    if (!open) {

        return null;

    }

    return (

        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-action-modal-title"
        >

            <div
                className={`
                    flex
                    w-full
                    ${SIZE_CLASSES[size]}
                    max-h-[95vh]
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    bg-white
                    shadow-2xl
                `}
            >

                <ActionHeader

                    title={title}

                    subtitle={subtitle}

                    icon={icon}

                   

                    loading={loading}

                    onClose={onClose}

                />

                <div className="flex-1 overflow-y-auto">

                    <div className="grid gap-6 p-6 lg:grid-cols-[1fr_420px]">

                        <LeftPanel>

                            {left}

                        </LeftPanel>

                        <RightPanel>

                            {right}

                        </RightPanel>

                    </div>

                    {summary && (

                        <SummaryPanel title="Action Summary">

                            {summary}

                        </SummaryPanel>

                    )}

                </div>

                {footer ?? (

                    <ActionFooter

                        submitting={submitting}

                        disabled={

                            disabled ||

                            loading

                        }

                        submitLabel={submitLabel}

                        cancelLabel={cancelLabel}

                        onCancel={onClose}

                        onSubmit={onSubmit}

                    />

                )}

            </div>

        </div>

    );

}