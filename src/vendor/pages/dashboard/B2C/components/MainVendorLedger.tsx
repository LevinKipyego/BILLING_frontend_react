import React, { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../../../api/client";
import type {
  VendorDashboardData,
  LedgerEntry,
  PayoutRecord,
  PayoutStatus,
} from "../types";
import VendorPayoutConfig from "./VendorPayoutConfig";
import {
  ArrowPathIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  BanknotesIcon,
  PhoneIcon,
  CreditCardIcon,
  XMarkIcon,
  ClockIcon,
  Cog6ToothIcon,
  QueueListIcon,
} from "@heroicons/react/24/outline";

type Tab = "ledger" | "payouts" | "config";

const money = (value: number | string | null | undefined) =>
  `KES ${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const dateTime = (value: string) =>
  new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

export const VendorDashboard: React.FC = () => {
  const [data, setData] = useState<VendorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("ledger");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payoutError, setPayoutError] = useState<string | null>(null);
  const [payoutSuccess, setPayoutSuccess] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const responseData = await apiGet<VendorDashboardData>(
        "/v1/vendor/payouts/dashboard/"
      );
      setData(responseData);
    } catch (err: any) {
      console.error("Failed to load vendor dashboard data:", err);
      setError(err.message || "Failed to fetch vendor data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const normalizePhoneNumber = (phone: string): string => {
    let cleaned = phone.replace(/\D/g, "");

    if (cleaned.startsWith("0")) {
      cleaned = "254" + cleaned.slice(1);
    } else if (
      (cleaned.startsWith("7") || cleaned.startsWith("1")) &&
      cleaned.length === 9
    ) {
      cleaned = "254" + cleaned;
    }

    return cleaned;
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setPayoutError(null);
    setPayoutSuccess(null);
    setPayoutAmount("");
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutError(null);
    setPayoutSuccess(null);

    if (!data) return;

    const amount = parseFloat(payoutAmount);

    if (isNaN(amount) || amount <= 0) {
      setPayoutError("Please enter a valid payout amount.");
      return;
    }

    if (amount > data.summary.currentBalance) {
      setPayoutError("Requested amount exceeds your current working balance.");
      return;
    }

    const formattedPhone = normalizePhoneNumber(data.summary.payoutPhone || "");

    if (!/^254[71]\d{8}$/.test(formattedPhone)) {
      setPayoutError(
        "Please configure a valid Safaricom payout phone number first."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await apiPost<{
        message: string;
        payout: PayoutRecord;
      }>("/v1/vendor/payouts/request/", { amount });

      setPayoutSuccess(
        response.message || "Payout request initiated successfully!"
      );
      setPayoutAmount("");

      await fetchDashboardData();

      setTimeout(() => {
        setIsModalOpen(false);
        setPayoutSuccess(null);
      }, 1500);
    } catch (err: any) {
      console.error("Payout request failed:", err);
      setPayoutError(
        err.message || "Failed to trigger payout. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !data) {
    return <DashboardLoader />;
  }

  if (error || !data) {
    return (
      <div className="min-h-[60vh] bg-slate-50 px-3 py-6 dark:bg-gray-900">
        <div className="mx-auto max-w-3xl rounded-md border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
          <div className="flex items-start gap-3">
            <ExclamationCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <h2 className="text-sm font-bold">Unable to load dashboard</h2>
              <p className="mt-1 text-xs">
                {error || "Failed to load vendor dashboard data."}
              </p>
              <button
                onClick={fetchDashboardData}
                className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
              >
                <ArrowPathIcon className="h-3.5 w-3.5" />
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { summary, ledger, payouts } = data;

  const totalSettled = ledger.reduce(
    (acc, curr) => acc + Number(curr.netAmount || 0),
    0
  );

  const tabs: Array<{
    id: Tab;
    label: string;
    mobileLabel: string;
    count?: number;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }> = [
    {
      id: "ledger",
      label: "Transaction Ledger",
      mobileLabel: "Ledger",
      count: ledger.length,
      icon: QueueListIcon,
    },
    {
      id: "payouts",
      label: "Disbursement Payouts",
      mobileLabel: "Payouts",
      count: payouts.length,
      icon: BanknotesIcon,
    },
    {
      id: "config",
      label: "Payout Configuration",
      mobileLabel: "Settings",
      icon: Cog6ToothIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-gray-900 dark:text-slate-100 transition-colors">
      <div className="mx-auto w-full max-w-[1440px] px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
        
        {/* Header Block */}
        <header className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:mb-6 sm:p-5 dark:border-slate-800 dark:bg-gray-800 transition-colors">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Vendor Finance
                </span>
              </div>

              <h1 className="truncate text-lg font-bold sm:text-xl lg:text-2xl">
                {summary.name}
              </h1>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Billing model:{" "}
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {summary.billingModel === "AGGREGATED"
                    ? "System Paybill · Aggregated"
                    : "Direct Paybill"}
                </span>
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              disabled={summary.currentBalance <= 0}
              className="inline-flex min-h-[38px] w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              <BanknotesIcon className="h-4 w-4" />
              Request instant payout
            </button>
          </div>
        </header>

        {/* Financial Metrics */}
        <section className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          <MetricCard
            label="Working balance"
            value={money(summary.currentBalance)}
            icon={BanknotesIcon}
            tone="emerald"
            trend={summary.billingModel === "AGGREGATED" ? "Auto-payout" : "Manual"}
            footer={
              summary.billingModel === "AGGREGATED" ? (
                <>
                  Auto-payout threshold{" "}
                  <strong>{money(summary.payoutThreshold)}</strong>
                  <span className="mx-1">·</span>
                  <span className="font-mono">{summary.payoutPhone || "N/A"}</span>
                </>
              ) : (
                "Available for manual settlement"
              )
            }
          />

          <MetricCard
            label="Settlement target"
            value={summary.payoutPhone || "Not configured"}
            icon={PhoneIcon}
            tone="slate"
            valueClassName="text-sm sm:text-base font-bold font-mono"
            trend={summary.autoPayoutEnabled ? "Enabled" : "Manual"}
            footer={
              <span className="inline-flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    summary.autoPayoutEnabled
                      ? "animate-pulse bg-emerald-500"
                      : "bg-amber-500"
                  }`}
                />
                {summary.autoPayoutEnabled
                  ? "Auto-payout active"
                  : "Manual settlement only"}
              </span>
            }
          />

          <MetricCard
            label="Total settled collections"
            value={money(totalSettled)}
            icon={CreditCardIcon}
            tone="blue"
            trend={`${ledger.length} TXs`}
            className="sm:col-span-2 xl:col-span-1"
            footer={`${ledger.length} transaction${
              ledger.length === 1 ? "" : "s"
            } processed`}
          />
        </section>

        {/* Tabs Navigation */}
        <div className="mb-4 overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-gray-800 transition-colors">
          <nav className="grid grid-cols-3" aria-label="Vendor finance sections">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex min-h-[44px] items-center justify-center gap-1.5 px-2 text-xs font-bold transition ${
                    active
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="sm:hidden">{tab.mobileLabel}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  {typeof tab.count === "number" && (
                    <span
                      className={`hidden rounded px-1.5 py-0.5 text-[10px] sm:inline ${
                        active
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                  {active && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-emerald-600 dark:bg-emerald-400" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area */}
        {activeTab === "config" ? (
          <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-gray-800 transition-colors">
            <VendorPayoutConfig onConfigUpdated={fetchDashboardData} />
          </section>
        ) : (
          <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-gray-800 transition-colors">
            <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-xs font-bold sm:text-sm">
                    {activeTab === "ledger"
                      ? "Transaction history"
                      : "Payout history"}
                  </h2>
                  <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                    {activeTab === "ledger"
                      ? "Collections credited to your vendor balance."
                      : "Track every disbursement request and status."}
                  </p>
                </div>

                <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
                  {activeTab === "ledger" ? ledger.length : payouts.length} records
                </span>
              </div>
            </div>

            {activeTab === "ledger" ? (
              <LedgerTable ledger={ledger} />
            ) : (
              <PayoutsTable payouts={payouts} />
            )}
          </section>
        )}
      </div>

      {/* Payout Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-xl bg-white p-4 shadow-2xl sm:max-w-md sm:rounded-md sm:p-5 dark:bg-gray-800 border border-slate-200 dark:border-slate-800 transition-colors">
            <div className="mb-4 flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Disbursement
                </span>
                <h3 className="mt-0.5 text-base font-bold sm:text-lg">
                  Request instant payout
                </h3>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Funds will be transferred to your configured number.
                </p>
              </div>

              <button
                onClick={closeModal}
                disabled={isSubmitting}
                className="rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {payoutSuccess && (
              <Alert type="success" message={payoutSuccess} icon={CheckCircleIcon} />
            )}

            {payoutError && (
              <Alert type="error" message={payoutError} icon={ExclamationCircleIcon} />
            )}

            <form onSubmit={handleRequestPayout} className="space-y-3">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                <div className="flex items-center gap-2.5">
                  <div className="rounded border border-slate-200 bg-white p-2 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    <PhoneIcon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Payout recipient
                    </p>
                    <p className="truncate font-mono text-xs font-bold">
                      {summary.payoutPhone || "Not configured"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <label
                    htmlFor="payout-amount"
                    className="text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    Amount
                  </label>
                  <span className="text-[10px] font-medium text-slate-400">
                    Available {money(summary.currentBalance)}
                  </span>
                </div>

                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    KES
                  </span>
                  <input
                    id="payout-amount"
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="1"
                    max={summary.currentBalance}
                    placeholder="0.00"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="min-h-[40px] w-full rounded-md border border-slate-200 bg-white pl-12 pr-3 text-sm font-bold text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-600"
                    required
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setPayoutAmount(String(summary.currentBalance))}
                  className="mt-1.5 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                >
                  Use full available balance
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-slate-200 pt-3 dark:border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="min-h-[38px] rounded-md bg-slate-100 px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-md bg-emerald-600 px-3 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                >
                  {isSubmitting && (
                    <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />
                  )}
                  {isSubmitting ? "Processing..." : "Confirm payout"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Dashboard Loader                                                            */
/* -------------------------------------------------------------------------- */

const DashboardLoader: React.FC = () => (
  <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4 dark:bg-gray-900">
    <div className="w-full max-w-sm rounded-md border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-gray-800">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
        <ArrowPathIcon className="h-5 w-5 animate-spin text-emerald-600 dark:text-emerald-400" />
      </div>
      <p className="text-xs font-bold">Loading vendor dashboard</p>
      <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
        Fetching your latest balances and metrics...
      </p>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/* Metric Card Theme Component                                                */
/* -------------------------------------------------------------------------- */

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  tone: "emerald" | "blue" | "slate";
  trend?: string;
  footer: React.ReactNode;
  className?: string;
  valueClassName?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon: Icon,
  trend,
  footer,
  className = "",
  valueClassName = "",
}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 p-4 rounded-md border border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-colors ${className}`}
    >
      <div>
        <div className="flex justify-between items-start">
          <div className="p-2 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300">
            <Icon className="w-4 h-4" />
          </div>
          {trend && (
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-sans text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 px-1.5 py-0.5 rounded">
                {trend}
              </span>
            </div>
          )}
        </div>

        <div className="mt-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {label}
          </p>
          <p
            className={`mt-1 break-words text-lg font-bold tracking-tight sm:text-xl text-slate-900 dark:text-white ${valueClassName}`}
          >
            {value}
          </p>
        </div>
      </div>

      <div className="mt-3 border-t border-slate-100 dark:border-slate-800/60 pt-2 text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
        {footer}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Alert Helper                                                               */
/* -------------------------------------------------------------------------- */

const Alert: React.FC<{
  type: "success" | "error";
  message: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}> = ({ type, message, icon: Icon }) => (
  <div
    className={`mb-3 flex items-start gap-2 rounded border p-2.5 text-xs ${
      type === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
        : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
    }`}
  >
    <Icon className="mt-0.5 h-4 w-4 shrink-0" />
    <span>{message}</span>
  </div>
);

/* -------------------------------------------------------------------------- */
/* Ledger View                                                                */
/* -------------------------------------------------------------------------- */

const LedgerTable: React.FC<{ ledger: LedgerEntry[] }> = ({ ledger }) => {
  if (ledger.length === 0) {
    return <EmptyState message="No ledger transactions recorded yet." />;
  }

  return (
    <>
      {/* Mobile Card Layout */}
      <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
        {ledger.map((entry) => (
          <article key={entry.id} className="p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  M-Pesa receipt
                </p>
                <p className="mt-0.5 truncate font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                  {entry.mpesaReceiptNumber}
                </p>
              </div>

              <p className="shrink-0 text-right text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {money(entry.netAmount)}
              </p>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2 rounded border border-slate-200 bg-slate-50 p-2 text-[11px] dark:border-slate-800 dark:bg-slate-800/40">
              <Detail label="Date" value={dateTime(entry.createdAt)} />
              <Detail label="Gross" value={money(entry.grossAmount)} />
              <Detail
                label="Platform fee"
                value={`- ${money(entry.platformFee)}`}
                valueClassName="text-red-600 dark:text-red-400"
              />
              <Detail
                label="Net credited"
                value={money(entry.netAmount)}
                valueClassName="font-bold text-emerald-600 dark:text-emerald-400"
              />
            </div>
          </article>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Receipt no.</th>
              <th className="px-4 py-3">Date & time</th>
              <th className="px-4 py-3">Gross amount</th>
              <th className="px-4 py-3">Platform fee</th>
              <th className="px-4 py-3 text-right">Net credited</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {ledger.map((entry) => (
              <tr
                key={entry.id}
                className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
              >
                <td className="px-4 py-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                  {entry.mpesaReceiptNumber}
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {dateTime(entry.createdAt)}
                </td>
                <td className="px-4 py-3 font-medium">
                  {money(entry.grossAmount)}
                </td>
                <td className="px-4 py-3 font-medium text-red-600 dark:text-red-400">
                  - {money(entry.platformFee)}
                </td>
                <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                  {money(entry.netAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

/* -------------------------------------------------------------------------- */
/* Payouts View                                                               */
/* -------------------------------------------------------------------------- */

const PayoutsTable: React.FC<{ payouts: PayoutRecord[] }> = ({ payouts }) => {
  if (payouts.length === 0) {
    return <EmptyState message="No disbursement payout attempts recorded." />;
  }

  return (
    <>
      {/* Mobile Card Layout */}
      <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
        {payouts.map((payout) => (
          <article key={payout.id} className="p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Payout ID
                </p>
                <p className="mt-0.5 truncate font-mono text-xs font-bold text-slate-600 dark:text-slate-300">
                  {payout.id}
                </p>
              </div>

              <StatusBadge status={payout.status} />
            </div>

            <div className="mt-2 flex items-center justify-between rounded border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-800/40">
              <div>
                <p className="text-[9px] font-bold uppercase text-slate-400">
                  Amount
                </p>
                <p className="mt-0.5 text-sm font-bold">
                  {money(payout.amount)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold uppercase text-slate-400">
                  Recipient
                </p>
                <p className="mt-0.5 font-mono text-xs font-bold">
                  {payout.phoneNumber}
                </p>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <ClockIcon className="h-3.5 w-3.5 shrink-0" />
              {dateTime(payout.createdAt)}
            </div>
          </article>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Payout ID</th>
              <th className="px-4 py-3">Recipient</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {payouts.map((payout) => (
              <tr
                key={payout.id}
                className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
              >
                <td className="px-4 py-3 font-mono text-slate-500 dark:text-slate-400">
                  {payout.id.slice(0, 12)}...
                </td>
                <td className="px-4 py-3 font-mono font-bold">
                  {payout.phoneNumber}
                </td>
                <td className="px-4 py-3 font-bold">
                  {money(payout.amount)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={payout.status} />
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {dateTime(payout.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

/* -------------------------------------------------------------------------- */
/* Sub-components & Utilities                                                 */
/* -------------------------------------------------------------------------- */

const Detail: React.FC<{
  label: string;
  value: string;
  valueClassName?: string;
}> = ({ label, value, valueClassName = "" }) => (
  <div className="min-w-0">
    <p className="text-[9px] font-bold uppercase text-slate-400">{label}</p>
    <p className={`mt-0.5 truncate font-medium text-slate-700 dark:text-slate-300 ${valueClassName}`}>
      {value}
    </p>
  </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex min-h-[180px] flex-col items-center justify-center p-6 text-center">
    <div className="mb-2 rounded border border-slate-200 bg-slate-50 p-2 text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500">
      <QueueListIcon className="h-5 w-5" />
    </div>
    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
      No Records Found
    </p>
    <p className="mt-0.5 max-w-xs text-[11px] text-slate-400">{message}</p>
  </div>
);

const StatusBadge: React.FC<{ status: PayoutStatus }> = ({ status }) => {
  const styles: Record<PayoutStatus, string> = {
    SUCCESS:
      "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50",
    PROCESSING:
      "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50",
    PENDING:
      "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50",
    FAILED:
      "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50",
  };

  const labels: Record<PayoutStatus, string> = {
    SUCCESS: "Successful",
    PROCESSING: "Processing",
    PENDING: "Pending",
    FAILED: "Failed",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[9px] font-bold uppercase ${styles[status]}`}
    >
      <span className="h-1 w-1 rounded-full bg-current" />
      {labels[status]}
    </span>
  );
};

export default VendorDashboard;