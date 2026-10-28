import React, { useState } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  SignalIcon,
  ArrowsUpDownIcon,
  CalendarIcon,
  ServerIcon,
  CreditCardIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

interface TransactionFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  serviceFilter: string;
  setServiceFilter: (val: string) => void;
  mikrotikFilter: string;
  setMikrotikFilter: (val: string) => void;
  paymentModeFilter: string;
  setPaymentModeFilter: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
  mikrotikOptions: string[];
  paymentModeOptions: string[];
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  serviceFilter,
  setServiceFilter,
  mikrotikFilter,
  setMikrotikFilter,
  paymentModeFilter,
  setPaymentModeFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  sortOrder,
  setSortOrder,
  mikrotikOptions,
  paymentModeOptions,
  onResetFilters,
  hasActiveFilters,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-6 shadow-sm transition-all">
      {/* PRIMARY ROW: SEARCH, SORT & TOGGLE */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search phone, user, receipt..."
            className="w-full bg-slate-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-xs lg:text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sort Toggle */}
          <button
            onClick={() => setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))}
            className="flex items-center gap-1.5 bg-slate-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 px-3 py-2.5 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all"
          >
            <ArrowsUpDownIcon className="w-4 h-4 text-blue-500" />
            <span>{sortOrder === "desc" ? "Newest First" : "Oldest First"}</span>
          </button>

          {/* Advanced Filters Expand/Collapse Toggle */}
          <button
            onClick={() => setShowAdvanced((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold border transition-all ${
              hasActiveFilters || showAdvanced
                ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800"
                : "bg-slate-50 text-gray-700 border-gray-200 dark:bg-gray-900/60 dark:text-gray-300 dark:border-gray-700"
            }`}
          >
            <FunnelIcon className="w-4 h-4 text-blue-500" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            )}
            {showAdvanced ? (
              <ChevronUpIcon className="w-3.5 h-3.5" />
            ) : (
              <ChevronDownIcon className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 px-3 py-2.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
              title="Reset all filters"
            >
              <ArrowPathIcon className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* FILTER CONTROLS GRID */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Status Filter */}
          <div className="relative">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase block mb-1">
              Status
            </span>
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <select
                className="w-full bg-slate-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-lg py-2 pl-9 pr-8 text-xs font-semibold text-gray-700 dark:text-gray-300 appearance-none outline-none focus:ring-2 focus:ring-blue-500/20"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Service Filter */}
          <div className="relative">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase block mb-1">
              Service Type
            </span>
            <div className="relative">
              <SignalIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <select
                className="w-full bg-slate-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-lg py-2 pl-9 pr-8 text-xs font-semibold text-gray-700 dark:text-gray-300 appearance-none outline-none focus:ring-2 focus:ring-blue-500/20"
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
              >
                <option value="all">All Services</option>
                <option value="PPPOE">PPPOE</option>
                <option value="HOTSPOT">HOTSPOT</option>
              </select>
            </div>
          </div>

          {/* MikroTik Router Filter */}
          <div className="relative">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase block mb-1">
              MikroTik Router
            </span>
            <div className="relative">
              <ServerIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <select
                className="w-full bg-slate-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-lg py-2 pl-9 pr-8 text-xs font-semibold text-gray-700 dark:text-gray-300 appearance-none outline-none focus:ring-2 focus:ring-blue-500/20"
                value={mikrotikFilter}
                onChange={(e) => setMikrotikFilter(e.target.value)}
              >
                <option value="all">All Routers</option>
                {mikrotikOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Payment Mode Filter */}
          <div className="relative">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase block mb-1">
              Payment Mode
            </span>
            <div className="relative">
              <CreditCardIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <select
                className="w-full bg-slate-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-lg py-2 pl-9 pr-8 text-xs font-semibold text-gray-700 dark:text-gray-300 appearance-none outline-none focus:ring-2 focus:ring-blue-500/20"
                value={paymentModeFilter}
                onChange={(e) => setPaymentModeFilter(e.target.value)}
              >
                <option value="all">All Modes</option>
                {paymentModeOptions.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Start Date */}
          <div>
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase block mb-1">
              From Date
            </span>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-lg py-2 pl-9 pr-3 text-xs font-semibold text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* End Date */}
          <div>
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase block mb-1">
              To Date
            </span>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-lg py-2 pl-9 pr-3 text-xs font-semibold text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};