import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    X,
    Router,
    Package,
    User,
    CheckCircle2,
} from "lucide-react";

interface Mikrotik {
    id: string;
    identity_name: string;
    api_ip: string;
}

interface Plan {
    id: number;
    name: string;
    price: string;
    duration_minutes: number;
}

interface Customer {
    id: number;
    full_name: string;
    phone: string;
    username: string;
}

export interface CreatePPPoEPayload {
    mikrotik_id: string;
    plan_id: number;
    activate: boolean;
    push_radius: boolean;
}

interface Props {
    open: boolean;
    onClose: () => void;
    customer: Customer;
    mikrotiks: Mikrotik[];
    plans: Plan[];
    loading?: boolean;
    onSubmit: (payload: CreatePPPoEPayload) => void;
}

export default function PPPoECreateDrawer({
    open,
    onClose,
    customer,
    mikrotiks,
    plans,
    loading = false,
    onSubmit,
}: Props) {
    const [mikrotik, setMikrotik] = useState("");
    const [plan, setPlan] = useState("");
    const [activate, setActivate] = useState(true);
    const [pushRadius, setPushRadius] = useState(true);

    useEffect(() => {
        if (!open) return;
        setMikrotik("");
        setPlan("");
        setActivate(true);
        setPushRadius(true);
    }, [open]);

    const router = useMemo(
        () => mikrotiks.find(r => r.id === mikrotik),
        [mikrotik, mikrotiks]
    );

    const selectedPlan = useMemo(
        () => plans.find(p => p.id === Number(plan)),
        [plan, plans]
    );

    const formValid = mikrotik !== "" && plan !== "";

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/40"
                onClick={onClose}
            />

            {/* Drawer Container - Changed to flex layout & removed height-destroying outer overflow */}
            <div className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-2xl flex-col bg-white shadow-2xl dark:bg-slate-900">
                
                {/* Fixed Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            Create PPPoE Account
                        </h2>
                        <p className="text-sm text-slate-500">
                            Provision internet access for this customer.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Independent Scrollable Body Content */}
                <div className="flex-1 overflow-y-auto space-y-6 p-6">
                    {/* Customer Info Card */}
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
                            <User size={18} className="text-slate-500" />
                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                Customer Information
                            </h3>
                        </div>
                        <div className="grid gap-4 p-5 md:grid-cols-2">
                            <Info
                                label="Full Name"
                                value={customer.full_name}
                            />
                            <Info
                                label="Phone"
                                value={customer.phone}
                            />
                        </div>
                    </div>

                    {/* Network Configuration Card */}
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
                            <Router size={18} className="text-slate-500" />
                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                Network Configuration
                            </h3>
                        </div>
                        <div className="space-y-5 p-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    MikroTik Router
                                </label>
                                <select
                                    value={mikrotik}
                                    onChange={(e) => setMikrotik(e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                >
                                    <option value="">Select Router</option>
                                    {mikrotiks.map((router) => (
                                        <option key={router.id} value={router.id}>
                                            {router.identity_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Internet Plan
                                </label>
                                <select
                                    value={plan}
                                    onChange={(e) => setPlan(e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                >
                                    <option value="">Select Plan</option>
                                    {plans.map((plan) => (
                                        <option key={plan.id} value={plan.id}>
                                            {plan.name }
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedPlan && (
                                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800 text-sm">
                                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                        <span>Price</span>
                                        <strong className="text-slate-900 dark:text-white">KES {selectedPlan.price}</strong>
                                    </div>
                                    <div className="mt-2 flex justify-between text-slate-600 dark:text-slate-400">
                                        <span>Duration</span>
                                        <strong className="text-slate-900 dark:text-white">
                                            {selectedPlan.duration_minutes} minutes
                                        </strong>
                                    </div>
                                </div>
                            )}
                        </div> 
                    </div> 

                    {/* Automatic Credentials Info */}
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-800/30 dark:bg-blue-900/20">
                        <div className="flex items-center gap-2 text-blue-800 dark:text-blue-400">
                            <Package size={18} />
                            <h3 className="font-semibold">
                                Automatic Credential Generation
                            </h3>
                        </div>
                        <p className="mt-3 text-sm text-blue-700 dark:text-blue-300">
                            The PPPoE username, password and Radius username are generated
                            securely by the server after the account is created.
                        </p>

                        {router && (
                            <div className="mt-4 rounded-lg border border-blue-100 bg-white p-4 dark:border-blue-800/30 dark:bg-slate-900">
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                    Radius Username Preview
                                </p>
                                <p className="mt-2 font-mono text-blue-700 dark:text-blue-400">
                                    VGO000001-{router.identity_name}
                                </p>
                                <p className="mt-2 text-xs text-slate-500">
                                    This is only a preview. The actual username will be generated
                                    by the backend.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Provisioning Options */}
                    <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-700">
                        <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
                            Provisioning Options
                        </h3>
                        <div className="space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer text-slate-700 dark:text-slate-300">
                                <input
                                    type="checkbox"
                                    checked={activate}
                                    onChange={() => setActivate(!activate)}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800"
                                />
                                <span className="text-sm font-medium">
                                    Activate account immediately
                                </span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer text-slate-700 dark:text-slate-300">
                                <input
                                    type="checkbox"
                                    checked={pushRadius}
                                    onChange={() => setPushRadius(!pushRadius)}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800"
                                />
                                <span className="text-sm font-medium">
                                    Push account to Radius
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Fixed Sticky Footer - Always visible on mobile */}
                <div className="sticky bottom-0 z-10 flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-5 dark:border-slate-700 dark:bg-slate-900">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={loading || !formValid}
                        onClick={() => {
                            if (loading) return;
                            onSubmit({
                                mikrotik_id: mikrotik,
                                plan_id: Number(plan),
                                activate,
                                push_radius: pushRadius,
                            });
                        }}
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <CheckCircle2 size={18} />
                        {loading ? "Creating..." : "Create PPPoE"}
                    </button>
                </div>
            </div>
        </>
    );
}

function Info({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {label}
            </p>
            <p className="mt-1 font-medium text-slate-900 dark:text-white">
                {value}
            </p>
        </div>
    );
}