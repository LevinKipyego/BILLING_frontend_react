import {
    CheckCircle2,
    Copy,
    User,
    Wifi,
    Key,
    Calendar,
    X,
} from "lucide-react";

import type {
    PPPoEProvisionResponse,
} from "../types/types";

interface Props {
    open: boolean;
    onClose: () => void;
    result: PPPoEProvisionResponse | null;
}

export default function PPPoEProvisionSuccessModal({
    open,
    onClose,
    result,
}: Props) {
    if (!open || !result) {
        return null;
    }

    function copy(text: string) {
        navigator.clipboard.writeText(text);
    }

    const provision = result;

    function copyAll() {
        navigator.clipboard.writeText(
            `Customer: ${provision.customer.full_name}\n` +
            `Username: ${provision.credential.username}\n` +
            `Password: ${provision.credential.password}\n` +
            `Plan: ${provision.subscription.plan.name}`
        );
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-gray-800 px-5 py-4 bg-white/95 dark:bg-gray-900/95">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 size={18} />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                                PPPoE Account Created
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Credentials generated successfully.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-gray-800 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body Content */}
                <div className="space-y-3 p-5">
                    <CredentialRow
                        icon={<User size={15} />}
                        label="Customer"
                        value={result.customer.full_name}
                    />

                    <CredentialRow
                        icon={<Wifi size={15} />}
                        label="Username"
                        value={result.credential.username}
                        copy={() => copy(result.credential.username)}
                    />

                    <CredentialRow
                        icon={<Wifi size={15} />}
                        label="Radius Username"
                        value={result.credential.username}
                        copy={() => copy(result.credential.username)}
                    />

                    <CredentialRow
                        icon={<Key size={15} />}
                        label="Password"
                        value={result.credential.password}
                        copy={() => copy(result.credential.password)}
                    />

                    <CredentialRow
                        icon={<Calendar size={15} />}
                        label="Plan"
                        value={result.subscription.plan.name}
                    />

                    <CredentialRow
                        icon={<Calendar size={15} />}
                        label="Expires"
                        value={result.subscription.end_at}
                    />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-slate-200 dark:border-gray-800 px-5 py-3.5 bg-white dark:bg-gray-900">
                    <button
                        onClick={copyAll}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-gray-700"
                    >
                        <Copy size={15} />
                        Copy Credentials
                    </button>

                    <button
                        onClick={onClose}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700"
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
    copy?: () => void;
}

function CredentialRow({
    icon,
    label,
    value,
    copy,
}: RowProps) {
    return (
        <div className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-gray-800/60 p-3 border border-slate-200/60 dark:border-gray-700/60">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <span className="text-slate-400 dark:text-slate-500 shrink-0">
                    {icon}
                </span>
                <div className="min-w-0">
                    <p className="text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">
                        {label}
                    </p>
                    <p className="font-medium text-slate-800 dark:text-slate-100 text-xs truncate font-mono mt-0.5">
                        {value}
                    </p>
                </div>
            </div>

            {copy && (
                <button
                    onClick={copy}
                    title="Copy value"
                    className="rounded-md p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-gray-700 transition-colors shrink-0"
                >
                    <Copy size={14} />
                </button>
            )}
        </div>
    );
}