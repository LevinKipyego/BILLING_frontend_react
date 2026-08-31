import { useEffect, useState, useMemo } from "react";
import { fetchTransactions } from "../../../api/transactions";
import type Transaction from "../../../types/transactions";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  BanknotesIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { TransactionCard } from "./components/TransactionCard";
import { TransactionTable } from "./components/TransactionTable";
import { TransactionFilters } from "./components/TransactionsFilter";

export default function StkTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI & Filter States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [mikrotikFilter, setMikrotikFilter] = useState("all");
  const [paymentModeFilter, setPaymentModeFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadTransactions = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await fetchTransactions();
      setTransactions(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("Failed to sync with transaction node.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // Reset pagination to page 1 whenever any filter configuration changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    serviceFilter,
    mikrotikFilter,
    paymentModeFilter,
    startDate,
    endDate,
  ]);

  // Dynamically extract unique MikroTik routers & Payment Modes from transaction set
  const mikrotikOptions = useMemo(() => {
    const names = transactions
      .map((tx) => tx.mikrotik_name)
      .filter((name): name is string => Boolean(name));
    return Array.from(new Set(names));
  }, [transactions]);

  const paymentModeOptions = useMemo(() => {
    const modes = transactions
      .map((tx) => tx.payment_mode)
      .filter((mode): mode is string => Boolean(mode));
    return Array.from(new Set(modes));
  }, [transactions]);

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return (
      search.trim() !== "" ||
      statusFilter !== "all" ||
      serviceFilter !== "all" ||
      mikrotikFilter !== "all" ||
      paymentModeFilter !== "all" ||
      startDate !== "" ||
      endDate !== ""
    );
  }, [
    search,
    statusFilter,
    serviceFilter,
    mikrotikFilter,
    paymentModeFilter,
    startDate,
    endDate,
  ]);

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setServiceFilter("all");
    setMikrotikFilter("all");
    setPaymentModeFilter("all");
    setStartDate("");
    setEndDate("");
  };

  // Combined Filtering and Sorting Logic
  const processedData = useMemo(() => {
    const filtered = transactions.filter((tx) => {
      const searchLower = search.toLowerCase().trim();

      // Search match across phone, username, and mpesa_receipt
      const matchesSearch =
        !searchLower ||
        String(tx.client_phone).includes(searchLower) ||
        String(tx.username || "").toLowerCase().includes(searchLower) ||
        String(tx.mpesa_receipt || "").toLowerCase().includes(searchLower);

      // Status and Service Type matches
      const matchesStatus =
        statusFilter === "all" ||
        tx.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesService =
        serviceFilter === "all" || tx.service_type === serviceFilter;

      // MikroTik & Payment Mode matches
      const matchesMikrotik =
        mikrotikFilter === "all" || tx.mikrotik_name === mikrotikFilter;
      const matchesPaymentMode =
        paymentModeFilter === "all" || tx.payment_mode === paymentModeFilter;

      // Date Range Match
      let matchesDate = true;
      if (tx.created_at) {
        const txDate = new Date(tx.created_at).getTime();
        if (startDate) {
          const start = new Date(startDate).setHours(0, 0, 0, 0);
          if (txDate < start) matchesDate = false;
        }
        if (endDate) {
          const end = new Date(endDate).setHours(23, 59, 59, 999);
          if (txDate > end) matchesDate = false;
        }
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesService &&
        matchesMikrotik &&
        matchesPaymentMode &&
        matchesDate
      );
    });

    // Sorting by created_at date
    return filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [
    transactions,
    search,
    statusFilter,
    serviceFilter,
    mikrotikFilter,
    paymentModeFilter,
    startDate,
    endDate,
    sortOrder,
  ]);

  // Pagination Logic
  const totalPages = Math.ceil(processedData.length / itemsPerPage) || 1;
  const paginatedData = processedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading)
    return (
      <div className="flex h-64 items-center justify-center font-['Comfortaa'] font-medium text-sm text-blue-500 bg-slate-50 dark:bg-gray-900">
        <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        Synchronizing Ledger...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-4 lg:p-8 text-[12px] lg:text-sm transition-colors duration-500">
      {/* ERROR DISPLAY BANNER */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-rose-500 shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">
                Sync Error
              </p>
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={loadTransactions}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-all shadow-sm"
            >
              <ArrowPathIcon className="w-3.5 h-3.5" /> Retry
            </button>
            <button
              onClick={() => setError(null)}
              className="text-xs font-bold text-rose-400 hover:text-rose-600 dark:hover:text-rose-200 p-1"
              title="Dismiss alert"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Transaction <span className="text-blue-600">Ledger</span>
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
            Monitor and audit all incoming M-Pesa transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl flex items-center gap-4 shadow-sm">
            <div className="bg-emerald-100 dark:bg-emerald-500/10 p-2 rounded-xl">
              <BanknotesIcon className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Filtered Volume
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                KES{" "}
                {processedData
                  .reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DEDICATED FILTER SUITE */}
      <TransactionFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        serviceFilter={serviceFilter}
        setServiceFilter={setServiceFilter}
        mikrotikFilter={mikrotikFilter}
        setMikrotikFilter={setMikrotikFilter}
        paymentModeFilter={paymentModeFilter}
        setPaymentModeFilter={setPaymentModeFilter}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        mikrotikOptions={mikrotikOptions}
        paymentModeOptions={paymentModeOptions}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* DESKTOP TABLE */}
      <TransactionTable
        paginatedData={paginatedData}
        error={error}
        StatusBadge={StatusBadge}
        onRowClick={(tx) => console.log("Selected Transaction:", tx)}
      />

      {/* MOBILE CARDS */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {paginatedData.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 font-medium">
            No transactions match your criteria.
          </div>
        ) : (
          paginatedData.map((tx) => (
            <TransactionCard
              key={tx.id}
              tx={tx}
              StatusBadge={StatusBadge}
            />
          ))
        )}
      </div>

      {/* PAGINATION SECTION */}
      {processedData.length > 0 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-center sm:text-left">
            Results:{" "}
            {Math.min(processedData.length, (currentPage - 1) * itemsPerPage + 1)}
            -
            {Math.min(processedData.length, currentPage * itemsPerPage)} of{" "}
            {processedData.length}
          </p>

          <div className="flex items-center gap-1.5 max-w-full justify-center">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-white disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm shrink-0"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>

            <div className="flex flex-wrap items-center gap-1 justify-center max-w-full">
              {(() => {
                const pages = [];
                const range = 1;

                for (let i = 1; i <= totalPages; i++) {
                  if (
                    i === 1 ||
                    i === totalPages ||
                    (i >= currentPage - range && i <= currentPage + range)
                  ) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs font-bold transition-all shrink-0 ${
                          currentPage === i
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                            : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {i}
                      </button>
                    );
                  } else if (i === 2 && currentPage - range > 2) {
                    pages.push(
                      <span
                        key="left-dots"
                        className="px-1 text-gray-400 dark:text-gray-500 text-xs font-bold select-none"
                      >
                        ...
                      </span>
                    );
                    i = currentPage - range - 1;
                  } else if (
                    i === currentPage + range + 1 &&
                    currentPage + range < totalPages - 1
                  ) {
                    pages.push(
                      <span
                        key="right-dots"
                        className="px-1 text-gray-400 dark:text-gray-500 text-xs font-bold select-none"
                      >
                        ...
                      </span>
                    );
                    i = totalPages - 1;
                  }
                }
                return pages;
              })()}
            </div>

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-white disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm shrink-0"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Optimized Status Badge
const StatusBadge = ({ status }: { status: string }) => {
  const s = status.toLowerCase();
  if (s === "success")
    return (
      <span className="inline-flex items-center gap-1.5 bg-emerald-100/60 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase border border-emerald-200 dark:border-emerald-500/20">
        <CheckCircleIcon className="w-3.5 h-3.5" /> Success
      </span>
    );
  if (s === "failed")
    return (
      <span className="inline-flex items-center gap-1.5 bg-rose-100/60 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase border border-rose-200 dark:border-rose-500/20">
        <XCircleIcon className="w-3.5 h-3.5" /> Failed
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 bg-amber-100/60 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase border border-amber-200 dark:border-amber-500/20">
      <ClockIcon className="w-3.5 h-3.5" /> Pending
    </span>
  );
};