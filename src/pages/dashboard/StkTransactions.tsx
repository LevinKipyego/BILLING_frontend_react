import { useEffect, useState, useMemo } from "react";
import { fetchTransactions } from "../../api/transactions";
import type Transaction from "../../types/transactions";
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  CalendarIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  BanknotesIcon,
  SignalIcon,
  //DevicePhoneMobileIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowsUpDownIcon
} from "@heroicons/react/24/outline";

export default function StkTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI & Filter States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await fetchTransactions();
        setTransactions(data);
      } catch (err) {
        setError("Failed to sync with transaction node.");
      } finally {
        setLoading(false);
      }
    };
    loadTransactions();
  }, []);

  // Combined Filtering and Sorting Logic
  const processedData = useMemo(() => {
    // 1. Filter
    const filtered = transactions.filter(tx => {
      const matchesSearch = 
        tx.client_phone.includes(search) || 
        tx.username.toLowerCase().includes(search.toLowerCase()) ||
        tx.mpesa_receipt?.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || tx.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesService = serviceFilter === "all" || tx.service_type === serviceFilter;

      return matchesSearch && matchesStatus && matchesService;
    });

    // 2. Sort
    return filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [transactions, search, statusFilter, serviceFilter, sortOrder]);

  // Pagination Logic
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = processedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return (
    <div className="flex h-64 items-center justify-center font-['Figtree'] font-medium text-sm text-blue-500 bg-slate-50 dark:bg-gray-900">
      <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      Synchronizing Ledger...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-4 lg:p-8 font-['Figtree',sans-serif] transition-colors duration-500">
      
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Transaction <span className="text-blue-600">Ledger</span>
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
            Monitor and audit all incoming M-Pesa STK push requests.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg flex items-center gap-4 shadow-sm">
              <div className="bg-emerald-100 dark:bg-emerald-500/10 p-2 rounded-xl">
                <BanknotesIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Total Volume</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">KES {processedData.reduce((acc, curr) => acc + Number(curr.amount), 0).toLocaleString()}</p>
              </div>
           </div>
        </div>
      </div>

      {/* TOOLBAR: SEARCH, FILTERS, AND SORT TOGGLE */}
      <div className="flex flex-col xl:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search phone, user, or receipt..."
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-3 pl-12 pr-4 text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-3">
          <button 
            onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all shadow-sm"
          >
            <ArrowsUpDownIcon className="w-4 h-4 text-blue-500" />
            {sortOrder === "desc" ? "Newest First" : "Oldest First"}
          </button>

          <div className="relative">
            <FunnelIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select 
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-3 pl-11 pr-10 text-sm font-semibold text-gray-700 dark:text-gray-300 appearance-none outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="relative">
            <SignalIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select 
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg
              
            py-3 pl-11 pr-10 text-sm font-semibold text-gray-700 dark:text-gray-300 appearance-none outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
            >
              <option value="all">All Services</option>
              <option value="PPPOE">PPPOE</option>
              <option value="HOTSPOT">HOTSPOT</option>
            </select>
          </div>
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden lg:block overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <th className="p-5">Date & Time</th>
              <th className="p-5">Subscriber</th>
              <th className="p-5">Amount</th>
              <th className="p-5">Status</th>
              <th className="p-5">M-Pesa Receipt</th>
              <th className="p-5">Infrastructure</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedData.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="p-5">
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <CalendarIcon className="w-4 h-4 text-blue-500/70" />
                    <div className="flex flex-col">
                      <span>{new Date(tx.created_at).toLocaleDateString()}</span>
                      <span className="text-[11px] text-gray-400 font-normal">{new Date(tx.created_at).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex flex-col">
                       
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{tx.username}</span>
                    <span className="text-xs text-gray-500 font-medium">{tx.client_phone}</span>
                  </div>
                </td>
                <td className="p-5 text-sm font-bold text-gray-900 dark:text-white">
                  KES {tx.amount}
                </td>
                <td className="p-5">
                  <StatusBadge status={tx.status} />
                </td>
                <td className="p-5">
                   <span className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/5 text-blue-600 dark:text-blue-400 text-xs font-bold font-mono border border-blue-100 dark:border-blue-500/10">
                    {tx.mpesa_receipt || "WAITING"}
                  </span>
                </td>
                <td className="p-5">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{tx.mikrotik_identity_name}</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase">{tx.service_type}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {paginatedData.map((tx) => (
          <div key={tx.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-5">
              <StatusBadge status={tx.status} />
              <p className="text-sm font-bold text-gray-900 dark:text-white">KES {tx.amount}</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-400 uppercase">Subscriber</span>
                <span className="text-xs font-bold text-gray-900 dark:text-white">{tx.username}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-400 uppercase">Phone</span>
                <span className="text-xs font-bold text-gray-900 dark:text-white">{tx.client_phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-400 uppercase">Receipt</span>
                <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400">{tx.mpesa_receipt || "PENDING"}</span>
              </div>
              <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                 <span className="text-[10px] text-gray-400">{new Date(tx.created_at).toLocaleString()}</span>
                 <span className="text-[10px] font-bold text-gray-500 uppercase">{tx.service_type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION SECTION */}
      <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
          Results: {Math.min(processedData.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(processedData.length, currentPage * itemsPerPage)} of {processedData.length}
        </p>
        
        <div className="flex items-center gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-white disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          
          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-white disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Optimized Status Badge
const StatusBadge = ({ status }: { status: string }) => {
  const s = status.toLowerCase();
  if (s === 'success') return (
    <span className="inline-flex items-center gap-1.5 bg-emerald-100/60 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase border border-emerald-200 dark:border-emerald-500/20">
      <CheckCircleIcon className="w-3.5 h-3.5" /> Success
    </span>
  );
  if (s === 'failed') return (
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