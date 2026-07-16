import { useMemo, useState } from "react";

import {
    Copy,
    Globe,
    Router,
    Wifi,
    RefreshCw,
    Ban,
    Power,
} from "lucide-react";

import type { CurrentDevice } from "../../components/types/types";

interface Props {
    devices?: CurrentDevice[] | null;
}

export default function DeviceQuickActions({
    devices = [],
}: Props) {
    // Standardize optional/nullable list to a guaranteed array
    const safeDevices = devices ?? [];

    const [selected, setSelected] = useState(0);

    const device = useMemo(
        () => safeDevices[selected] ?? null,
        [safeDevices, selected]
    );

    const copy = async (text?: string | null) => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
        } catch (error) {
            console.error(error);
        }
    };

    const ActionButton = ({
        icon,
        label,
        onClick,
        disabled = false,
    }: {
        icon: React.ReactNode;
        label: string;
        onClick?: () => void;
        disabled?: boolean;
    }) => (
        <button
            disabled={disabled}
            onClick={onClick}
            className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-medium transition hover:bg-slate-50 dark:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        >
            <span className="text-slate-500 dark:text-slate-400 shrink-0">{icon}</span>
            <span className="text-slate-700 dark:text-slate-200">{label}</span>
        </button>
    );

    const hasDevices = safeDevices.length > 0;

    return (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
            <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-5">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Quick Actions
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Frequently used support actions.
                </p>
            </div>

            {/* Select dropdown element displayed only if there are active devices */}
            {hasDevices ? (
                <div className="px-6 pt-6">
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Select Device
                    </label>
                    <select
                        value={selected}
                        onChange={(e) => setSelected(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5 text-sm text-slate-900 dark:text-white"
                    >
                        {safeDevices.map((item, index) => (
                            <option
                                key={`${item.username}-${item.router?.id ?? index}-${index}`}
                                value={index}
                                className="dark:bg-slate-900 text-slate-900 dark:text-white"
                            >
                                {item.username} • {item.router?.name ?? "No Router"} • {item.service}
                            </option>
                        ))}
                    </select>
                </div>
            ) : (
                /* Dynamic Empty Notice State */
                <div className="mx-6 mt-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 px-5 py-4 text-center">
                    <p className="text-xs font-medium text-slate-500">
                        No active subscriber sessions or devices connected.
                    </p>
                </div>
            )}

            <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
                <ActionButton
                    icon={<Copy size={18} />}
                    label="Copy Username"
                    disabled={!device}
                    onClick={() => copy(device?.username)}
                />

                <ActionButton
                    icon={<Globe size={18} />}
                    label="Copy IP Address"
                    disabled={!device}
                    onClick={() => copy(device?.ip_address)}
                />

                <ActionButton
                    icon={<Wifi size={18} />}
                    label="Copy MAC Address"
                    disabled={!device}
                    onClick={() => copy(device?.mac_address)}
                />

                <ActionButton
                    icon={<Router size={18} />}
                    label="Copy Router"
                    disabled={!device}
                    onClick={() => copy(device?.router?.name)}
                />

                <ActionButton
                    icon={<RefreshCw size={18} />}
                    label="Refresh Device"
                    disabled={!device}
                    onClick={() => {
                        console.log("Refresh", device);
                    }}
                />

                <ActionButton
                    icon={<Power size={18} />}
                    label="Disconnect Device"
                    disabled={!device}
                    onClick={() => {
                        console.log("Disconnect", device);
                    }}
                />

                <ActionButton
                    icon={<Ban size={18} />}
                    label="Block Device"
                    disabled={!device}
                    onClick={() => {
                        console.log("Block", device);
                    }}
                />
            </div>
        </div>
    );
}