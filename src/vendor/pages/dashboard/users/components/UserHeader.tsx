import {
    ArrowLeft,
    Calendar,
    Mail,
    Phone,
    RefreshCw,
    Wallet,
    ShoppingBag,
    Radio,
    Clock,
    Copy,
    Check,
    Pencil,
    Save,
    X,
    MapPin,
    UserRound,
    Building2,
    ShieldCheck,
    AtSign,
    House,
    Layers3,
    Image,
    LoaderCircle,
    CheckCircle2,
    AlertCircle,
    ChevronDown,
} from "lucide-react";

import {
    useEffect,
    useState,
    type ReactNode,
} from "react";

import { useNavigate } from "react-router-dom";

import type { User, Overview } from "./types/types";
import { formatDate } from "../../CustomerEntryPage/renewsubscriptions/utils/date";
import StatCard from "./cards/StatCard";
import StatusBadge from "./StatusBadge";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type EditableUserField =
    | "full_name"
    | "username"
    | "phone"
    | "email"
    | "county"
    | "location"
    | "address"
    | "building"
    | "floor"
    | "house_no"
    | "active"
    | "avatar";

type EditableUserValue = string | boolean | null;

export interface CustomerPatchRequestOptions {
    endpointBase?: string;
    headers?: HeadersInit;
    reloadAfterSave?: boolean;
}

export async function patchCustomerField(
    customerId: number | string,
    field: EditableUserField,
    value: EditableUserValue,
    options: CustomerPatchRequestOptions = {},
): Promise<void> {
    const endpointBase = options.endpointBase ?? "/api/customers";
    const normalizedBase = endpointBase.replace(/\/+$/, "");
    const url = `${normalizedBase}/${customerId}/`;

    const response = await fetch(url, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        body: JSON.stringify({
            [field]: value,
        }),
    });

    if (!response.ok) {
        let message = `Failed to update ${field} (HTTP ${response.status}).`;
        try {
            const data = await response.json();
            if (typeof data?.detail === "string" && data.detail.trim()) {
                message = data.detail;
            } else if (typeof data?.message === "string" && data.message.trim()) {
                message = data.message;
            } else if (data && typeof data === "object") {
                const fieldErr = data[field];
                if (Array.isArray(fieldErr) && fieldErr.length > 0) {
                    message = String(fieldErr[0]);
                } else if (typeof fieldErr === "string" && fieldErr.trim()) {
                    message = fieldErr;
                }
            }
        } catch {
            // Keep fallback HTTP error message
        }
        throw new Error(message);
    }
}

interface Props {
    user: User;
    overview: Overview;
    reload: () => Promise<void>;

    /**
     * Optional custom field saver. When omitted, UserHeader sends a PATCH
     * request to `/api/customers/<user.id>/` and keeps the panel open
     * with the saved value visible immediately.
     */
    onSaveField?: (
        field: EditableUserField,
        value: EditableUserValue,
    ) => Promise<void>;

    endpointBase?: string;
    headers?: HeadersInit;
    reloadAfterSave?: boolean;
}

interface EditableFieldProps {
    field: EditableUserField;
    label: string;
    value: string | boolean | null | undefined;
    icon: ReactNode;
    onSave: (
        field: EditableUserField,
        value: EditableUserValue,
    ) => Promise<void>;
    inputType?: "text" | "email" | "tel" | "url";
    placeholder?: string;
}

/* -------------------------------------------------------------------------- */
/* Editable Field                                                             */
/* -------------------------------------------------------------------------- */

function EditableField({
    field,
    label,
    value,
    icon,
    onSave,
    inputType = "text",
    placeholder,
}: EditableFieldProps) {
    const initialValue: string | boolean =
        typeof value === "boolean" ? value : value ?? "";

    const [savedValue, setSavedValue] =
        useState<string | boolean>(initialValue);

    const [draft, setDraft] =
        useState<string | boolean>(initialValue);

    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [justSaved, setJustSaved] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    // Keep local values synchronized when the parent receives fresh API data,
    // without clobbering an active edit or recently saved local value.
    useEffect(() => {
        if (editing || saving) {
            return;
        }

        const nextValue: string | boolean =
            typeof value === "boolean" ? value : value ?? "";

        setSavedValue(nextValue);
        setDraft(nextValue);
    }, [value, editing, saving]);

    const displayValue =
        typeof savedValue === "boolean"
            ? savedValue
                ? "Active"
                : "Inactive"
            : savedValue.trim() || "Not provided";

    const startEditing = () => {
        setDraft(savedValue);
        setEditing(true);
        setJustSaved(false);
        setError("");
    };

    const cancelEditing = () => {
        setDraft(savedValue);
        setEditing(false);
        setError("");
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");
        setJustSaved(false);

        try {
            const valueToSave: EditableUserValue =
                field === "active"
                    ? Boolean(draft)
                    : field === "avatar" && draft === ""
                        ? null
                        : String(draft).trim();

            await onSave(field, valueToSave);

            const normalizedSaved = valueToSave === null ? "" : valueToSave;
            setSavedValue(normalizedSaved);
            setDraft(normalizedSaved);
            setEditing(false);
            setJustSaved(true);
            window.setTimeout(() => setJustSaved(false), 2000);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Could not save this field. Please try again.",
            );
        } finally {
            setSaving(false);
        }
    };

    const handleCopy = async () => {
        if (
            typeof savedValue !== "string" ||
            !savedValue.trim()
        ) {
            return;
        }

        try {
            await navigator.clipboard.writeText(savedValue);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
        } catch {
            setError("Could not copy to clipboard.");
        }
    };

    return (
        <div className="group min-w-0 rounded-xl border border-slate-200/80 bg-white p-2.5 sm:p-3 transition-colors hover:border-sky-200 hover:bg-sky-50/30 dark:border-slate-700 dark:bg-slate-900/70 dark:hover:border-sky-900 dark:hover:bg-slate-800/70">
            <div className="flex min-w-0 items-start gap-2">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-100 to-emerald-50 text-sky-700 dark:from-sky-950/70 dark:to-emerald-950/40 dark:text-sky-300">
                    <span className="[&>svg]:w-3.5 [&>svg]:h-3.5 sm:[&>svg]:w-4 sm:[&>svg]:h-4">
                        {icon}
                    </span>
                </div>

                <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex flex-wrap items-center justify-between gap-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">
                            {label}
                        </span>

                        {!editing && (
                            <div className="flex shrink-0 items-center gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                                {typeof savedValue === "string" &&
                                    savedValue.trim() !== "" && (
                                        <button
                                            type="button"
                                            onClick={handleCopy}
                                            title={`Copy ${label.toLowerCase()}`}
                                            aria-label={`Copy ${label}`}
                                            className="rounded p-1 text-slate-400 transition hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-slate-800 dark:hover:text-sky-300"
                                        >
                                            {copied ? (
                                                <Check size={12} />
                                            ) : (
                                                <Copy size={12} />
                                            )}
                                        </button>
                                    )}

                                <button
                                    type="button"
                                    onClick={startEditing}
                                    title={`Edit ${label.toLowerCase()}`}
                                    aria-label={`Edit ${label}`}
                                    className="rounded p-1 text-slate-400 transition hover:bg-emerald-100 hover:text-emerald-700 dark:hover:bg-slate-800 dark:hover:text-emerald-300"
                                >
                                    <Pencil size={12} />
                                </button>
                            </div>
                        )}
                    </div>

                    {editing ? (
                        <div className="space-y-1.5">
                            {field === "active" ? (
                                <select
                                    value={String(Boolean(draft))}
                                    onChange={(event) =>
                                        setDraft(
                                            event.target.value === "true",
                                        )
                                    }
                                    disabled={saving}
                                    className="w-full rounded-lg border border-sky-200 bg-white px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-sky-950"
                                >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            ) : (
                                <input
                                    type={inputType}
                                    value={String(draft)}
                                    onChange={(event) =>
                                        setDraft(event.target.value)
                                    }
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            void handleSave();
                                        }

                                        if (event.key === "Escape") {
                                            cancelEditing();
                                        }
                                    }}
                                    placeholder={placeholder ?? `Enter ${label.toLowerCase()}`}
                                    disabled={saving}
                                    autoFocus
                                    className="w-full min-w-0 rounded-lg border border-sky-200 bg-white px-2 py-1.5 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-sky-950"
                                />
                            )}

                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => void handleSave()}
                                    disabled={saving}
                                    className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-sky-600 to-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving ? (
                                        <LoaderCircle
                                            size={12}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <Save size={12} />
                                    )}
                                    {saving ? "Saving..." : "Save"}
                                </button>

                                <button
                                    type="button"
                                    onClick={cancelEditing}
                                    disabled={saving}
                                    className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    <X size={12} />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex min-w-0 items-center gap-1.5">
                            {field === "active" && (
                                <span
                                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                                        savedValue
                                            ? "bg-emerald-500"
                                            : "bg-slate-400"
                                    }`}
                                />
                            )}

                            <p
                                className={`min-w-0 break-words text-xs font-medium ${
                                    field === "active"
                                        ? savedValue
                                            ? "text-emerald-700 dark:text-emerald-400"
                                            : "text-slate-500 dark:text-slate-400"
                                        : "text-slate-800 dark:text-slate-100"
                                }`}
                            >
                                {displayValue}
                            </p>

                            {justSaved && (
                                <span className="shrink-0 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                    Saved
                                </span>
                            )}

                            {copied && (
                                <span className="shrink-0 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                    Copied
                                </span>
                            )}
                        </div>
                    )}

                    {error && (
                        <p className="mt-1.5 flex items-start gap-1 text-[11px] text-rose-600 dark:text-rose-400">
                            <AlertCircle
                                size={12}
                                className="mt-0.5 shrink-0"
                            />
                            <span>{error}</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* User Header                                                                */
/* -------------------------------------------------------------------------- */

export function UserHeader({
    user,
    overview,
    reload,
    onSaveField,
    endpointBase = "/api/customers",
    headers,
    reloadAfterSave = false,
}: Props) {
    const navigate = useNavigate();

    const [refreshing, setRefreshing] = useState(false);
    const [refreshError, setRefreshError] = useState("");

    // Local overlay so hero/summary fields immediately reflect saves without
    // forcing a full-page reload or closing the collapsible panel.
    const [localUserOverrides, setLocalUserOverrides] =
        useState<Partial<Record<EditableUserField, EditableUserValue>>>({});

    useEffect(() => {
        setLocalUserOverrides({});
    }, [user.id]);

    const effectiveUser: User = {
        ...user,
        ...(localUserOverrides as Partial<User>),
    };

    // Hidden by default on both mobile and desktop viewports
    const [infoOpen, setInfoOpen] = useState(false);

    const handlePersistField = async (
        field: EditableUserField,
        value: EditableUserValue,
    ): Promise<void> => {
        if (onSaveField) {
            await onSaveField(field, value);
        } else {
            await patchCustomerField(user.id, field, value, {
                endpointBase,
                headers,
            });
        }

        setLocalUserOverrides((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (reloadAfterSave) {
            await reload();
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        setRefreshError("");

        try {
            await reload();
            setLocalUserOverrides({});
        } catch {
            setRefreshError("Unable to refresh customer details.");
        } finally {
            setRefreshing(false);
        }
    };

    const profileFields: {
        field: EditableUserField;
        label: string;
        icon: ReactNode;
        inputType?: EditableFieldProps["inputType"];
        placeholder?: string;
    }[] = [
        {
            field: "full_name",
            label: "Full name",
            icon: <UserRound size={15} />,
            placeholder: "Customer's full name",
        },
        
        {
            field: "phone",
            label: "Phone number",
            icon: <Phone size={15} />,
            inputType: "tel",
            placeholder: "e.g. 0712345678",
        },
        {
            field: "email",
            label: "Email address",
            icon: <Mail size={15} />,
            inputType: "email",
            placeholder: "customer@example.com",
        },
        {
            field: "county",
            label: "County",
            icon: <MapPin size={15} />,
            placeholder: "County",
        },
        {
            field: "location",
            label: "Location / Estate",
            icon: <MapPin size={15} />,
            placeholder: "Town, estate or area",
        },
        {
            field: "address",
            label: "Physical address",
            icon: <Building2 size={15} />,
            placeholder: "Street or physical address",
        },
        {
            field: "building",
            label: "Building",
            icon: <Building2 size={15} />,
            placeholder: "Building name",
        },
        {
            field: "floor",
            label: "Floor",
            icon: <Layers3 size={15} />,
            placeholder: "Floor number or name",
        },
        {
            field: "house_no",
            label: "House / Unit",
            icon: <House size={15} />,
            placeholder: "House or unit number",
        },
        {
            field: "active",
            label: "Account status",
            icon: <ShieldCheck size={15} />,
        },
        {
            field: "avatar",
            label: "Avatar URL",
            icon: <Image size={15} />,
            inputType: "url",
            placeholder: "https://example.com/avatar.jpg",
        },
    ];

    return (
        <div className="space-y-4 sm:space-y-5">
            {/* -------------------------------------------------------------- */}
            {/* Action bar                                                     */}
            {/* -------------------------------------------------------------- */}

            <div className="flex items-center justify-between gap-2.5">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                    <ArrowLeft size={14} />
                    Back
                </button>

                <button
                    type="button"
                    onClick={() => void handleRefresh()}
                    disabled={refreshing}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCw
                        size={13}
                        className={refreshing ? "animate-spin" : ""}
                    />
                    {refreshing ? "Refreshing..." : "Refresh"}
                </button>
            </div>

            {refreshError && (
                <p className="text-xs text-rose-600 dark:text-rose-400">
                    {refreshError}
                </p>
            )}

            {/* -------------------------------------------------------------- */}
            {/* Profile hero                                                   */}
            {/* -------------------------------------------------------------- */}

            <section className="relative overflow-hidden rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-emerald-50 shadow-sm sm:rounded-3xl dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/30">
                {/* Decorative surfaces */}
                <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-sky-200/30 blur-3xl dark:bg-sky-500/10" />
                <div className="pointer-events-none absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-500/10" />

                <div className="relative p-3.5 sm:p-5 lg:p-6">
                    <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:gap-4">
                        {/* Avatar */}
                        <div className="relative shrink-0 self-start">
                            {effectiveUser.avatar ? (
                                <img
                                    src={effectiveUser.avatar}
                                    alt={`${effectiveUser.full_name}'s avatar`}
                                    className="h-14 w-14 rounded-xl border border-white object-cover shadow-sm ring-2 ring-sky-100/80 sm:h-16 sm:w-16 dark:border-slate-700 dark:ring-slate-800"
                                />
                            ) : (
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 text-xl font-bold text-white shadow-sm ring-2 ring-white sm:h-16 sm:w-16 sm:text-2xl dark:ring-slate-800">
                                    {effectiveUser.full_name?.charAt(0).toUpperCase() || "?"}
                                </div>
                            )}

                            <span
                                title={effectiveUser.active ? "Account active" : "Account inactive"}
                                className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                                    effectiveUser.active
                                        ? "bg-emerald-500"
                                        : "bg-slate-400"
                                }`}
                            />
                        </div>

                        {/* Profile summary */}
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="break-words text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                                    {effectiveUser.full_name || "Unnamed customer"}
                                </h1>

                                <StatusBadge status={overview.status} />
                            </div>

                            <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                                <AtSign size={13} className="shrink-0" />
                                <span className="break-all">
                                    {effectiveUser.username || "No username"}
                                </span>
                                <span className="text-slate-300 dark:text-slate-700">
                                    /
                                </span>
                                <span className="text-[11px]">
                                    ID: {effectiveUser.id}
                                </span>
                            </p>

                            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-sky-100 bg-white/80 p-2.5 dark:border-slate-700 dark:bg-slate-900/70">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                                        <Phone size={14} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                            Phone
                                        </p>
                                        <p className="break-all text-xs font-medium text-slate-800 dark:text-slate-100">
                                            {effectiveUser.phone || "Not provided"}
                                        </p>
                                    </div>

                                    {effectiveUser.phone && (
                                        <button
                                            type="button"
                                            title="Copy phone number"
                                            aria-label="Copy phone number"
                                            onClick={() =>
                                                void navigator.clipboard.writeText(
                                                    effectiveUser.phone,
                                                )
                                            }
                                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-slate-800 dark:hover:text-sky-300"
                                        >
                                            <Copy size={13} />
                                        </button>
                                    )}
                                </div>

                                <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-emerald-100 bg-white/80 p-2.5 dark:border-slate-700 dark:bg-slate-900/70">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                        <Mail size={14} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                            Email
                                        </p>
                                        <p className="break-all text-xs font-medium text-slate-800 dark:text-slate-100">
                                            {effectiveUser.email || "Not provided"}
                                        </p>
                                    </div>

                                    {effectiveUser.email && (
                                        <button
                                            type="button"
                                            title="Copy email address"
                                            aria-label="Copy email address"
                                            onClick={() =>
                                                void navigator.clipboard.writeText(
                                                    effectiveUser.email,
                                                )
                                            }
                                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-emerald-100 hover:text-emerald-700 dark:hover:bg-slate-800 dark:hover:text-emerald-300"
                                        >
                                            <Copy size={13} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                                <span className="inline-flex items-center gap-1">
                                    <Calendar
                                        size={13}
                                        className="text-sky-600 dark:text-sky-400"
                                    />
                                    Customer since{" "}
                                    <strong className="font-semibold text-slate-700 dark:text-slate-200">
                                        {formatDate(
                                            overview.customer_since,
                                        )}
                                    </strong>
                                </span>

                                <span className="inline-flex items-center gap-1">
                                    <ShieldCheck
                                        size={13}
                                        className={
                                            effectiveUser.active
                                                ? "text-emerald-600"
                                                : "text-slate-400"
                                        }
                                    />
                                    {effectiveUser.active
                                        ? "Account enabled"
                                        : "Account disabled"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* -------------------------------------------------------------- */}
            {/* Editable customer information (Collapsible, hidden by default) */}
            {/* -------------------------------------------------------------- */}

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:rounded-2xl">
                <button
                    type="button"
                    onClick={() => setInfoOpen(!infoOpen)}
                    className="flex w-full items-center justify-between gap-2.5 border-b border-slate-100 px-3.5 py-3 text-left transition hover:bg-slate-50/50 sm:px-5 sm:py-4 dark:border-slate-800 dark:hover:bg-slate-800/40"
                >
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                Customer information
                            </h2>
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-300">
                                <CheckCircle2 size={12} />
                                Field editing enabled
                            </span>
                        </div>
                        <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                            Edit and save individual fields independently.
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400">
                            {infoOpen ? "Hide" : "Show"}
                        </span>
                        <ChevronDown
                            size={16}
                            className={`text-slate-400 transition-transform duration-200 ${
                                infoOpen ? "rotate-180" : ""
                            }`}
                        />
                    </div>
                </button>

                {infoOpen && (
                    <div className="grid gap-2.5 p-2.5 sm:grid-cols-2 sm:gap-3 sm:p-4 xl:grid-cols-3">
                        {profileFields.map((item) => (
                            <EditableField
                                key={item.field}
                                field={item.field}
                                label={item.label}
                                value={effectiveUser[item.field]}
                                icon={item.icon}
                                inputType={item.inputType}
                                placeholder={item.placeholder}
                                onSave={handlePersistField}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* -------------------------------------------------------------- */}
            {/* Accounting and activity statistics                            */}
            {/* -------------------------------------------------------------- */}

            <section>
                <div className="mb-2.5 flex items-center justify-between gap-2.5">
                    <div>
                        <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            Account overview
                        </h2>
                        <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                            Customer spending, services and activity.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-5">
                    <div className="col-span-2 sm:col-span-1">
                        <StatCard
                            title="Lifetime Spend"
                            value={`KES ${(
                                overview.lifetime_spend || 0
                            ).toLocaleString()}`}
                            icon={
                                <Wallet
                                    size={16}
                                    className="text-sky-600 dark:text-sky-400"
                                />
                            }
                        />
                    </div>

                    <StatCard
                        title="Purchases"
                        value={overview.total_payments}
                        icon={
                            <ShoppingBag
                                size={16}
                                className="text-emerald-600 dark:text-emerald-400"
                            />
                        }
                    />

                    <StatCard
                        title="Services"
                        value={overview.active_services}
                        icon={
                            <Radio
                                size={16}
                                className="text-sky-600 dark:text-sky-400"
                            />
                        }
                    />

                    <div className="col-span-2 sm:col-span-1">
                        <StatCard
                            title="Customer Since"
                            value={formatDate(overview.customer_since)}
                            icon={
                                <Calendar
                                    size={16}
                                    className="text-emerald-600 dark:text-emerald-400"
                                />
                            }
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <StatCard
                            title="Last Seen"
                            value={formatDate(overview.last_seen) ?? "—"}
                            icon={
                                <Clock
                                    size={16}
                                    className="text-sky-600 dark:text-sky-400"
                                />
                            }
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}