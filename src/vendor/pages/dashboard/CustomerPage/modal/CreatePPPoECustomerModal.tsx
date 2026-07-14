import { X, Router } from "lucide-react";

import CustomerForm from "../components/CustomerForm";

interface Props {

    open: boolean;

    onClose: () => void;

}

export default function CreatePPPoECustomerModal({

    open,

    onClose,

}: Props) {

    if (!open) return null;

    return (

        <>

            <div
                className="fixed inset-0 z-40 bg-black/50"
                onClick={onClose}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">

                <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl dark:bg-slate-900">

                    {/* Header */}

                    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-700">

                        <div className="flex items-center gap-3">

                            <div className="rounded-xl bg-emerald-100 p-3 dark:bg-emerald-900/30">

                                <Router
                                    className="text-emerald-600"
                                    size={22}
                                />

                            </div>

                            <div>

                                <h2 className="text-xl font-bold">

                                    Create PPPoE Customer

                                </h2>

                                <p className="text-sm text-slate-500">

                                    Register a new PPPoE customer.

                                </p>

                            </div>

                        </div>

                        <button
                            onClick={onClose}
                            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >

                            <X size={20} />

                        </button>

                    </div>

                    <div className="p-6">

                        <CustomerForm

                            serviceType="PPPOE"

                            onSuccess={onClose}

                        />

                    </div>

                </div>

            </div>

        </>

    );

}