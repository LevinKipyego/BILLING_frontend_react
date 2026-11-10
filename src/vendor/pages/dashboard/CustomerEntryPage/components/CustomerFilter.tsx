import { Search, SlidersHorizontal, X, Layers } from "lucide-react";
import type { MikrotikDevice } from "../../../../types/device";

export type StatusFilter = "ALL" | "ACTIVE" | "ONLINE" | "OFFLINE" | "SUSPENDED";
export type ServiceFilter = "ALL" | "PPPOE" | "HOTSPOT";

interface CustomerFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  serviceFilter: ServiceFilter;
  onServiceChange: (service: ServiceFilter) => void;
  selectedMikrotik: string;
  onMikrotikChange: (mikrotikId: string) => void;
  mikrotikDevices: MikrotikDevice[];
}

export default function CustomerFilter({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  serviceFilter,
  onServiceChange,
  selectedMikrotik,
  onMikrotikChange,
  mikrotikDevices,
}: CustomerFilterProps) {
  const statuses: { label: string; value: StatusFilter }[] = [
    { label: "All Statuses", value: "ALL" },
    { label: "Active", value: "ACTIVE" },
    { label: "Online", value: "ONLINE" },
    { label: "Offline", value: "OFFLINE" },
    { label: "Suspended", value: "SUSPENDED" },
  ];

  const services: { label: string; value: ServiceFilter }[] = [
    { label: "All Services", value: "ALL" },
    { label: "PPPoE", value: "PPPOE" },
    { label: "Hotspot", value: "HOTSPOT" },
  ];

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-gray-900 transition-colors duration-300">
      
      {/* Top Bar: Search and Router Selector */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search customer, username, or IP..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-8 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:bg-slate-800"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* MikroTik Router Selector */}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-48">
            <select
              value={selectedMikrotik}
              onChange={(e) => onMikrotikChange(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 truncate dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="">All MikroTik Routers</option>
              {mikrotikDevices.map((device) => (
                <option key={device.id} value={device.identity_name || String(device.id)}>
                  {device.identity_name || device.api_ip || `Router #${device.id}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Filter Button Pills Row: Service & Status */}
      <div className="flex flex-col gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
        
        {/* Service Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1 select-none">
              <Layers size={13} />
              Service:
            </span>
            {services.map((srv) => {
              const isSelected = serviceFilter === srv.value;
              return (
                <button
                  key={srv.value}
                  type="button"
                  onClick={() => onServiceChange(srv.value)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all shrink-0 border select-none cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs dark:bg-indigo-500 dark:border-indigo-500"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700/60"
                  }`}
                >
                  {srv.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status State Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1 select-none">
              <SlidersHorizontal size={13} />
              Status:
            </span>
            {statuses.map((st) => {
              const isSelected = statusFilter === st.value;
              return (
                <button
                  key={st.value}
                  type="button"
                  onClick={() => onStatusChange(st.value)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all shrink-0 border select-none cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700/60"
                  }`}
                >
                  {st.label}
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}