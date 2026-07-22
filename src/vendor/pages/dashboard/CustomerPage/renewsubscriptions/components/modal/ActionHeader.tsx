import {
    Loader2,
    X,
} from "lucide-react";

import type {
    LucideIcon,
} from "lucide-react";

interface ActionHeaderProps {

    title: string;

    subtitle?: string;

    icon?: LucideIcon;

    loading?: boolean;

    onClose(): void;

}

export default function ActionHeader({

    title,

    subtitle,

    icon: Icon,

    loading = false,

    onClose,

}: ActionHeaderProps) {

    return (

        <header className="border-b border-gray-200 bg-white">

            <div className="flex items-start justify-between p-6">

                <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">

                        {loading ? (

                            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />

                        ) : Icon ? (

                            <Icon className="h-6 w-6 text-blue-600" />

                        ) : null}

                    </div>

                    <div>

                        <h2
                            id="customer-action-modal-title"
                            className="text-xl font-semibold text-gray-900"
                        >

                            {title}

                        </h2>

                        {subtitle && (

                            <p className="mt-1 text-sm text-gray-500">

                                {subtitle}

                            </p>

                        )}

                    </div>

                </div>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close dialog"
                    className="
                        rounded-lg
                        p-2
                        transition-colors
                        hover:bg-gray-100
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500
                    "
                >

                    <X className="h-5 w-5 text-gray-500" />

                </button>

            </div>

        </header>

    );

}