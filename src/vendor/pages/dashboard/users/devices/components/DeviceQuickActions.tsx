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

    device: CurrentDevice | null;

}

export default function DeviceQuickActions({

    device,

}: Props) {

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
            className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
            {icon}

            {label}

        </button>

    );

    return (

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">

            <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-5">

                <h2 className="text-xl font-bold">

                    Quick Actions

                </h2>

                <p className="mt-1 text-sm text-slate-500">

                    Frequently used support actions.

                </p>

            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 p-6">

                <ActionButton

                    icon={<Copy size={18}/>}

                    label="Copy Username"

                    disabled={!device}

                    onClick={() =>

                        copy(device?.username)

                    }

                />

                <ActionButton

                    icon={<Globe size={18}/>}

                    label="Copy IP Address"

                    disabled={!device}

                    onClick={() =>

                        copy(device?.ip_address)

                    }

                />

                <ActionButton

                    icon={<Wifi size={18}/>}

                    label="Copy MAC Address"

                    disabled={!device}

                    onClick={() =>

                        copy(device?.mac_address)

                    }

                />

                <ActionButton

                    icon={<Router size={18}/>}

                    label="Copy Router"

                    disabled={!device}

                    onClick={() =>

                        copy(device?.router_name)

                    }

                />

                <ActionButton

                    icon={<RefreshCw size={18}/>}

                    label="Refresh Device"

                    onClick={() => {

                        // TODO

                    }}

                />

                <ActionButton

                    icon={<Power size={18}/>}

                    label="Disconnect Device"

                    disabled={!device}

                    onClick={() => {

                        // TODO

                    }}

                />

                <ActionButton

                    icon={<Ban size={18}/>}

                    label="Block Device"

                    disabled={!device}

                    onClick={() => {

                        // TODO

                    }}

                />

            </div>

        </div>

    );

}