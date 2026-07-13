import { useMemo, useState } from "react";
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

    onSubmit: (
        payload: CreatePPPoEPayload
    ) => void;
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

    const [mikrotik, setMikrotik] =
        useState("");

    const [plan, setPlan] =
        useState("");

    

    const [activate, setActivate] =
        useState(true);

    const [pushRadius, setPushRadius] =
        useState(true);



    const router = useMemo(

        () =>

            mikrotiks.find(

                r => r.id === mikrotik

            ),

        [

            mikrotik,

            mikrotiks,

        ]

    );

    const formValid =
        mikrotik !== "" &&
        plan !== "";
        if (!open) return null;

    return (

        <>

            <div className="fixed inset-0 z-40 bg-black/40" />

            <div className="fixed right-0 top-0 z-50 h-screen w-full max-w-2xl overflow-y-auto bg-white shadow-2xl dark:bg-slate-900">

                {/* Header */}

                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6 py-5">

                    <div>

                        <h2 className="text-xl font-bold">

                            Create PPPoE User

                        </h2>

                        <p className="text-sm text-slate-500">

                            Provision a new PPPoE
                            account.

                        </p>

                    </div>

                    <button

                        onClick={onClose}

                        className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"

                    >

                        <X size={20} />

                    </button>

                </div>

                <div className="space-y-6 p-6">

                    {/* Customer */}

                    <div className="rounded-xl border border-slate-200 dark:border-slate-700">

                        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 px-5 py-4">

                            <User
                                size={18}
                            />

                            <h3 className="font-semibold">

                                Customer

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

                    {/* Network */}

                    <div className="rounded-xl border border-slate-200 dark:border-slate-700">

                        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 px-5 py-4">

                            <Router
                                size={18}
                            />

                            <h3 className="font-semibold">

                                Network

                            </h3>

                        </div>

                        <div className="grid gap-5 p-5">

                            <div>

                                <label className="mb-2 block text-sm font-medium">

                                    Mikrotik

                                </label>

                                <select

                                    value={mikrotik}

                                    onChange={e =>
                                        setMikrotik(
                                            e.target.value
                                        )
                                    }

                                    className="w-full rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-800"

                                >

                                    <option value="">

                                        Select Router

                                    </option>

                                    {mikrotiks.map(

                                        router => (

                                            <option

                                                key={router.id}

                                                value={router.id}

                                            >

                                                {

                                                    router.identity_name

                                                }

                                            </option>

                                        )

                                    )}

                                </select>

                            </div>

                            <div>

                                <label className="mb-2 block text-sm font-medium">

                                    Plan

                                </label>

                                <select

                                    value={plan}

                                    onChange={e =>
                                        setPlan(
                                            e.target.value
                                        )
                                    }

                                    className="w-full rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-800"

                                >

                                    <option value="">

                                        Select Plan

                                    </option>

                                    {plans.map(plan => (

                                        <option

                                            key={plan.id}

                                            value={plan.id}

                                        >

                                            {

                                                plan.name

                                            }

                                        </option>

                                    ))}

                                </select>

                            </div>

                        </div>

                    </div>

                    {/* Credentials */}

                    {/* Credentials */}

                    <div className="rounded-xl border border-slate-200 dark:border-slate-700">

                        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 px-5 py-4">

                            <Package size={18} />

                            <h3 className="font-semibold">

                                PPPoE Credentials

                            </h3>

                        </div>

                        <div className="space-y-4 p-5">

                            <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4">

                                <p className="text-sm font-medium">

                                    Username

                                </p>

                                <p className="mt-1 text-slate-500">

                                    Automatically generated by the server
                                    (Example: VGO000123)

                                </p>

                            </div>

                            <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4">

                                <p className="text-sm font-medium">

                                    Password

                                </p>

                                <p className="mt-1 text-slate-500">

                                    Automatically generated securely.

                                </p>

                            </div>

                            <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4">

                                <p className="text-sm font-medium">

                                    Radius Username

                                </p>

                                <p className="mt-1 text-slate-500">

                                    Generated as:

                                    <span className="font-semibold">

                                        {" "}
                                        VGO000123-{router?.identity_name ?? "Router"}

                                    </span>

                                </p>

                            </div>

                        </div>

                    </div>

                    
                    {/* Options */}

                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">

                        <label className="flex items-center gap-3">

                            <input

                                checked={activate}

                                onChange={() =>
                                    setActivate(
                                        !activate
                                    )
                                }

                                type="checkbox"

                            />

                            Activate immediately

                        </label>

                        <label className="flex items-center gap-3">

                            <input

                                checked={pushRadius}

                                onChange={() =>
                                    setPushRadius(
                                        !pushRadius
                                    )
                                }

                                type="checkbox"

                            />

                            Push to Radius

                        </label>

                    </div>

                </div>

                {/* Footer */}

                <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-5 dark:border-slate-700 dark:bg-slate-900">

                    <button

                        onClick={onClose}

                        className="rounded-xl border border-slate-300 px-6 py-3"

                    >

                        Cancel

                    </button>

                    <button

                        disabled={
                            !formValid ||
                            loading
                        }

                        onClick={() =>
                            onSubmit({

                                mikrotik_id: mikrotik,

                                plan_id: Number(plan),

                                activate,

                                push_radius: pushRadius,

                            })
                        }

                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white disabled:opacity-50"

                    >

                        <CheckCircle2
                            size={18}
                        />

                        Create PPPoE

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

            <p className="text-xs uppercase tracking-wide text-slate-500">

                {label}

            </p>

            <p className="mt-1 font-medium">

                {value}

            </p>

        </div>

    );

}