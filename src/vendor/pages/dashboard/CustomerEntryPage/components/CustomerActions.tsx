import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
    MoreVertical,
    Eye,
    Wifi,
    RefreshCcw,
    Ban,
    Trash2,
    Loader2,
    AlertTriangle,
    CheckCircle2,
    X,
} from "lucide-react";
import type { Customer } from "../types/types";

type RowAction = "suspend" | "delete";

interface Props {
    customer: Customer;
    onCreatePPPoE: (customer: Customer) => void;
    onView?: (customer: Customer) => void;
    onRenew?: (customer: Customer, responseData?: unknown) => void;
    onSuspend?: (customer: Customer, responseData?: unknown) => void;
    onDelete?: (customer: Customer, responseData?: unknown) => void;
    onActionSuccess?: (
        action: RowAction,
        customer: Customer,
        responseData?: unknown,
    ) => Promise<void> | void;
    onActionError?: (action: RowAction, message: string, responseData?: unknown) => void;
}

function getApiBaseUrl(): string {
    const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
    const base = env?.VITE_API_BASE_URL ?? env?.VITE_API_BASE ?? "";
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

async function parseResponseBody(response: Response): Promise<unknown> {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        return response.json();
    }
    const text = await response.text().catch(() => "");
    return text ? { message: text } : null;
}

function extractMessage(payload: unknown, fallback: string): string {
    if (payload && typeof payload === "object") {
        const obj = payload as { detail?: string; message?: string; error?: string };
        return obj.detail || obj.message || obj.error || fallback;
    }
    return fallback;
}

export default function CustomerActions({
    customer,
    onCreatePPPoE,
    onView,
    onRenew,
    onSuspend,
    onDelete,
    onActionSuccess,
    onActionError,
}: Props) {
    const [open, setOpen] = useState(false);
    const [openUpward, setOpenUpward] = useState(false);
    const [submitting, setSubmitting] = useState<RowAction | null>(null);
    const [isSuspended, setIsSuspended] = useState<boolean>(
        customer.active === false,
    );
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Delete confirmation modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteSuccessMsg, setDeleteSuccessMsg] = useState<string | null>(null);
    const [deleteErrorMsg, setDeleteErrorMsg] = useState<string | null>(null);
    const [deleteCompleted, setDeleteCompleted] = useState(false);

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsSuspended(customer.active === false);
    }, [customer.active]);

    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node) && !submitting) {
                setOpen(false);
                setErrorMsg(null);
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key !== "Escape") return;
            if (deleteModalOpen && submitting !== "delete") {
                setDeleteModalOpen(false);
                setDeleteSuccessMsg(null);
                setDeleteErrorMsg(null);
                setDeleteCompleted(false);
            } else if (open && !submitting) {
                setOpen(false);
                setErrorMsg(null);
            }
        }

        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, deleteModalOpen, submitting]);

    const toggleMenu = () => {
        if (!open && ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - rect.bottom;
            setOpenUpward(spaceBelow < 280);
            setErrorMsg(null);
        }
        setOpen((prev) => !prev);
    };

    const openDeleteConfirmation = () => {
        setOpen(false);
        setErrorMsg(null);
        setDeleteSuccessMsg(null);
        setDeleteErrorMsg(null);
        setDeleteCompleted(false);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        if (submitting === "delete") return;
        setDeleteModalOpen(false);
        setDeleteSuccessMsg(null);
        setDeleteErrorMsg(null);
        setDeleteCompleted(false);
    };

    const handleSuspendClick = async () => {
        if (submitting) return;
        setSubmitting("suspend");
        setErrorMsg(null);

        try {
            const url = `${getApiBaseUrl()}/api/customers/${customer.id}/suspend/`;
            const response = await fetch(url, {
                method: "POST",
                headers: buildAuthHeaders(),
                credentials: "include",
                body: JSON.stringify({}),
            });

            const data = await parseResponseBody(response);
            if (!response.ok) {
                throw new Error(
                    extractMessage(data, `Failed to suspend customer (${response.status}).`),
                );
            }

            setIsSuspended(true);
            onSuspend?.({ ...customer, active: false }, data);
            await onActionSuccess?.("suspend", customer, data);
            setOpen(false);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Could not suspend customer.";
            setErrorMsg(msg);
            onActionError?.("suspend", msg);
        } finally {
            setSubmitting(null);
        }
    };

    const handleConfirmDelete = async () => {
        if (submitting) return;
        setSubmitting("delete");
        setDeleteErrorMsg(null);
        setDeleteSuccessMsg(null);

        try {
            const url = `${getApiBaseUrl()}/api/customers/${customer.id}/delete/`;
            let response = await fetch(url, {
                method: "DELETE",
                headers: buildAuthHeaders(),
                credentials: "include",
            });

            // Fallback to POST if the Django view only allows POST for deletion
            if (response.status === 405) {
                response = await fetch(url, {
                    method: "POST",
                    headers: buildAuthHeaders(),
                    credentials: "include",
                    body: JSON.stringify({}),
                });
            }

            const data = await parseResponseBody(response);
            if (!response.ok) {
                throw new Error(
                    extractMessage(data, `Failed to delete customer (${response.status}).`),
                );
            }

            const backendMsg = extractMessage(
                data,
                `Customer "${customer.full_name}" was deleted successfully.`,
            );

            setDeleteSuccessMsg(backendMsg);
            setDeleteCompleted(true);

            // Notify parent so list/state updates immediately without manual reload
            onDelete?.(customer, data);
            await onActionSuccess?.("delete", customer, data);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Could not delete customer.";
            setDeleteErrorMsg(msg);
            onActionError?.("delete", msg);
        } finally {
            setSubmitting(null);
        }
    };

    const customerIdentifier =
        (customer as Customer & { username?: string }).username || `ID #${customer.id}`;

    return (
        <>
            <div ref={ref} className="relative inline-block">
                <button
                    type="button"
                    onClick={toggleMenu}
                    aria-label="Customer actions"
                    className="rounded-lg p-1.5 text-slate-500 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-gray-800 hover:text-slate-700 dark:hover:text-slate-200"
                >
                    <MoreVertical size={16} />
                </button>

                {open && (
                    <div
                        className={`absolute right-0 z-[9999] w-48 overflow-hidden rounded-lg border border-slate-200 dark:border-gray-700 bg-white shadow-lg dark:bg-gray-900 ${
                            openUpward
                                ? "bottom-full mb-1.5 origin-bottom"
                                : "top-full mt-1.5 origin-top"
                        }`}
                    >
                        {/* View */}
                        <MenuItem
                            icon={<Eye size={15} />}
                            label="View Customer"
                            disabled={Boolean(submitting)}
                            onClick={() => {
                                setOpen(false);
                                onView?.(customer);
                            }}
                        />

                        {/* PPPoE */}
                        {customer.service_type === "PPPOE" && customer.pppoe_created === false && (
                            <MenuItem
                                icon={<Wifi size={15} />}
                                label="Create PPPoE"
                                disabled={Boolean(submitting)}
                                onClick={() => {
                                    setOpen(false);
                                    onCreatePPPoE(customer);
                                }}
                            />
                        )}

                        <Divider />

                        {/* Renew */}
                        <MenuItem
                            icon={<RefreshCcw size={15} />}
                            label="Renew Subscription"
                            disabled={Boolean(submitting)}
                            onClick={() => {
                                setOpen(false);
                                onRenew?.(customer);
                            }}
                        />

                        {/* Suspend */}
                        <MenuItem
                            icon={
                                submitting === "suspend" ? (
                                    <Loader2 size={15} className="animate-spin" />
                                ) : (
                                    <Ban size={15} />
                                )
                            }
                            label={
                                submitting === "suspend"
                                    ? "Suspending..."
                                    : isSuspended
                                        ? "Suspended"
                                        : "Suspend"
                            }
                            danger
                            disabled={Boolean(submitting) || isSuspended}
                            onClick={() => void handleSuspendClick()}
                        />

                        {/* Delete (opens confirmation modal) */}
                        <MenuItem
                            icon={<Trash2 size={15} />}
                            label="Delete"
                            danger
                            disabled={Boolean(submitting)}
                            onClick={openDeleteConfirmation}
                        />

                        {errorMsg && (
                            <div className="border-t border-red-100 bg-red-50/80 px-3 py-2 text-[11px] font-medium text-red-600 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400">
                                {errorMsg}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Delete Confirmation & Backend Response Modal */}
            {deleteModalOpen &&
                typeof document !== "undefined" &&
                createPortal(
                    <div
                        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={`delete-modal-title-${customer.id}`}
                        onClick={closeDeleteModal}
                    >
                        <div
                            className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-slate-200 dark:border-gray-800 px-5 py-4">
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                                            deleteCompleted
                                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
                                                : "bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400"
                                        }`}
                                    >
                                        {deleteCompleted ? (
                                            <CheckCircle2 size={18} />
                                        ) : (
                                            <AlertTriangle size={18} />
                                        )}
                                    </div>
                                    <div>
                                        <h3
                                            id={`delete-modal-title-${customer.id}`}
                                            className="text-sm font-semibold text-slate-900 dark:text-white"
                                        >
                                            {deleteCompleted ? "Customer Deleted" : "Delete Customer"}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {customer.full_name} ({customerIdentifier})
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    disabled={submitting === "delete"}
                                    onClick={closeDeleteModal}
                                    aria-label="Close modal"
                                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-gray-800 dark:hover:text-slate-200 disabled:opacity-50"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="space-y-3.5 px-5 py-4 text-xs sm:text-sm">
                                {!deleteCompleted ? (
                                    <>
                                        <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                                            Are you sure you want to permanently delete{" "}
                                            <strong className="font-semibold text-slate-900 dark:text-white">
                                                {customer.full_name}
                                            </strong>
                                            ?
                                        </p>
                                        <div className="rounded-lg border border-amber-200/80 bg-amber-50/80 px-3.5 py-2.5 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
                                            This action cannot be undone. The customer record,
                                            associated credentials/subscriptions, and RADIUS/RouterOS
                                            access will be removed.
                                        </div>
                                    </>
                                ) : (
                                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-xs sm:text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-300">
                                        <p className="font-semibold">Backend Response</p>
                                        <p className="mt-1">{deleteSuccessMsg}</p>
                                    </div>
                                )}

                                {deleteErrorMsg && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-300">
                                        <p className="font-semibold">Deletion Failed</p>
                                        <p className="mt-0.5">{deleteErrorMsg}</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end gap-2.5 border-t border-slate-200 dark:border-gray-800 bg-slate-50/70 dark:bg-gray-900/80 px-5 py-3.5">
                                {!deleteCompleted ? (
                                    <>
                                        <button
                                            type="button"
                                            disabled={submitting === "delete"}
                                            onClick={closeDeleteModal}
                                            className="rounded-lg border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-gray-700 disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            disabled={submitting === "delete"}
                                            onClick={() => void handleConfirmDelete()}
                                            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {submitting === "delete" ? (
                                                <>
                                                    <Loader2 size={14} className="animate-spin" />
                                                    Deleting...
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2 size={14} />
                                                    Confirm Delete
                                                </>
                                            )}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={closeDeleteModal}
                                        className="rounded-lg bg-slate-900 dark:bg-blue-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-slate-800 dark:hover:bg-blue-700"
                                    >
                                        Done
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>,
                    document.body,
                )}
        </>
    );
}

interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
    danger?: boolean;
    disabled?: boolean;
    onClick: () => void;
}

function MenuItem({
    icon,
    label,
    danger = false,
    disabled = false,
    onClick,
}: MenuItemProps) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-xs transition hover:bg-slate-50 dark:hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 ${
                danger
                    ? "text-red-600 dark:text-red-400"
                    : "text-slate-700 dark:text-slate-200"
            }`}
        >
            <span className="shrink-0">{icon}</span>
            <span className="font-medium">{label}</span>
        </button>
    );
}

function Divider() {
    return (
        <div className="border-t border-slate-100 dark:border-gray-800" />
    );
}