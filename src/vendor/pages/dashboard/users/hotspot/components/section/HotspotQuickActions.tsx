import { type FC, useMemo, useState } from "react";

import {
    Play,
    Pause,
    RefreshCw,
    KeyRound,
    Trash2,
    WifiOff,
} from "lucide-react";

import type { HotspotAccount } from "../../../components/types/types";

interface Props {
    accounts: HotspotAccount[];
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
        className="flex w-full items-start gap-3.5 sm:gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 text-left transition hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md"
    >
        <div className={`rounded-xl p-2.5 sm:p-3 shrink-0 ${color}`}>
            {icon}
        </div>

        <div className="min-w-0">
            <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                {title}
            </h3>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                {description}
            </p>
        </div>
    </button>
);

const HotspotQuickActions: FC<Props> = ({
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
        <section className="space-y-4 sm:space-y-5">
            <div>
                <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                    Quick Actions
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    Manage a Hotspot account.
                </p>
            </div>

            {accounts.length > 1 && (
                <div>
                    <label className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                        Select Account
                    </label>
                    <select
                        value={selected}
                        onChange={(e) =>
                            setSelected(Number(e.target.value))
                        }
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none transition-all"
                    >
                        {accounts.map((item, index) => (
                            <option
                                key={
                                    item.credential?.id ??
                                    index
                                }
                                value={index}
                                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
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
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4">
                    <div className="grid gap-3 sm:gap-4 md:grid-cols-2 text-xs sm:text-sm">
                        <div>
                            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                                Username
                            </p>
                            <p className="font-semibold text-slate-900 dark:text-white mt-0.5 truncate">
                                {account.credential?.username}
                            </p>
                        </div>

                        <div>
                            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                                Router
                            </p>
                            <p className="font-semibold text-slate-900 dark:text-white mt-0.5 truncate">
                                {account.connection?.router_name ?? "-"}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                <ActionButton
                    icon={<Play size={18} className="text-green-700 dark:text-green-400 sm:w-5 sm:h-5" />}
                    color="bg-green-100 dark:bg-green-900/30"
                    title="Activate Account"
                    description="Enable hotspot login."
                    onClick={() =>
                        console.log(
                            "Activate",
                            account?.credential?.id,
                        )
                    }
                />

                <ActionButton
                    icon={<Pause size={18} className="text-yellow-700 dark:text-yellow-400 sm:w-5 sm:h-5" />}
                    color="bg-yellow-100 dark:bg-yellow-900/30"
                    title="Suspend Account"
                    description="Temporarily disable hotspot access."
                    onClick={() =>
                        console.log(
                            "Suspend",
                            account?.credential?.id,
                        )
                    }
                />

                <ActionButton
                    icon={<RefreshCw size={18} className="text-blue-700 dark:text-blue-400 sm:w-5 sm:h-5" />}
                    color="bg-blue-100 dark:bg-blue-900/30"
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
                    icon={<KeyRound size={18} className="text-purple-700 dark:text-purple-400 sm:w-5 sm:h-5" />}
                    color="bg-purple-100 dark:bg-purple-900/30"
                    title="Reset Password"
                    description="Generate a new hotspot password."
                    onClick={() =>
                        console.log(
                            "Reset Password",
                            account?.credential?.id,
                        )
                    }
                />

                <ActionButton
                    icon={<WifiOff size={18} className="text-cyan-700 dark:text-cyan-400 sm:w-5 sm:h-5" />}
                    color="bg-cyan-100 dark:bg-cyan-900/30"
                    title="Disconnect Session"
                    description="Disconnect the selected session."
                    onClick={() =>
                        console.log(
                            "Disconnect",
                            account?.connection?.mac_address,
                        )
                    }
                />

                <ActionButton
                    icon={<Trash2 size={18} className="text-red-700 dark:text-red-400 sm:w-5 sm:h-5" />}
                    color="bg-red-100 dark:bg-red-900/30"
                    title="Delete Credential"
                    description="Remove this hotspot credential."
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

export default HotspotQuickActions;