import { useState } from "react";
import { Wifi, Router } from "lucide-react";

type ServiceType = "HOTSPOT" | "PPPOE" | null;

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function CreateCustomerModal({
    open,
    onClose,
}: Props) {

    const [service, setService] = useState<ServiceType>(null);

    if (!open) return null;

    if (service === "HOTSPOT") {
        return (
            <CreateHotspotCustomer
                onBack={() => setService(null)}
                onClose={onClose}
            />
        );
    }

    if (service === "PPPOE") {
        return (
            <CreatePPPoECustomer
                onBack={() => setService(null)}
                onClose={onClose}
            />
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

            <div className="w-full max-w-xl rounded-3xl bg-white p-8 dark:bg-slate-900">

                <h2 className="text-2xl font-bold">
                    Create Customer
                </h2>

                <p className="mt-2 text-slate-500">
                    Select the service you want to provision.
                </p>

                <div className="mt-8 space-y-4">

                    <button
                        onClick={() => setService("HOTSPOT")}
                        className="w-full rounded-2xl border p-6 text-left hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                        <div className="flex items-center gap-4">

                            <Wifi size={28} />

                            <div>

                                <h3 className="font-semibold">
                                    Hotspot Customer
                                </h3>

                                <p className="text-sm text-slate-500">
                                    WiFi hotspot account with vouchers or packages.
                                </p>

                            </div>

                        </div>

                    </button>

                    <button
                        onClick={() => setService("PPPOE")}
                        className="w-full rounded-2xl border p-6 text-left hover:border-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                        <div className="flex items-center gap-4">

                            <Router size={28} />

                            <div>

                                <h3 className="font-semibold">
                                    PPPoE Customer
                                </h3>

                                <p className="text-sm text-slate-500">
                                    Dedicated broadband subscriber with PPPoE credentials.
                                </p>

                            </div>

                        </div>

                    </button>

                </div>

                <div className="mt-8 flex justify-end">

                    <button
                        onClick={onClose}
                        className="rounded-xl border px-4 py-2"
                    >
                        Cancel
                    </button>

                </div>

            </div>

        </div>
    );
}