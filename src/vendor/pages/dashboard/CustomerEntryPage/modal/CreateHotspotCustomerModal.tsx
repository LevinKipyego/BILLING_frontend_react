import { X, Wifi } from "lucide-react";

import CustomerForm from "../components/CustomerForm";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function CreateHotspotCustomerModal({
    open,
    onClose,
}: Props) {
    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-lg rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-gray-800 px-5 py-4 bg-white/95 dark:bg-gray-900/95">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
                                <Wifi size={18} />
                            </div>

                            <div>
                                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                                    Create Hotspot Customer
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Register a new Hotspot customer.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-gray-800 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-5">
                        <CustomerForm
                            serviceType="HOTSPOT"
                            onSuccess={onClose}
                        />
                    </div>

                </div>
            </div>
        </>
    );
}