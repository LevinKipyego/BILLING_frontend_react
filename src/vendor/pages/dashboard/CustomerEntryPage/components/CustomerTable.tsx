import  { useState, useMemo } from "react";
import { 
  Search, 
  
  ChevronLeft, 
  ChevronRight, 

  Users 
} from "lucide-react";

import CustomerRow from "./CustomerRow";
import CustomerActions from "./CustomerActions";
import ServiceBadge from "./ServiceBadge";
import StatusBadge from "./StatusBadge";

import type { Customer } from "../types/types";
import { formatDate } from "../renewsubscriptions/utils/date";

interface Props {
  customers: Customer[];
  loading?: boolean;
  onViewCustomer(customer: Customer): void;
  onCreatePPPoE(customer: Customer): void;
  onRenewCustomer?(customer: Customer): void;
  onSuspendCustomer?(customer: Customer): void;
  onDeleteCustomer?(customer: Customer): void;
}

type StatusFilter = "ALL" | "ACTIVE" | "ONLINE" | "OFFLINE" | "SUSPENDED";

export default function CustomerTable({
  customers,
  loading = false,
  onViewCustomer,
  onCreatePPPoE,
  onRenewCustomer,
  onSuspendCustomer,
  onDeleteCustomer,
}: Props) {
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [selectedDate, setSelectedDate] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 1. Filter Logic
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      // Search filter (Name or Username or Router IP)
      const matchesSearch =
        !searchQuery ||
        customer.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.router_ip?.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      let matchesStatus = true;
      if (statusFilter !== "ALL") {
        const cStatus = (customer.session_status || "").toUpperCase();
        matchesStatus = cStatus === statusFilter;
      }

      // Date filter (Compares against expires_at or created_at)
      let matchesDate = true;
      if (selectedDate && customer.expires_at) {
        const customerDate = new Date(customer.expires_at).toISOString().split("T")[0];
        matchesDate = customerDate === selectedDate;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [customers, searchQuery, statusFilter, selectedDate]);

  // 2. Pagination Calculation
  const totalItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  
  const paginatedCustomers = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredCustomers.slice(startIdx, startIdx + pageSize);
  }, [filteredCustomers, currentPage, pageSize]);

  // Reset page when filters change
  const handleFilterChange = (setter: () => void) => {
    setter();
    setCurrentPage(1);
  };

  // ---------------------------------------------------------------------------
  // 💀 LOADING SKELETON STATE
  // ---------------------------------------------------------------------------
  if (loading) {
    return (
      <div className="space-y-4">
        {/* Filter Bar Skeleton */}
        <div className="h-16 w-full animate-pulse rounded-xl border border-slate-200/80 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40" />

        {/* Desktop Table Skeleton */}
        <div className="hidden md:block overflow-visible rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4 animate-pulse">
                <div className="flex items-center gap-3 w-1/4">
                  <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
                  <div className="space-y-1.5 w-full">
                    <div className="h-3.5 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-2.5 w-1/2 rounded bg-slate-100 dark:bg-slate-800/60" />
                  </div>
                </div>
                <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-8 w-8 rounded bg-slate-200 dark:bg-slate-800 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Cards Skeleton */}
        <div className="grid gap-3 md:hidden">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-slate-200/80 bg-white p-4 space-y-3 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-28 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-2.5 w-20 rounded bg-slate-100 dark:bg-slate-800/60" />
                  </div>
                </div>
                <div className="h-6 w-6 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="h-12 rounded-lg bg-slate-100 dark:bg-slate-800/40" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 🔍 FILTER & SEARCH TOOLBAR */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:flex-row lg:items-center lg:justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer, username, or IP..."
            value={searchQuery}
            onChange={(e) => handleFilterChange(() => setSearchQuery(e.target.value))}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 transition-colors focus:border-slate-400 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-100 dark:focus:border-slate-700"
          />
        </div>

        {/* Filter Pills & Date Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Pills */}
          <div className="flex items-center rounded-lg border border-slate-200/80 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-800/50">
            {(["ALL", "ACTIVE", "ONLINE", "OFFLINE", "SUSPENDED"] as StatusFilter[]).map((st) => (
              <button
                key={st}
                onClick={() => handleFilterChange(() => setStatusFilter(st))}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                  statusFilter === st
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Date Selector */}
          <div className="relative flex items-center">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleFilterChange(() => setSelectedDate(e.target.value))}
              className="rounded-lg border border-slate-200 bg-slate-50/50 py-1.5 px-2.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-200 focus:outline-none"
            />
            {selectedDate && (
              <button
                onClick={() => handleFilterChange(() => setSelectedDate(""))}
                className="ml-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 📭 EMPTY STATE */}
      {!filteredCustomers.length ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
            <Users size={20} />
          </div>
          <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
            No customers found
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Try adjusting your search query, status, or date filter.
          </p>
        </div>
      ) : (
        <>
          {/* 📱 MOBILE CARD VIEW */}
          <div className="grid gap-3 md:hidden">
            {paginatedCustomers.map((customer) => {
              const initial = customer.full_name?.charAt(0).toUpperCase() || "?";

              return (
                <div
                  key={customer.id}
                  className="relative rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900/90"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        {initial}
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">
                          {customer.full_name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          @{customer.username}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <CustomerActions
                        customer={customer}
                        onCreatePPPoE={onCreatePPPoE}
                        onView={onViewCustomer}
                        onRenew={onRenewCustomer}
                        onSuspend={onSuspendCustomer}
                        onDelete={onDeleteCustomer}
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <StatusBadge customer={customer} />
                    <ServiceBadge service={customer.service_type} />
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-slate-500 dark:text-slate-400">Plan</span>
                      <div className="text-right">
                        <span className="font-medium text-slate-900 dark:text-white">
                          {customer.plan_name ?? "-"}
                        </span>
                        {customer.expires_at && (
                          <span className="ml-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                            • {formatDate(customer.expires_at)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-slate-500 dark:text-slate-400">Router</span>
                      <div className="text-right truncate max-w-[65%]">
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {customer.router_name ?? "-"}
                        </span>
                        {customer.router_ip && (
                          <span className="ml-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            ({customer.router_ip})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 🖥️ DESKTOP TABLE VIEW */}
          <div className="hidden md:block overflow-visible rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-visible rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider">
                      Router
                    </th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {paginatedCustomers.map((customer) => (
                    <CustomerRow
                      key={customer.id}
                      customer={customer}
                      onViewCustomer={onViewCustomer}
                      onCreatePPPoE={onCreatePPPoE}
                      onRenewCustomer={onRenewCustomer}
                      onSuspendCustomer={onSuspendCustomer}
                      onDeleteCustomer={onDeleteCustomer}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 📄 PAGINATION CONTROLS FOOTER */}
          <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 sm:flex-row">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 focus:outline-none"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span className="ml-2">
                Showing {Math.min((currentPage - 1) * pageSize + 1, totalItems)} to{" "}
                {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
              </span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <ChevronLeft size={16} />
              </button>
              
              <span className="px-2 font-medium text-slate-700 dark:text-slate-300">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}