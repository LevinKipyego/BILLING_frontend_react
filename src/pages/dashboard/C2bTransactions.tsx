import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "../../api/client";
import type { MpesaC2BTransaction } from "../../types/transactions";
import { 
  BanknotesIcon, 
  PhoneIcon, 
  CalendarDaysIcon, 
  IdentificationIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  ArrowsUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

export default function MpesaTransactions() {
  const [data, setData] = useState<MpesaC2BTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Controls
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  async function loadData() {
    setLoading(true);
    try {
      const res = await apiFetch("/client/c2b/c2btransactions/");
      setData(res);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  // 🔹 Process Data (Filter & Sort)
  const processedData = useMemo(() => {
    const filtered = data.filter(item => {
      const matchesSearch = 
        item.transaction_id.toLowerCase().includes(search.toLowerCase()) || 
        item.phone.includes(search) || 
        (item.plan || "").toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || item.status.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [data, search, statusFilter, sortOrder]);

  // 🔹 Pagination Calculation
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = processedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (loading && data.length === 0) return (
    <div className="flex h-64 items-center justify-center font-['Figtree'] font-medium text-sm text-emerald-500 bg-slate-50 dark:bg-gray-900">
       <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
       Syncing Ledger...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-4 lg:p-8 font-['Figtree',sans-serif] transition-colors duration-500">
      
      {/* HEADER */}
      <div className="mb-10 flex items-center gap-3">
        <div className="p-2.5 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-500/40">
          <BanknotesIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
            Mpesa <span className="text-emerald-600">Transactions</span>
          </h2>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 font-bold uppercase tracking-wider">C2B Payment Gateway</p>
        </div>
      </div>

      {/* FILTERS SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 mb-10">
        <div className="xl:col-span-2 relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by Phone, Ref or Plan..."
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
        
        <div className="grid grid-cols-2 xl:contents gap-4">
          <button 
            onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
            className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-[10px] font-bold text-gray-700 dark:text-gray-300 hover:border-emerald-500/50 transition-colors"
          >
            <ArrowsUpDownIcon className="w-3.5 h-3.5 text-emerald-500" />
            {sortOrder === "desc" ? "Latest" : "Oldest"}
          </button>
          
          <select 
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-[10px] font-bold text-gray-700 dark:text-gray-300 outline-none cursor-pointer hover:border-emerald-500/50 transition-colors"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* MOBILE LIST */}
      <div className="lg:hidden space-y-5">
        {paginatedData.map((item) => {
          const timing = formatDateTime(item.created_at);
          return (
            <div key={item.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[24px] p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-600">
                    <PhoneIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">{item.phone}</h4>
                    <p className="text-[9px] font-bold text-gray-400">REF: {item.transaction_id}</p>
                  </div>
                </div>
                <StatusBadge status={item.status} />
              </div>

              <div className="bg-slate-50 dark:bg-gray-900/50 rounded-xl p-3 mb-3 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Amount Paid</span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">KES {Number(item.amount).toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Plan</span>
                  <p className="text-[10px] font-bold text-gray-700 dark:text-gray-300">{item.plan || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CalendarDaysIcon className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  {timing.date} • {timing.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden lg:block overflow-hidden rounded-[32px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 backdrop-blur-md shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] font-black uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700">
              <th className="p-6">Transaction Details</th>
              <th className="p-6">Subscriber / Plan</th>
              <th className="p-6">Amount</th>
              <th className="p-6">Status</th>
              <th className="p-6 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedData.map((item) => {
              const timing = formatDateTime(item.created_at);
              return (
                <tr key={item.id} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-500/5 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-slate-100 dark:bg-gray-700 rounded-xl">
                        <IdentificationIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{item.transaction_id}</div>
                        <div className="text-[10px] font-bold text-gray-400">{item.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wide">User ID: #{item.user}</span>
                      <span className="text-[10px] font-bold text-gray-400">Plan: {item.plan || "Standard"}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">KES {Number(item.amount).toLocaleString()}</span>
                  </td>
                  <td className="p-6">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-gray-700 dark:text-gray-300">{timing.date}</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase">{timing.time}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINATION SECTION */}
      {processedData.length > 0 && (
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 px-2">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
             PAGE {currentPage} OF {totalPages || 1}
          </p>
          
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(p => p - 1)} 
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 disabled:opacity-20 transition-all hover:bg-slate-50 dark:hover:bg-gray-700"
            >
              <ChevronLeftIcon className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button 
              disabled={currentPage === totalPages || totalPages === 0} 
              onClick={() => setCurrentPage(p => p + 1)} 
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 disabled:opacity-20 transition-all hover:bg-slate-50 dark:hover:bg-gray-700"
            >
              <ChevronRightIcon className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      {processedData.length === 0 && (
        <div className="mt-10 text-center p-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[32px]">
          <BanknotesIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No transactions matched your criteria.</p>
        </div>
      )}
    </div>
  );
}

const StatusBadge = ({ status }: { status: string }) => {
  const s = status.toLowerCase();
  let style = "bg-gray-500/10 text-gray-500 border-gray-500/20";
  let icon = <ClockIcon className="w-3 h-3" />;

  if (s === "completed") {
    style = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    icon = <CheckCircleIcon className="w-3 h-3" />;
  } else if (s === "failed") {
    style = "bg-rose-500/10 text-rose-600 border-rose-500/20";
    icon = <XCircleIcon className="w-3 h-3" />;
  } else if (s === "pending") {
    style = "bg-amber-500/10 text-amber-600 border-amber-500/20";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border tracking-tight ${style}`}>
      {icon}
      {status}
    </span>
  );
};