import { useEffect, useState } from "react";
import {
    Ban,
    Play,
    RefreshCw,
    WifiOff,
    MessageSquare,
    MapPinned,
    UserCog,
    CheckCircle2,
    AlertCircle,
    Undo2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import type { UserProfile } from "../types/types";
import QuickActionCard from "../cards/QuickActionCard";

type DirectActionKey = "suspend" | "resume" | "disconnect";

interface Props {
    profile: UserProfile;
    /**
     * Triggered after suspend, resume, or disconnect succeeds so parent state/profile can refresh.
     */
    onActionSuccess?: (action: DirectActionKey, data?: unknown) => Promise<void> | void;
    /**
     * Opens your renewal modal/drawer or renewal flow for this customer.
     * If omitted, navigates to `/customers/${profile.user.id}/renew`.
     */
    onOpenRenewal?: (profile: UserProfile) => void;
    /**
     * Optional SMS modal/drawer trigger.
     */
    onSendSmsClick?: () => void;
    /**
     * Optional map modal/drawer trigger.
     */
    onViewMapClick?: () => void;
}

function getApiBaseUrl(): string {
    const base =
        (import.meta as unknown as { env?: Record<string, string | undefined> })
            .env?.VITE_API_BASE_URL ??
        (import.meta as unknown as { env?: Record<string, string | undefined> })
            .env?.VITE_API_BASE ??
        "";
    return base.replace(/\/+$/, "");
}

function buildAuthHeaders(): HeadersInit {
    const token =
        localStorage.getItem("access_token") ||
        localStorage.getItem("token") ||
        "";

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
}

function inferStateFromProfile(profile: UserProfile): "suspend" | "resume" | null {
    const status = String(profile.overview?.status ?? "").toLowerCase();
    if (status === "suspended") return "suspend";
    if (status === "active" || status === "online") return "resume";
    return null;
}

export default function QuickActionsSection({
    profile,
    onActionSuccess,
    
    onSendSmsClick,
    onViewMapClick,
}: Props) {
    const navigate = useNavigate();

    const [loadingAction, setLoadingAction] = useState<DirectActionKey | null>(null);
    const [appliedAction, setAppliedAction] = useState<DirectActionKey | null>(() =>
        inferStateFromProfile(profile),
    );
    const [feedback, setFeedback] = useState<{
        type: "success" | "error";
        message: string;
        undoAction?: "suspend" | "resume";
    } | null>(null);

    useEffect(() => {
        const inferred = inferStateFromProfile(profile);
        if (inferred) {
            setAppliedAction(inferred);
        }
    }, [profile]);

    const customerId = profile.user.id;
    const hasService = profile.overview.active_services > 0;
    const isOnline = Boolean(profile.connection?.online);
    const isSuspended = appliedAction === "suspend";

    const executeCustomerAction = async (
        action: DirectActionKey,
        endpointPath: string,
        body?: Record<string, unknown>,
    ) => {
        if (loadingAction) return;

        setLoadingAction(action);
        setFeedback(null);

        try {
            const url = `${getApiBaseUrl()}${endpointPath}`;
            const response = await fetch(url, {
                method: "POST",
                headers: buildAuthHeaders(),
                credentials: "include",
                body: JSON.stringify(body ?? {}),
            });

            let payload: unknown = null;
            const contentType = response.headers.get("content-type") || "";
            if (contentType.includes("application/json")) {
                payload = await response.json();
            }

            if (!response.ok) {
                const errorMessage =
                    (payload as { detail?: string; message?: string; error?: string })
                        ?.detail ||
                    (payload as { detail?: string; message?: string; error?: string })
                        ?.message ||
                    (payload as { detail?: string; message?: string; error?: string })
                        ?.error ||
                    `Failed to ${action} customer (HTTP ${response.status}).`;
                throw new Error(errorMessage);
            }

            setAppliedAction(action);

            const successMessages: Record<DirectActionKey, string> = {
                suspend: "Customer service suspended. Resume is available to undo.",
                resume: "Customer service resumed. Suspend is available to undo.",
                disconnect: "Active session disconnected.",
            };

            const undoAction: "suspend" | "resume" | undefined =
                action === "suspend"
                    ? "resume"
                    : action === "resume"
                        ? "suspend"
                        : undefined;

            setFeedback({
                type: "success",
                message:
                    (payload as { message?: string; detail?: string })?.message ||
                    (payload as { message?: string; detail?: string })?.detail ||
                    successMessages[action],
                undoAction,
            });

            if (onActionSuccess) {
                await onActionSuccess(action, payload);
            }
        } catch (err) {
            setFeedback({
                type: "error",
                message:
                    err instanceof Error
                        ? err.message
                        : `Unable to complete ${action} action.`,
            });
        } finally {
            setLoadingAction(null);
        }
    };

    const handleUndo = () => {
        if (!feedback?.undoAction || loadingAction) return;
        const target = feedback.undoAction;
        void executeCustomerAction(
            target,
            `/api/customers/${customerId}/${target}/`,
        );
    };

   

    return (
        <section className="space-y-3 sm:space-y-5">
            <div>
                <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                    Operations
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    Frequently used customer management actions.
                </p>
            </div>

            {feedback && (
                <div
                    role="status"
                    className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm shadow-sm ${
                        feedback.type === "success"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-300"
                            : "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300"
                    }`}
                >
                    <div className="flex items-center gap-2 min-w-0">
                        {feedback.type === "success" ? (
                            <CheckCircle2 size={16} className="shrink-0" />
                        ) : (
                            <AlertCircle size={16} className="shrink-0" />
                        )}
                        <span className="font-medium">{feedback.message}</span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        {feedback.type === "success" && feedback.undoAction && (
                            <button
                                type="button"
                                disabled={Boolean(loadingAction)}
                                onClick={handleUndo}
                                className="inline-flex items-center gap-1 rounded-lg border border-current/25 bg-white/70 px-2.5 py-1 text-xs font-semibold transition hover:bg-white disabled:opacity-50 dark:bg-slate-900/60 dark:hover:bg-slate-900"
                            >
                                <Undo2 size={13} />
                                Undo ({feedback.undoAction === "resume" ? "Resume" : "Suspend"})
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => setFeedback(null)}
                            className="text-xs font-semibold opacity-75 hover:opacity-100"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}

            <div className="grid gap-3 sm:gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                <QuickActionCard
                    title={
                        loadingAction === "suspend"
                            ? "Suspending..."
                            : appliedAction === "suspend"
                                ? "Suspend • Applied"
                                : "Suspend"
                    }
                    description={
                        appliedAction === "resume"
                            ? "Suspend access (undo resume)."
                            : "Temporarily disable customer access."
                    }
                    icon={<Ban size={18} className="sm:w-5 sm:h-5" />}
                    color={
                        appliedAction === "suspend"
                            ? "bg-red-700 ring-2 ring-red-400/60"
                            : "bg-red-600"
                    }
                    disabled={!hasService || Boolean(loadingAction)}
                    onClick={() =>
                        void executeCustomerAction(
                            "suspend",
                            `/api/customers/${customerId}/suspend/`,
                        )
                    }
                />

                <QuickActionCard
                    title={
                        loadingAction === "resume"
                            ? "Resuming..."
                            : appliedAction === "resume"
                                ? "Resume • Applied"
                                : isSuspended
                                    ? "Resume (Undo Suspend)"
                                    : "Resume"
                    }
                    description={
                        isSuspended
                            ? "Undo suspension and restore access."
                            : "Restore customer connectivity."
                    }
                    icon={<Play size={18} className="sm:w-5 sm:h-5" />}
                    color={
                        appliedAction === "resume"
                            ? "bg-green-700 ring-2 ring-green-400/60"
                            : isSuspended
                                ? "bg-emerald-600 ring-2 ring-emerald-400/70"
                                : "bg-green-600"
                    }
                    disabled={Boolean(loadingAction)}
                    onClick={() =>
                        void executeCustomerAction(
                            "resume",
                            `/api/customers/${customerId}/resume/`,
                        )
                    }
                />

                <QuickActionCard
                    title={
                        loadingAction === "disconnect"
                            ? "Disconnecting..."
                            : appliedAction === "disconnect"
                                ? "Disconnect • Applied"
                                : "Disconnect"
                    }
                    description="Terminate current online session."
                    icon={<WifiOff size={18} className="sm:w-5 sm:h-5" />}
                    color={
                        appliedAction === "disconnect"
                            ? "bg-orange-600 ring-2 ring-orange-400/60"
                            : "bg-orange-500"
                    }
                    disabled={(!hasService && !isOnline) || Boolean(loadingAction)}
                    onClick={() =>
                        void executeCustomerAction(
                            "disconnect",
                            `/api/customers/${customerId}/disconnect/`,
                        )
                    }
                />

                <QuickActionCard
                    title="Renew Package"
                    description="Configure plan and renew subscription."
                    icon={<RefreshCw size={18} className="sm:w-5 sm:h-5" />}
                    color="bg-blue-600"
                    disabled={Boolean(loadingAction)}
                   onClick={() => navigate(`pppoe/subscription/list`)}
                />

                <QuickActionCard
                    title="Send SMS"
                    description="Notify the customer."
                    icon={<MessageSquare size={18} className="sm:w-5 sm:h-5" />}
                    color="bg-purple-600"
                    disabled={!profile.user.phone || Boolean(loadingAction)}
                    onClick={() => {
                        if (onSendSmsClick) {
                            onSendSmsClick();
                        }
                    }}
                />

                <QuickActionCard
                    title="View on Map"
                    description="Open customer location."
                    icon={<MapPinned size={18} className="sm:w-5 sm:h-5" />}
                    color="bg-cyan-600"
                    disabled={Boolean(loadingAction)}
                    onClick={() => {
                        if (onViewMapClick) {
                            onViewMapClick();
                        }
                    }}
                />

                <QuickActionCard
                    title="Manage Account"
                    description="Open advanced settings."
                    icon={<UserCog size={18} className="sm:w-5 sm:h-5" />}
                    color="bg-slate-700"
                    disabled={Boolean(loadingAction)}
                    onClick={() => navigate(`/users/${profile.user.id}/edit`)}
                />
            </div>
        </section>
    );
}