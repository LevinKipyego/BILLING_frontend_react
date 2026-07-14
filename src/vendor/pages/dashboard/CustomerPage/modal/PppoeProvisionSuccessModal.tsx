import {

    CheckCircle2,

    Copy,

    User,

    Wifi,

    Key,

    Calendar,

    X,

} from "lucide-react";

interface Props {

    open: boolean;

    onClose: () => void;

    result: {

        customer: {

            full_name: string;

        };

        credential: {

            username: string;

            radius_username: string;

            password: string;

        };

        subscription: {

            plan: string;

            expires_at: string;

        };

    } | null;

}

export default function PPPoEProvisionSuccessModal({

    open,

    onClose,

    result,

}: Props) {

    if (!open || !result) return null;

    function copy(text: string) {

        navigator.clipboard.writeText(text);

    }

    function copyAll() {

        navigator.clipboard.writeText(

        `Customer: ${result.customer.full_name}

        Username: ${result.credential.username}

        Radius Username: ${result.credential.radius_username}

        Password: ${result.credential.password}

        Plan: ${result.subscription.plan}

        Expires: ${result.subscription.expires_at}`

            );

        }

        return (

            <>

                <div

                    className="fixed inset-0 z-50 bg-black/40"

                    onClick={onClose}

                />

                <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl dark:bg-slate-900">

                    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-700">

                        <div className="flex items-center gap-3">

                            <CheckCircle2

                                className="text-green-600"

                                size={28}

                            />

                            <div>

                                <h2 className="text-xl font-bold">

                                    PPPoE Account Created

                                </h2>

                                <p className="text-sm text-slate-500">

                                    Credentials generated successfully.

                                </p>

                            </div>

                        </div>

                        <button

                            onClick={onClose}

                        >

                            <X />

                        </button>

                    </div>

                    <div className="space-y-5 p-6">

                        <CredentialRow

                            icon={<User size={18}/>}

                            label="Customer"

                            value={result.customer.full_name}

                        />

                        <CredentialRow

                            icon={<Wifi size={18}/>}

                            label="Username"

                            value={result.credential.username}

                            copy={()=>

                                copy(

                                    result.credential.username

                                )

                            }

                        />

                        <CredentialRow

                            icon={<Wifi size={18}/>}

                            label="Radius Username"

                            value={result.credential.radius_username}

                            copy={()=>

                                copy(

                                    result.credential.radius_username

                                )

                            }

                        />

                        <CredentialRow

                            icon={<Key size={18}/>}

                            label="Password"

                            value={result.credential.password}

                            copy={()=>

                                copy(

                                    result.credential.password

                                )

                            }

                        />

                        <CredentialRow

                            icon={<Calendar size={18}/>}

                            label="Plan"

                            value={result.subscription.plan}

                        />

                        <CredentialRow

                            icon={<Calendar size={18}/>}

                            label="Expires"

                            value={result.subscription.expires_at}

                        />

                    </div>

                    <div className="flex justify-between border-t border-slate-200 px-6 py-5 dark:border-slate-700">

                        <button

                            onClick={copyAll}

                            className="flex items-center gap-2 rounded-xl border px-5 py-3"

                        >

                            <Copy size={16}/>

                            Copy Credentials

                        </button>

                        <button

                            onClick={onClose}

                            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white"

                        >

                            Done

                        </button>

                    </div>

                </div>

            </>

        );

    }

    interface RowProps {

        icon: React.ReactNode;

        label: string;

        value: string;

        copy?: ()=>void;

    }

    function CredentialRow({

        icon,

        label,

        value,

        copy,

    }: RowProps) {

        return (

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-800">

                <div className="flex items-center gap-3">

                    {icon}

                    <div>

                        <p className="text-xs uppercase text-slate-500">

                            {label}

                        </p>

                        <p className="font-semibold">

                            {value}

                        </p>

                    </div>

                </div>

                {

                    copy && (

                        <button

                            onClick={copy}

                            className="rounded-lg p-2 hover:bg-slate-200 dark:hover:bg-slate-700"

                        >

                            <Copy size={16}/>

                        </button>

                    )

                }

            </div>

        );

    }