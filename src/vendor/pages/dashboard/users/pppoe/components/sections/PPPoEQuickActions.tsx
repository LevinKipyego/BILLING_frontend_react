import { type FC, useMemo, useState } from "react";

import {
    Play,
    Pause,
    RefreshCw,
    KeyRound,
    Trash2,
    Plus,
} from "lucide-react";

import type { PPPoEAccount } from "../../../components/types/types";

interface Props {
    accounts: PPPoEAccount[];
}

const ActionButton = ({
    icon,
    title,
    description,
    color,
    onClick,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
    onClick: () => void;
}) => (

    <button
        onClick={onClick}
        className="flex w-full items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-blue-500 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
    >

        <div className={`rounded-xl p-3 ${color}`}>
            {icon}
        </div>

        <div>

            <h3 className="font-semibold">
                {title}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
                {description}
            </p>

        </div>

    </button>

);

const PPPoEQuickActions: FC<Props> = ({
    accounts,
}) => {

    const [selected, setSelected] = useState(0);

    const account = useMemo(
        () => accounts[selected] ?? null,
        [accounts, selected],
    );

    if (accounts.length === 0) {
        return null;
    }

    return (

        <section className="space-y-5">

            <div>

                <h2 className="text-xl font-bold">
                    Quick Actions
                </h2>

                <p className="text-sm text-slate-500">
                    Manage a PPPoE account.
                </p>

            </div>

            {accounts.length > 1 && (

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Select Account
                    </label>

                    <select
                        value={selected}
                        onChange={(e) =>
                            setSelected(Number(e.target.value))
                        }
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5"
                    >

                        {accounts.map((item, index) => (

                            <option
                                key={
                                    item.credential?.id ??
                                    index
                                }
                                value={index}
                            >

                                {item.credential?.username}

                                {item.connection?.router_name
                                    ? ` • ${item.connection.router_name}`
                                    : ""}

                            </option>

                        ))}

                    </select>

                </div>

            )}

            {account && (

                <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4">

                    <div className="grid gap-2 md:grid-cols-2">

                        <div>

                            <p className="text-xs text-slate-500">
                                Username
                            </p>

                            <p className="font-semibold">
                                {account.credential?.username}
                            </p>

                        </div>

                        <div>

                            <p className="text-xs text-slate-500">
                                Router
                            </p>

                            <p className="font-semibold">
                                {account.connection?.router_name ?? "-"}
                            </p>

                        </div>

                    </div>

                </div>

            )}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                <ActionButton
                    icon={<Play size={20} className="text-green-700" />}
                    color="bg-green-100"
                    title="Activate Service"
                    description="Enable the selected PPPoE account."
                    onClick={() =>
                        console.log(
                            "Activate",
                            account?.credential?.id,
                        )
                    }
                />

                <ActionButton
                    icon={<Pause size={20} className="text-yellow-700" />}
                    color="bg-yellow-100"
                    title="Suspend Service"
                    description="Temporarily suspend internet access."
                    onClick={() =>
                        console.log(
                            "Suspend",
                            account?.credential?.id,
                        )
                    }
                />

                <ActionButton
                    icon={<RefreshCw size={20} className="text-blue-700" />}
                    color="bg-blue-100"
                    title="Renew Subscription"
                    description="Renew the selected subscription."
                    onClick={() =>
                        console.log(
                            "Renew",
                            account?.current_subscription?.id,
                        )
                    }
                />

                <ActionButton
                    icon={<KeyRound size={20} className="text-purple-700" />}
                    color="bg-purple-100"
                    title="Reset Password"
                    description="Generate a new PPPoE password."
                    onClick={() =>
                        console.log(
                            "Reset Password",
                            account?.credential?.id,
                        )
                    }
                />

                <ActionButton
                    icon={<Plus size={20} className="text-cyan-700" />}
                    color="bg-cyan-100"
                    title="Assign Package"
                    description="Assign a new PPPoE package."
                    onClick={() =>
                        console.log(
                            "Assign Package",
                            account?.credential?.id,
                        )
                    }
                />

                <ActionButton
                    icon={<Trash2 size={20} className="text-red-700" />}
                    color="bg-red-100"
                    title="Delete Credential"
                    description="Remove the selected PPPoE account."
                    onClick={() =>
                        console.log(
                            "Delete",
                            account?.credential?.id,
                        )
                    }
                />

            </div>

        </section>

    );

};

export default PPPoEQuickActions;