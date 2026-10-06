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

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await apiFetch("/customers/create/", {
                method: "POST",
                body: JSON.stringify({
                    full_name: fullName,
                    phone: normalizePhone(phone),
                    service_type: serviceType,
                }),
            });

            setFullName("");
            setPhone("");
            onSuccess?.();
        } catch (err: any) {
            setError(
                err?.message ?? "Unable to create customer."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                </div>
            )}

            {/* Full Name */}
            <div>
                <label className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">
                    Full Name
                </label>
                <div className="relative">
                    <User
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                    />
                    <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800 py-2.5 pl-9 pr-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors focus:border-slate-400 dark:focus:border-gray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none"
                    />
                </div>
            </div>

            {/* Phone */}
            <div>
                <label className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">
                    Phone Number
                </label>
                <div className="relative">
                    <Phone
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                    />
                    <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0712345678"
                        required
                        className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800 py-2.5 pl-9 pr-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors focus:border-slate-400 dark:focus:border-gray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none"
                    />
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                    Accepted formats: 0712345678, 712345678, 254712345678
                </p>
            </div>

            {/* Service */}
            <div>
                <label className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">
                    Service
                </label>
                <div className="rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800 px-3 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200">
                    {serviceType === "PPPOE" ? "PPPoE" : "Hotspot"}
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {loading && (
                        <Loader2 size={15} className="animate-spin" />
                    )}
                    Create Customer
                </button>
            </div>
        </form>
    );
}