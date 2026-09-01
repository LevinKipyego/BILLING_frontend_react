import { useState } from "react";
import { User, Phone, Loader2 } from "lucide-react";

import { apiFetch } from "../../../../api/client";

interface Props {

    serviceType: "HOTSPOT" | "PPPOE";

    onSuccess?: () => void;

}

export default function CustomerForm({

    serviceType,

    onSuccess,

}: Props) {

    const [fullName, setFullName] = useState("");

    const [phone, setPhone] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    function normalizePhone(value: string) {

        let phone = value.replace(/\D/g, "");

        if (phone.startsWith("0")) {

            phone = "254" + phone.substring(1);

        }

        if (phone.startsWith("7")) {

            phone = "254" + phone;

        }

        return phone;

    }

    async function handleSubmit(
        e: React.FormEvent
    ) {

        e.preventDefault();

        setLoading(true);

        setError(null);

        try {

            await apiFetch(

                "/customers/create/",

                {

                    method: "POST",

                    body: JSON.stringify({

                        full_name: fullName,

                        phone: normalizePhone(phone),

                        service_type: serviceType,

                        

                    }),

                }

            );

            setFullName("");

            setPhone("");

            onSuccess?.();

        } catch (err: any) {

            setError(

                err?.message ??

                "Unable to create customer."

            );

        } finally {

            setLoading(false);

        }

    }

    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >

            {error && (

                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20">

                    {error}

                </div>

            )}

            {/* Full Name */}

            <div>

                <label className="mb-2 block text-sm font-medium">

                    Full Name

                </label>

                <div className="relative">

                    <User
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input

                        value={fullName}

                        onChange={(e) =>
                            setFullName(
                                e.target.value
                            )
                        }

                        placeholder="John Doe"

                        required

                        className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 dark:border-slate-700 dark:bg-slate-800"

                    />

                </div>

            </div>

            {/* Phone */}

            <div>

                <label className="mb-2 block text-sm font-medium">

                    Phone Number

                </label>

                <div className="relative">

                    <Phone
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input

                        value={phone}

                        onChange={(e) =>
                            setPhone(
                                e.target.value
                            )
                        }

                        placeholder="0712345678"

                        required

                        className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 dark:border-slate-700 dark:bg-slate-800"

                    />

                </div>

                <p className="mt-2 text-xs text-slate-500">

                    Accepted formats:
                    0712345678,
                    712345678,
                    254712345678

                </p>

            </div>

            {/* Service */}

            <div>

                <label className="mb-2 block text-sm font-medium">

                    Service

                </label>

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">

                    {serviceType === "PPPOE"

                        ? "PPPoE"

                        : "Hotspot"}

                </div>

            </div>

            {/* Footer */}

            <div className="flex justify-end gap-3 pt-2">

                <button

                    type="submit"

                    disabled={loading}

                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"

                >

                    {loading && (

                        <Loader2
                            size={18}
                            className="animate-spin"
                        />

                    )}

                    Create Customer

                </button>

            </div>

        </form>

    );

}