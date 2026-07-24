import { Loader2 } from "lucide-react";

interface ActionFooterProps {
    submitting?: boolean;
    submitLabel?: string;
    cancelLabel?: string;
    disabled?: boolean;
    submitVariant?:
        | "primary"
        | "success"
        | "warning"
        | "danger";
    onCancel(): void;
    onSubmit(): void;
}

const VARIANT_CLASSES = {
    primary:
        "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500/20 dark:bg-blue-600 dark:hover:bg-blue-500",
    success:
        "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500/20 dark:bg-emerald-600 dark:hover:bg-emerald-500",
    warning:
        "bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-500/20 dark:bg-amber-600 dark:hover:bg-amber-500",
    danger:
        "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500/20 dark:bg-red-600 dark:hover:bg-red-500",
} as const;

export default function ActionFooter({
    submitting = false,
    submitLabel = "Confirm",
    cancelLabel = "Cancel",
    disabled = false,
    submitVariant = "primary",
    onCancel,
    onSubmit,
}: ActionFooterProps) {
    const isSubmitDisabled = submitting || disabled;

    return (
        <footer className="sticky bottom-0 z-10 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 sm:gap-4 border-t border-slate-200 bg-slate-50/90 px-4 py-3.5 sm:px-6 sm:py-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90">
            {/* Helper Hint Text */}
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center sm:text-left">
                Please review the information before continuing.
            </div>

            {/* Actions Button Group */}
            <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                <button
                    type="button"
                    disabled={submitting}
                    onClick={onCancel}
                    className="
                        flex-1 sm:flex-none
                        rounded-xl
                        border border-slate-300 dark:border-slate-700
                        bg-white dark:bg-slate-800
                        px-4 sm:px-5 py-2.5
                        text-xs sm:text-sm font-medium
                        text-slate-700 dark:text-slate-200
                        transition hover:bg-slate-50 dark:hover:bg-slate-700/60
                        focus:outline-none focus:ring-2 focus:ring-slate-400/20
                        disabled:cursor-not-allowed disabled:opacity-50
                    "
                >
                    {cancelLabel}
                </button>

                <button
                    type="button"
                    disabled={isSubmitDisabled}
                    onClick={onSubmit}
                    className={`
                        flex-1 sm:flex-none
                        flex items-center justify-center gap-2
                        rounded-xl
                        px-4 sm:px-5 py-2.5
                        text-xs sm:text-sm font-semibold
                        shadow-sm
                        transition
                        focus:outline-none focus:ring-2
                        disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-opacity-100
                        ${VARIANT_CLASSES[submitVariant]}
                    `}
                >
                    {submitting && (
                        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                    )}
                    <span>{submitting ? "Processing..." : submitLabel}</span>
                </button>
            </div>
        </footer>
    );
}