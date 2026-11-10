import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";

import CustomerRow from "./CustomerRow";
import CustomerActions from "./CustomerActions";
import ServiceBadge from "./ServiceBadge";
import StatusBadge from "./StatusBadge";
import CustomerFilter from "./CustomerFilter";
import type{ StatusFilter } from "./CustomerFilter";
import type { Customer } from "../types/types";
import type {  MikrotikDevice } from "../../../../types/device";
import { formatDate } from "../renewsubscriptions/utils/date";

interface Props {
  customers: Customer[];
  mikrotikDevices: MikrotikDevice[]; // Passed down to populate router filter
  loading?: boolean;
  onViewCustomer(customer: Customer): void;
  onCreatePPPoE(customer: Customer): void;
  onRenewCustomer?(customer: Customer): void;
  onSuspendCustomer?(customer: Customer): void;
  onDeleteCustomer?(customer: Customer): void;
}

export default function CustomerTable({
  customers,
  mikrotikDevices,
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
  const [serviceFilter, setServiceFilter] = useState<Parameters<typeof CustomerFilter>[0]["serviceFilter"]>("ALL");
  const [selectedMikrotik, setSelectedMikrotik] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 1. Filter Logic based on your specific requirements
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      // Search matching logic
      const matchesSearch =
        !searchQuery ||
        customer.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.router_ip?.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filtering rules implementation
      let matchesStatus = true;
      if (statusFilter === "ACTIVE") {
        matchesStatus = customer.active === true;
      } else if (statusFilter === "ONLINE") {
        matchesStatus = customer.session_status === "ONLINE";
      } else if (statusFilter === "OFFLINE") {
        // Offline status rule: session_status === "OFFLINE" && active === true
        matchesStatus = customer.session_status === "OFFLINE" && customer.active === true;
      } else if (statusFilter === "SUSPENDED") {
        // Suspended status rule: active === false
        matchesStatus = customer.active === false;
      }

      const matchesService = serviceFilter === "ALL" || customer.service_type === serviceFilter;

      // MikroTik router filter matching logic
      let matchesRouter = true;
      if (selectedMikrotik) {
        matchesRouter = customer.router_name === selectedMikrotik;
      }

      return matchesSearch && matchesStatus && matchesService && matchesRouter;
    });
  }, [customers, searchQuery, statusFilter, serviceFilter, selectedMikrotik]);

  // 2. Pagination Calculation
  const totalItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  
  const paginatedCustomers = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredCustomers.slice(startIdx, startIdx + pageSize);
  }, [filteredCustomers, currentPage, pageSize]);

  const handleStatusChange = (status: StatusFilter) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleServiceChange = (service: Parameters<typeof CustomerFilter>[0]["serviceFilter"]) => {
    setServiceFilter(service);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleMikrotikChange = (mikrotikId: string) => {
    setSelectedMikrotik(mikrotikId);
    setCurrentPage(1);
  };

  // ---------------------------------------------------------------------------
  // 💀 LOADING SKELETON STATE
  // ---------------------------------------------------------------------------
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-16 w-full animate-pulse rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-100 dark:bg-gray-800/40" />

        <div className="hidden md:block overflow-visible rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4 animate-pulse">
                <div className="flex items-center gap-3 w-1/4">
                  <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-gray-800 shrink-0" />
                  <div className="space-y-1.5 w-full">
                    <div className="h-3.5 w-3/4 rounded bg-slate-200 dark:bg-gray-800" />
                    <div className="h-2.5 w-1/2 rounded bg-slate-100 dark:bg-gray-800/60" />
                  </div>
                </div>
                <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-gray-800" />
                <div className="h-4 w-24 rounded bg-slate-200 dark:bg-gray-800" />
                <div className="h-4 w-20 rounded bg-slate-200 dark:bg-gray-800" />
                <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-gray-800" />
                <div className="h-8 w-8 rounded bg-slate-200 dark:bg-gray-800 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 md:hidden">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg border border-slate-200 dark:border-gray-700 bg-white p-4 space-y-3 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-gray-800" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-28 rounded bg-slate-200 dark:bg-gray-800" />
                    <div className="h-2.5 w-20 rounded bg-slate-100 dark:bg-gray-800/60" />
                  </div>
                </div>
                <div className="h-6 w-6 rounded bg-slate-200 dark:bg-gray-800" />
              </div>
              <div className="h-12 rounded-lg bg-slate-100 dark:bg-gray-800/40" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 🔍 FILTER COMPONENT INTEGRATION */}
      <CustomerFilter
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        serviceFilter={serviceFilter}
        onServiceChange={handleServiceChange}
        selectedMikrotik={selectedMikrotik}
        onMikrotikChange={handleMikrotikChange}
        mikrotikDevices={mikrotikDevices}
      />

      {/* 📭 EMPTY STATE */}
      {!filteredCustomers.length ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-gray-800 text-slate-400 dark:text-slate-500">
            <Users size={20} />
          </div>
          <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
            No customers found
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Try adjusting your search criteria, status filter, or selected router.
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
                  className="relative rounded-lg border border-slate-200 dark:border-gray-700 bg-white p-4 shadow-sm transition-all dark:bg-gray-900"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-gray-800 font-semibold text-slate-700 dark:text-slate-200 text-sm">
                        {initial}
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm truncate">
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

                  <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-gray-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">Plan</span>
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
                      <span className="text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">Router</span>
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
          <div className="hidden md:block overflow-visible rounded-lg border border-slate-200 dark:border-gray-700 bg-white shadow-sm dark:bg-gray-900">
            <div className="overflow-visible rounded-lg bg-white dark:bg-gray-900">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-gray-700 bg-slate-50/70 dark:bg-gray-800/40 text-slate-500 dark:text-slate-400">
                    <th className="px-5 py-3.5 text-[9px] font-medium uppercase tracking-[0.07em]">
                      Customer
                    </th>
                    <th className="px-5 py-3.5 text-[9px] font-medium uppercase tracking-[0.07em]">
                      Service
                    </th>
                    <th className="px-5 py-3.5 text-[9px] font-medium uppercase tracking-[0.07em]">
                      Plan
                    </th>
                    <th className="px-5 py-3.5 text-[9px] font-medium uppercase tracking-[0.07em]">
                      Router
                    </th>
                    <th className="px-5 py-3.5 text-[9px] font-medium uppercase tracking-[0.07em]">
                      Status
                    </th>
                    <th className="px-5 py-3.5 text-right text-[9px] font-medium uppercase tracking-[0.07em]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
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
          <div className="flex flex-col items-center justify-between gap-3 rounded-lg border border-slate-200 dark:border-gray-700 bg-white p-3.5 text-xs text-slate-500 dark:text-slate-400 dark:bg-gray-900 sm:flex-row">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-md border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 px-2 py-1 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span className="ml-2 font-mono">
                Showing {Math.min((currentPage - 1) * pageSize + 1, totalItems)} to{" "}
                {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
              </span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <ChevronLeft size={16} />
              </button>
              
              <span className="px-2 font-medium text-slate-700 dark:text-slate-300">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:hover:bg-transparent"
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