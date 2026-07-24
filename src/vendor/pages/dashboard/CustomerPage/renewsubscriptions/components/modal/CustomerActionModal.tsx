import { useEffect, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

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
    lg: "max-w-4xl",
    xl: "max-w-5xl",
    "2xl": "max-w-6xl",
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
        if (!open) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 p-0 sm:p-4 md:p-6 backdrop-blur-sm transition-opacity"
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-action-modal-title"
        >
            {/* Modal Backdrop Click Handler */}
            <div 
                className="absolute inset-0 -z-10" 
                onClick={onClose} 
                aria-hidden="true" 
            />

            {/* Main Modal Card */}
            <div
                className={`
                    relative
                    flex
                    w-full
                    ${SIZE_CLASSES[size]}
                    h-[92vh]
                    sm:h-auto
                    max-h-[92vh]
                    flex-col
                    overflow-hidden
                    rounded-t-2xl
                    sm:rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-2xl
                    transition-all
                    dark:border-slate-800
                    dark:bg-slate-900
                `}
            >
                {/* Header (Sticky Top) */}
                <ActionHeader
                    title={title}
                    subtitle={subtitle}
                    icon={icon}
                    loading={loading}
                    onClose={onClose}
                />

                {/* Main Content Area - Scrollable */}
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                    <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_420px]">
                        {left && (
                            <LeftPanel>
                                {left}
                            </LeftPanel>
                        )}

                        {right && (
                            <RightPanel>
                                {right}
                            </RightPanel>
                        )}
                    </div>

                    {summary && (
                        <div className="bg-slate-50/50 p-4 sm:p-6 dark:bg-slate-950/30">
                            <SummaryPanel title="Action Summary">
                                {summary}
                            </SummaryPanel>
                        </div>
                    )}
                </div>

                {/* Footer Controls (Sticky Bottom) */}
                {footer ?? (
                    <ActionFooter
                        submitting={submitting}
                        disabled={disabled || loading}
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