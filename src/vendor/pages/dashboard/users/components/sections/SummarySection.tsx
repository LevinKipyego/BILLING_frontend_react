import { useEffect, useMemo, useRef, useState } from "react";
import {
    Wallet,
    CreditCard,
    Wifi,
    Network,
    Activity,
    BarChart3,
    Banknote,
    Package,
    Pencil,
    Check,
    X,
    HelpCircle,
    RotateCcw,
    CheckCircle2,
} from "lucide-react";

import SummaryCard from "../cards/SummaryCard";
import { renewCustomerSubscription } from "../../services/userProfileApi";

import type { UserProfile } from "../types/types";

export const CREDIT_ADJUSTMENT_REASONS = [
    "Maintenance",
    "Relocation Fee",
    "Utility Replacement",
    "Billing Adjustment",
    "Other",
] as const;

export type CreditAdjustmentReason = (typeof CREDIT_ADJUSTMENT_REASONS)[number];

export interface OverviewPlan {
    id: number | string;
    name?: string;
    price: number | string;
    duration_minutes: number | string;
}

export interface WalletBalanceUpdatePayload {
    customerId?: number | string;
    wallet_balance: number;
    previous_wallet_balance: number;
}

export interface CreditBalanceUpdatePayload {
    customerId?: number | string;
    credit_balance: number;
    previous_credit_balance: number;
    reason: string;
}

export interface WalletRedeemPayload {
    customerId?: number | string;
    plan?: OverviewPlan | null;
    plan_id: number | string | null;
    mode: "wallet";
    wallet_balance: number;
    estimated_minutes: number;
    estimated_duration_label: string;
}

interface RedeemSuccessSummary {
    amountRedeemed: number;
    planName?: string;
    durationLabel: string;
    minutes: number;
}

interface Props {
    profile: UserProfile;
    onUpdateWalletBalance?(
        payload: WalletBalanceUpdatePayload,
    ): Promise<void> | void;
    onUpdateCreditBalance?(
        payload: CreditBalanceUpdatePayload,
    ): Promise<void> | void;
    onRedeemWallet?(
        payload: WalletRedeemPayload,
    ): Promise<void> | void;
}

const WALLET_HELP_TEXT =
    "Prepaid top-up funds held on the customer's account that can be redeemed for subscription duration during renewal.";

const CREDIT_HELP_TEXT =
    "Account credit balance tracked for billing adjustments, maintenance credits, relocation fees, or utility replacements.";

const REDEEM_CONFIRM_MESSAGE =
    "Are you sure you want to redeem this wallet?";

function parseSafeNumber(value: unknown, fallback = 0): number {
    const parsed = Number(value ?? fallback);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function parsePositiveNumber(value: unknown): number {
    if (value === null || value === undefined || value === "") return 0;
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function formatReasonLabel(reason: unknown): string | null {
    if (typeof reason !== "string") return null;
    const trimmed = reason.trim();
    if (!trimmed) return null;
    return trimmed
        .replace(/[_-]+/g, " ")
        .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function formatMinutesToReadableDuration(totalMinutes: number): string {
    const safeMins = Math.max(0, Math.floor(totalMinutes));
    if (safeMins === 0) return "0m";

    const minutesPerDay = 60 * 24;
    const days = Math.floor(safeMins / minutesPerDay);
    const remAfterDays = safeMins % minutesPerDay;
    const hours = Math.floor(remAfterDays / 60);
    const minutes = remAfterDays % 60;

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`);

    return parts.join(" ");
}

function normalizePlanIdValue(raw: unknown): number | string | null {
    if (raw === null || raw === undefined) return null;
    const str = String(raw).trim();
    if (!str) return null;
    return /^\d+$/.test(str) ? Number(str) : str;
}

export default function SummarySection({
    profile,
    onUpdateWalletBalance,
    onUpdateCreditBalance,
    onRedeemWallet,
}: Props) {
    const overview = profile.overview as UserProfile["overview"] & {
        credit_adjustment_reason?: string | null;
        plan?: OverviewPlan | null;
    };

    const profileExtended = profile as UserProfile & {
        id?: number | string;
        user?: { id?: number | string };
    };

    const customerId = profileExtended.id ?? profileExtended.user?.id;
    const overviewPlan = overview.plan ?? null;
    const resolvedPlanId = normalizePlanIdValue(overviewPlan?.id);

    const serverWallet = parseSafeNumber(overview.wallet_balance, 0);
    const serverCredit = parseSafeNumber(overview.credit_balance, 0);
    const serverReason = formatReasonLabel(overview.credit_adjustment_reason);

    const prevServerWalletRef = useRef<number>(serverWallet);
    const prevServerCreditRef = useRef<number>(serverCredit);
    const prevServerReasonRef = useRef<string | null>(serverReason);

    // Wallet state
    const [walletOverride, setWalletOverride] = useState<number | null>(null);
    const [isEditingWallet, setIsEditingWallet] = useState(false);
    const [draftWalletAmount, setDraftWalletAmount] = useState<string>(
        String(serverWallet),
    );
    const [savingWallet, setSavingWallet] = useState(false);
    const [walletError, setWalletError] = useState<string | null>(null);

    // Wallet redeem pop-up card state
    const [redeemModalOpen, setRedeemModalOpen] = useState(false);
    const [redeemingWallet, setRedeemingWallet] = useState(false);
    const [redeemSuccess, setRedeemSuccess] =
        useState<RedeemSuccessSummary | null>(null);

    // Credit state
    const [creditOverride, setCreditOverride] = useState<number | null>(null);
    const [creditReasonOverride, setCreditReasonOverride] = useState<
        string | null | undefined
    >(undefined);
    const [isEditingCredit, setIsEditingCredit] = useState(false);
    const [draftCreditAmount, setDraftCreditAmount] = useState<string>(
        String(serverCredit),
    );
    const [selectedReason, setSelectedReason] = useState<string>(
        CREDIT_ADJUSTMENT_REASONS[0],
    );
    const [customReason, setCustomReason] = useState<string>("");
    const [savingCredit, setSavingCredit] = useState(false);
    const [creditError, setCreditError] = useState<string | null>(null);

    const walletBalance = walletOverride ?? serverWallet;
    const creditBalance = creditOverride ?? serverCredit;
    const displayedCreditReason =
        creditReasonOverride !== undefined ? creditReasonOverride : serverReason;

    useEffect(() => {
        if (serverWallet !== prevServerWalletRef.current) {
            prevServerWalletRef.current = serverWallet;
            setWalletOverride(null);
            if (!isEditingWallet) {
                setDraftWalletAmount(String(serverWallet));
            }
        }
    }, [serverWallet, isEditingWallet]);

    useEffect(() => {
        if (
            serverCredit !== prevServerCreditRef.current ||
            serverReason !== prevServerReasonRef.current
        ) {
            prevServerCreditRef.current = serverCredit;
            prevServerReasonRef.current = serverReason;
            setCreditOverride(null);
            setCreditReasonOverride(undefined);
            if (!isEditingCredit) {
                setDraftCreditAmount(String(serverCredit));
            }
        }
    }, [serverCredit, serverReason, isEditingCredit]);

    const redemptionCalculation = useMemo(() => {
        const planPrice = parsePositiveNumber(overviewPlan?.price);
        const planDurationMinutes = parsePositiveNumber(
            overviewPlan?.duration_minutes,
        );

        if (
            walletBalance <= 0 ||
            planPrice <= 0 ||
            planDurationMinutes <= 0
        ) {
            return {
                valid: false,
                minutes: 0,
                formattedDuration: "0m",
                planPrice,
                planDurationMinutes,
            };
        }

        const rawMinutes = Math.floor(
            (walletBalance / planPrice) * planDurationMinutes,
        );

        return {
            valid: rawMinutes > 0,
            minutes: Math.max(0, rawMinutes),
            formattedDuration: formatMinutesToReadableDuration(rawMinutes),
            planPrice,
            planDurationMinutes,
        };
    }, [
        walletBalance,
        overviewPlan?.price,
        overviewPlan?.duration_minutes,
    ]);

    // Wallet handlers
    const handleStartEditWallet = () => {
        setRedeemModalOpen(false);
        setWalletError(null);
        setDraftWalletAmount(String(walletBalance));
        setIsEditingWallet(true);
    };

    const handleCancelEditWallet = () => {
        setWalletError(null);
        setDraftWalletAmount(String(walletBalance));
        setIsEditingWallet(false);
    };

    const handleSaveWallet = async () => {
        const parsed = Number(draftWalletAmount);
        if (!Number.isFinite(parsed) || parsed < 0) {
            setWalletError("Enter a valid non-negative wallet amount.");
            return;
        }

        const rounded = Number(parsed.toFixed(2));
        const previousBalance = walletBalance;

        setSavingWallet(true);
        setWalletError(null);

        try {
            if (onUpdateWalletBalance) {
                await onUpdateWalletBalance({
                    customerId,
                    wallet_balance: rounded,
                    previous_wallet_balance: previousBalance,
                });
            }
            setWalletOverride(rounded);
            setDraftWalletAmount(String(rounded));
            setIsEditingWallet(false);
        } catch (err) {
            setWalletError(
                err instanceof Error
                    ? err.message
                    : "Failed to update wallet balance.",
            );
        } finally {
            setSavingWallet(false);
        }
    };

    const handleOpenRedeemPopup = () => {
        setIsEditingWallet(false);
        setWalletError(null);
        setRedeemSuccess(null);
        setRedeemModalOpen(true);
    };

    const handleCloseRedeemPopup = () => {
        if (redeemingWallet) return;
        setRedeemModalOpen(false);
        setRedeemSuccess(null);
    };

    const handleConfirmRedeemWallet = async () => {
        if (walletBalance <= 0) {
            setWalletError("Wallet balance is 0.00; nothing to redeem.");
            return;
        }

        if (resolvedPlanId === null || !redemptionCalculation.valid) {
            setWalletError(
                "No valid current plan (id, price, duration_minutes) found in overview to calculate top-up duration.",
            );
            return;
        }

        const planPayload: OverviewPlan = {
            id: resolvedPlanId,
            ...(overviewPlan?.name ? { name: overviewPlan.name } : {}),
            price: overviewPlan?.price ?? redemptionCalculation.planPrice,
            duration_minutes:
                overviewPlan?.duration_minutes ??
                redemptionCalculation.planDurationMinutes,
        };

        const amountBeingRedeemed = walletBalance;
        const durationToAdd = redemptionCalculation.formattedDuration;
        const minutesToAdd = redemptionCalculation.minutes;

        setRedeemingWallet(true);
        setWalletError(null);

        try {
            if (onRedeemWallet) {
                await onRedeemWallet({
                    customerId,
                    plan: planPayload,
                    plan_id: resolvedPlanId,
                    mode: "wallet",
                    wallet_balance: amountBeingRedeemed,
                    estimated_minutes: minutesToAdd,
                    estimated_duration_label: durationToAdd,
                });
            } else if (customerId !== undefined) {
                await renewCustomerSubscription(customerId, {
                    plan: { ...planPayload },
                    plan_id: resolvedPlanId,
                    mode: "wallet",
                });
            }

            setWalletOverride(0);
            setDraftWalletAmount("0");
            setRedeemSuccess({
                amountRedeemed: amountBeingRedeemed,
                planName: overviewPlan?.name,
                durationLabel: durationToAdd,
                minutes: minutesToAdd,
            });
        } catch (err) {
            setWalletError(
                err instanceof Error
                    ? err.message
                    : "Failed to redeem wallet balance.",
            );
        } finally {
            setRedeemingWallet(false);
        }
    };

    // Credit handlers
    const handleStartEditCredit = () => {
        setCreditError(null);
        setDraftCreditAmount(String(creditBalance));
        setSelectedReason(CREDIT_ADJUSTMENT_REASONS[0]);
        setCustomReason("");
        setIsEditingCredit(true);
    };

    const handleCancelEditCredit = () => {
        setCreditError(null);
        setDraftCreditAmount(String(creditBalance));
        setCustomReason("");
        setIsEditingCredit(false);
    };

    const handleSaveCredit = async () => {
        const parsed = Number(draftCreditAmount);
        if (!Number.isFinite(parsed) || parsed < 0) {
            setCreditError("Enter a valid non-negative credit amount.");
            return;
        }

        const resolvedReason =
            selectedReason === "Other"
                ? customReason.trim() || "Other"
                : selectedReason;

        const rounded = Number(parsed.toFixed(2));
        const previousBalance = creditBalance;

        setSavingCredit(true);
        setCreditError(null);

        try {
            if (onUpdateCreditBalance) {
                await onUpdateCreditBalance({
                    customerId,
                    credit_balance: rounded,
                    previous_credit_balance: previousBalance,
                    reason: resolvedReason,
                });
            }
            setCreditOverride(rounded);
            setCreditReasonOverride(formatReasonLabel(resolvedReason));
            setDraftCreditAmount(String(rounded));
            setIsEditingCredit(false);
        } catch (err) {
            setCreditError(
                err instanceof Error
                    ? err.message
                    : "Failed to update credit balance.",
            );
        } finally {
            setSavingCredit(false);
        }
    };

    return (
        <section className="space-y-3 sm:space-y-5">
            <div>
                <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                    Account Summary
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    Customer statistics and lifetime usage.
                </p>
            </div>

            <div className="grid gap-3 sm:gap-5 grid-cols-2 xl:grid-cols-4">
                <SummaryCard
                    title="Lifetime Spend"
                    value={`KES ${parseSafeNumber(
                        overview.lifetime_spend,
                        0,
                    ).toLocaleString()}`}
                    icon={<Wallet size={22} />}
                />

                <SummaryCard
                    title="Payments"
                    value={overview.total_payments}
                    icon={<CreditCard size={22} />}
                />

                <SummaryCard
                    title="Active Services"
                    value={overview.active_services}
                    icon={<Package size={22} />}
                />

                <SummaryCard
                    title="Average Purchase"
                    value={`KES ${parseSafeNumber(
                        overview.average_purchase,
                        0,
                    ).toLocaleString()}`}
                    icon={<BarChart3 size={22} />}
                />

                <SummaryCard
                    title="Hotspot Purchases"
                    value={overview.hotspot_purchases}
                    icon={<Wifi size={22} />}
                />

                <SummaryCard
                    title="PPPoE Purchases"
                    value={overview.pppoe_purchases}
                    icon={<Network size={22} />}
                />

                <SummaryCard
                    title="Total Sessions"
                    value={overview.total_sessions}
                    icon={<Activity size={22} />}
                />

                {/* Installation Fee first, then Wallet Balance */}
                <SummaryCard
                    title="Installation Fee"
                    value={`KES ${parseSafeNumber(
                        overview.installation_fee,
                        0,
                    ).toLocaleString()}`}
                    icon={<Banknote size={22} />}
                />

                {/* Editable + Redeemable Wallet Balance Card */}
                <div
                    title={WALLET_HELP_TEXT}
                    className="rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 sm:p-5 shadow-sm flex flex-col justify-between gap-3"
                >
                    <div className="flex items-start justify-between gap-2">
                        <div className="w-full">
                            <div className="flex items-center gap-1.5">
                                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                                    Wallet Balance
                                </p>
                                <span
                                    className="group relative inline-flex items-center text-blue-600 dark:text-blue-400 cursor-help"
                                    tabIndex={0}
                                    aria-label={WALLET_HELP_TEXT}
                                >
                                    <HelpCircle size={14} />
                                    <span className="pointer-events-none invisible group-hover:visible group-focus:visible absolute left-1/2 bottom-full z-20 mb-2 w-56 -translate-x-1/2 rounded-lg border border-blue-200 dark:border-blue-800 bg-slate-900 dark:bg-slate-950 px-2.5 py-1.5 text-[11px] font-normal leading-snug text-white shadow-lg">
                                        {WALLET_HELP_TEXT}
                                    </span>
                                </span>
                            </div>

                            {!isEditingWallet ? (
                                <p className="mt-1 text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                                    KES {walletBalance.toLocaleString()}
                                </p>
                            ) : (
                                <div className="mt-1.5">
                                    <input
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        value={draftWalletAmount}
                                        disabled={savingWallet}
                                        onChange={(e) =>
                                            setDraftWalletAmount(e.target.value)
                                        }
                                        aria-label="Wallet balance amount"
                                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                            <Banknote size={20} />
                        </div>
                    </div>

                    {walletError && (
                        <p className="text-[11px] font-medium text-red-600 dark:text-red-400">
                            {walletError}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center justify-end gap-1.5 pt-1">
                        {!isEditingWallet ? (
                            <>
                                <button
                                    type="button"
                                    disabled={walletBalance <= 0}
                                    onClick={handleOpenRedeemPopup}
                                    className="inline-flex items-center gap-1 rounded-lg border border-blue-500/40 dark:border-blue-400/40 px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 transition hover:bg-blue-50 dark:hover:bg-blue-950/40 disabled:opacity-40"
                                >
                                    <RotateCcw size={12} />
                                    <span>Redeem</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleStartEditWallet}
                                    className="inline-flex items-center gap-1 rounded-lg border border-blue-500/40 dark:border-blue-400/40 px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 transition hover:bg-blue-50 dark:hover:bg-blue-950/40"
                                >
                                    <Pencil size={12} />
                                    <span>Edit Wallet</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    disabled={savingWallet}
                                    onClick={handleCancelEditWallet}
                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
                                >
                                    <X size={12} />
                                    <span>Cancel</span>
                                </button>
                                <button
                                    type="button"
                                    disabled={savingWallet}
                                    onClick={handleSaveWallet}
                                    className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                                >
                                    <Check size={12} />
                                    <span>{savingWallet ? "Saving..." : "Save"}</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Editable Credit Balance Card with visible credit_adjustment_reason */}
                <div
                    title={CREDIT_HELP_TEXT}
                    className="rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 sm:p-5 shadow-sm flex flex-col justify-between gap-3"
                >
                    <div className="flex items-start justify-between gap-2">
                        <div className="w-full">
                            <div className="flex items-center gap-1.5">
                                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                                    Credit Balance
                                </p>
                                <span
                                    className="group relative inline-flex items-center text-blue-600 dark:text-blue-400 cursor-help"
                                    tabIndex={0}
                                    aria-label={CREDIT_HELP_TEXT}
                                >
                                    <HelpCircle size={14} />
                                    <span className="pointer-events-none invisible group-hover:visible group-focus:visible absolute left-1/2 bottom-full z-20 mb-2 w-56 -translate-x-1/2 rounded-lg border border-blue-200 dark:border-blue-800 bg-slate-900 dark:bg-slate-950 px-2.5 py-1.5 text-[11px] font-normal leading-snug text-white shadow-lg">
                                        {CREDIT_HELP_TEXT}
                                    </span>
                                </span>
                            </div>

                            {!isEditingCredit ? (
                                <>
                                    <p className="mt-1 text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                                        KES {creditBalance.toLocaleString()}
                                    </p>
                                    {displayedCreditReason && (
                                        <p className="mt-1 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                                            Reason: {displayedCreditReason}
                                        </p>
                                    )}
                                </>
                            ) : (
                                <div className="mt-1.5 space-y-2">
                                    <input
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        value={draftCreditAmount}
                                        disabled={savingCredit}
                                        onChange={(e) =>
                                            setDraftCreditAmount(e.target.value)
                                        }
                                        aria-label="Credit balance amount"
                                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    />

                                    <select
                                        value={selectedReason}
                                        disabled={savingCredit}
                                        onChange={(e) =>
                                            setSelectedReason(e.target.value)
                                        }
                                        aria-label="Credit adjustment reason"
                                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    >
                                        {CREDIT_ADJUSTMENT_REASONS.map((reason) => (
                                            <option key={reason} value={reason}>
                                                {reason}
                                            </option>
                                        ))}
                                    </select>

                                    {selectedReason === "Other" && (
                                        <input
                                            type="text"
                                            value={customReason}
                                            disabled={savingCredit}
                                            onChange={(e) =>
                                                setCustomReason(e.target.value)
                                            }
                                            placeholder="Specify reason..."
                                            aria-label="Custom credit adjustment reason"
                                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                            <Wallet size={20} />
                        </div>
                    </div>

                    {creditError && (
                        <p className="text-[11px] font-medium text-red-600 dark:text-red-400">
                            {creditError}
                        </p>
                    )}

                    <div className="flex items-center justify-end gap-1.5 pt-1">
                        {!isEditingCredit ? (
                            <button
                                type="button"
                                onClick={handleStartEditCredit}
                                className="inline-flex items-center gap-1 rounded-lg border border-blue-500/40 dark:border-blue-400/40 px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 transition hover:bg-blue-50 dark:hover:bg-blue-950/40"
                            >
                                <Pencil size={12} />
                                <span>Edit Credit</span>
                            </button>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    disabled={savingCredit}
                                    onClick={handleCancelEditCredit}
                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
                                >
                                    <X size={12} />
                                    <span>Cancel</span>
                                </button>
                                <button
                                    type="button"
                                    disabled={savingCredit}
                                    onClick={handleSaveCredit}
                                    className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                                >
                                    <Check size={12} />
                                    <span>{savingCredit ? "Saving..." : "Save"}</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Small Pop-Up Card for Wallet Redemption Confirmation & Success */}
            {redeemModalOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Wallet redemption confirmation"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[1px]"
                >
                    <div className="w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900 p-4 sm:p-5 shadow-xl space-y-3">
                        {!redeemSuccess ? (
                            <>
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400">
                                            <RotateCcw size={16} />
                                        </span>
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                            Redeem Wallet
                                        </h3>
                                    </div>
                                    <button
                                        type="button"
                                        disabled={redeemingWallet}
                                        onClick={handleCloseRedeemPopup}
                                        aria-label="Close pop-up"
                                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200"
                                    >
                                        <X size={15} />
                                    </button>
                                </div>

                                <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100">
                                    {REDEEM_CONFIRM_MESSAGE}
                                </p>

                                <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3 text-xs space-y-1 text-slate-700 dark:text-slate-200">
                                    <p>
                                        Wallet amount:{" "}
                                        <strong className="font-semibold text-slate-900 dark:text-white">
                                            KES {walletBalance.toLocaleString()}
                                        </strong>
                                    </p>
                                    {overviewPlan?.name && (
                                        <p>
                                            Plan:{" "}
                                            <strong className="font-semibold text-slate-900 dark:text-white">
                                                {overviewPlan.name}
                                            </strong>
                                        </p>
                                    )}
                                    {redemptionCalculation.valid ? (
                                        <p>
                                            Top-up duration:{" "}
                                            <strong className="font-semibold text-blue-600 dark:text-blue-400">
                                                {redemptionCalculation.formattedDuration}
                                            </strong>{" "}
                                            <span className="text-slate-500 dark:text-slate-400">
                                                ({redemptionCalculation.minutes.toLocaleString()} mins)
                                            </span>
                                        </p>
                                    ) : (
                                        <p className="text-amber-600 dark:text-amber-400">
                                            Current plan pricing/duration unavailable on overview.
                                        </p>
                                    )}
                                </div>

                                {walletError && (
                                    <p className="text-xs font-medium text-red-600 dark:text-red-400">
                                        {walletError}
                                    </p>
                                )}

                                <div className="flex items-center justify-end gap-2 pt-1">
                                    <button
                                        type="button"
                                        disabled={redeemingWallet}
                                        onClick={handleCloseRedeemPopup}
                                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
                                    >
                                        <X size={13} />
                                        <span>Cancel</span>
                                    </button>
                                    <button
                                        type="button"
                                        disabled={
                                            redeemingWallet ||
                                            walletBalance <= 0 ||
                                            resolvedPlanId === null ||
                                            !redemptionCalculation.valid
                                        }
                                        onClick={handleConfirmRedeemWallet}
                                        className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        <Check size={13} />
                                        <span>
                                            {redeemingWallet
                                                ? "Redeeming..."
                                                : "Yes, Redeem"}
                                        </span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 size={17} />
                                        </span>
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                            Wallet Redeemed
                                        </h3>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleCloseRedeemPopup}
                                        aria-label="Close pop-up"
                                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200"
                                    >
                                        <X size={15} />
                                    </button>
                                </div>

                                <p className="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-400">
                                    Wallet redeemed successfully.
                                </p>

                                <div className="rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 text-xs space-y-1 text-slate-700 dark:text-slate-200">
                                    <p>
                                        Amount redeemed:{" "}
                                        <strong className="font-semibold text-slate-900 dark:text-white">
                                            KES {redeemSuccess.amountRedeemed.toLocaleString()}
                                        </strong>
                                    </p>
                                    {redeemSuccess.planName && (
                                        <p>
                                            Plan:{" "}
                                            <strong className="font-semibold text-slate-900 dark:text-white">
                                                {redeemSuccess.planName}
                                            </strong>
                                        </p>
                                    )}
                                    <p>
                                        Duration topped up:{" "}
                                        <strong className="font-semibold text-emerald-700 dark:text-emerald-400">
                                            {redeemSuccess.durationLabel}
                                        </strong>{" "}
                                        <span className="text-slate-500 dark:text-slate-400">
                                            ({redeemSuccess.minutes.toLocaleString()} mins)
                                        </span>
                                    </p>
                                </div>

                                <div className="flex items-center justify-end pt-1">
                                    <button
                                        type="button"
                                        onClick={handleCloseRedeemPopup}
                                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                                    >
                                        <Check size={13} />
                                        <span>Done</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}