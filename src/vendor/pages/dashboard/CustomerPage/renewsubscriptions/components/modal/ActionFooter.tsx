

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
        "bg-blue-600 hover:bg-blue-700 text-white",

    success:
        "bg-green-600 hover:bg-green-700 text-white",

    warning:
        "bg-amber-500 hover:bg-amber-600 text-white",

    danger:
        "bg-red-600 hover:bg-red-700 text-white",

};

export default function ActionFooter({

    submitting = false,

    submitLabel = "Confirm",

    cancelLabel = "Cancel",

    submitVariant = "primary",

    onCancel,

    onSubmit,

}: ActionFooterProps) {

    return (

        <footer className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">

            <div className="text-sm text-gray-500">

                Please review the information before continuing.

            </div>

            <div className="flex items-center gap-3">

                <button

                    type="button"

                    disabled={submitting}

                    onClick={onCancel}

                    className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"

                >

                    {cancelLabel}

                </button>

                <button

                    type="button"

                    disabled={submitting}

                    onClick={onSubmit}

                    className={`rounded-lg px-5 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASSES[submitVariant]}`}

                >

                    {submitting

                        ? "Processing..."

                        : submitLabel}

                </button>

            </div>

        </footer>

    );

}