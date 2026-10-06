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
    Loader2,
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
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            />

            {/* Drawer Container */}
            <div className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-lg flex-col bg-white shadow-2xl dark:bg-gray-900 border-l border-slate-200 dark:border-gray-800">
                
                {/* Fixed Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/95">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                            Create PPPoE Account
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Provision internet access for this customer.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-gray-800 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Independent Scrollable Body Content */}
                <div className="flex-1 overflow-y-auto space-y-4 p-5">
                    {/* Customer Info Card */}
                    <div className="rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-gray-800 px-4 py-3">
                            <User size={16} className="text-slate-500 dark:text-slate-400" />
                            <h3 className="text-xs font-semibold uppercase tracking-[0.07em] text-slate-700 dark:text-slate-200">
                                Customer Information
                            </h3>
                        </div>
                        <div className="grid gap-3 p-4 md:grid-cols-2">
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
                    <div className="rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-gray-800 px-4 py-3">
                            <Router size={16} className="text-slate-500 dark:text-slate-400" />
                            <h3 className="text-xs font-semibold uppercase tracking-[0.07em] text-slate-700 dark:text-slate-200">
                                Network Configuration
                            </h3>
                        </div>
                        <div className="space-y-4 p-4">
                            <div>
                                <label className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">
                                    MikroTik Router
                                </label>
                                <select
                                    value={mikrotik}
                                    onChange={(e) => setMikrotik(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800 py-2.5 px-3 text-xs text-slate-800 dark:text-slate-100 focus:border-slate-400 dark:focus:border-gray-500 focus:outline-none"
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
                                <label className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">
                                    Internet Plan
                                </label>
                                <select
                                    value={plan}
                                    onChange={(e) => setPlan(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800 py-2.5 px-3 text-xs text-slate-800 dark:text-slate-100 focus:border-slate-400 dark:focus:border-gray-500 focus:outline-none"
                                >
                                    <option value="">Select Plan</option>
                                    {plans.map((plan) => (
                                        <option key={plan.id} value={plan.id}>
                                            {plan.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedPlan && (
                                <div className="rounded-lg bg-slate-50 dark:bg-gray-800/60 p-3.5 text-xs border border-slate-200/60 dark:border-gray-700/60">
                                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                        <span>Price</span>
                                        <strong className="text-slate-900 dark:text-white font-mono">KES {selectedPlan.price}</strong>
                                    </div>
                                    <div className="mt-2 flex justify-between text-slate-600 dark:text-slate-400">
                                        <span>Duration</span>
                                        <strong className="text-slate-900 dark:text-white font-mono">
                                            {selectedPlan.duration_minutes} minutes
                                        </strong>
                                    </div>
                                </div>
                            )}
                        </div> 
                    </div> 

                    {/* Automatic Credentials Info */}
                    <div className="rounded-lg border border-blue-200 dark:border-blue-800/40 bg-blue-50/50 dark:bg-blue-900/10 p-4">
                        <div className="flex items-center gap-2 text-blue-800 dark:text-blue-400">
                            <Package size={16} />
                            <h3 className="text-xs font-semibold uppercase tracking-[0.07em]">
                                Automatic Credential Generation
                            </h3>
                        </div>
                        <p className="mt-2 text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                            The PPPoE username, password and Radius username are generated
                            securely by the server after the account is created.
                        </p>

                        {router && (
                            <div className="mt-3 rounded-lg border border-blue-100 dark:border-blue-800/30 bg-white dark:bg-gray-900 p-3">
                                <p className="text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">
                                    Radius Username Preview
                                </p>
                                <p className="mt-1 font-mono text-xs text-blue-700 dark:text-blue-400">
                                    VGO000001-{router.identity_name}
                                </p>
                                <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                                    This is only a preview. The actual username will be generated
                                    by the backend.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Provisioning Options */}
                    <div className="rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 space-y-3">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.07em] text-slate-700 dark:text-slate-200">
                            Provisioning Options
                        </h3>
                        <div className="space-y-3">
                            <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 dark:text-slate-300 text-xs">
                                <input
                                    type="checkbox"
                                    checked={activate}
                                    onChange={() => setActivate(!activate)}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 h-4 w-4"
                                />
                                <span className="font-medium">
                                    Activate account immediately
                                </span>
                            </label>

                            <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 dark:text-slate-300 text-xs">
                                <input
                                    type="checkbox"
                                    checked={pushRadius}
                                    onChange={() => setPushRadius(!pushRadius)}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 h-4 w-4"
                                />
                                <span className="font-medium">
                                    Push account to Radius
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Fixed Sticky Footer */}
                <div className="sticky bottom-0 z-10 flex justify-end gap-2 border-t border-slate-200 bg-white px-5 py-3.5 dark:border-gray-800 dark:bg-gray-900">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-lg border border-slate-200 dark:border-gray-700 px-4 py-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
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
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 size={15} className="animate-spin" />
                        ) : (
                            <CheckCircle2 size={15} />
                        )}
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
            <p className="text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">
                {label}
            </p>
            <p className="mt-1 font-medium text-slate-900 dark:text-white text-xs">
                {value}
            </p>
        </div>
    );
}